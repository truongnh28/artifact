#!/usr/bin/env node
// Dựng poster sketchnote từ blueprint JSON → HTML (rồi gọi render.mjs để ra PNG).
//
//   node build.mjs <blueprint.json> [out.html] [--png] [--pdf] [--a4] [--scale 2] [--theme blue-ink] [--cdn]
//
// Schema blueprint: xem references/blueprint-schema.md

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { icon, ICONS } from './icons.mjs';
import { THEMES } from './themes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const has = (f) => { const i = args.indexOf(f); if (i >= 0) { args.splice(i, 1); return true; } return false; };
const opt = (f, d) => { const i = args.indexOf(f); if (i >= 0) { const v = args[i + 1]; args.splice(i, 2); return v; } return d; };
const wantPng = has('--png');
const wantA4 = has('--a4');
const wantPdf = has('--pdf') || wantA4;
const scale = opt('--scale', '2');
const themeFlag = opt('--theme');
// Mặc định dùng font + KaTeX đóng gói trong assets/ (chạy offline, PNG chuẩn).
// --cdn: tham chiếu CDN để file HTML mang đi nơi khác vẫn mở được.
const useCdn = has('--cdn');
const assets = pathToFileURL(join(here, '..', 'assets')).href;
const A = useCdn
  ? { fonts: 'https://fonts.googleapis.com/css2?family=Mali:wght@400;500;600;700&family=Pangolin&family=Itim&family=Patrick+Hand&display=swap',
      katex: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist' }
  : { fonts: `${assets}/fonts/fonts.css`, katex: `${assets}/katex` };
const [bpPath, outArg] = args;
if (!bpPath) {
  console.error('Usage: node build.mjs <blueprint.json> [out.html] [--png] [--pdf] [--a4] [--scale 2] [--theme blue-ink] [--cdn]');
  process.exit(1);
}

const bp = JSON.parse(readFileSync(bpPath, 'utf8'));
const out = resolve(outArg ?? bpPath.replace(/\.json$/i, '') + '.html');
bp.theme = themeFlag ?? bp.theme ?? 'blue-ink';
const theme = THEMES[bp.theme];
if (!theme) throw new Error(`Theme không tồn tại: ${bp.theme}. Có: ${Object.keys(THEMES).join(', ')}`);

const warnings = [];
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Phân số inline của KaTeX rất nhỏ; trong thân thẻ dùng \dfrac cho dễ đọc như chữ viết tay.
const bigFrac = (tex) => tex.replace(/\\frac(?=\s*\{|\s*[0-9a-zA-Z])/g, '\\dfrac');

// Inline: giữ nguyên $...$ cho KaTeX, **đậm**, ==tô sáng==, :icon: → icon nhỏ.
// Công thức được thay bằng chỗ giữ tạm trước khi xử lý **/==, nên "**chia $3{,}6$**" vẫn đậm đúng.
function inline(text, { big = false } = {}) {
  const math = [];
  const held = String(text ?? '').replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, (m) => {
    math.push(esc(big ? bigFrac(m) : m));
    return `\u0000${math.length - 1}\u0000`;
  });
  let html = esc(held)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/&lt;br\s*\/?&gt;/g, '<br>')
    .replace(/:([a-z-]+):/g, (m, n) => {
      if (ICONS[n]) return icon(n, 'ic');
      warnings.push(`Icon không có: ${n}`);
      return m;
    });
  if (/\*\*|==/.test(html)) warnings.push(`Dấu ** hoặc == chưa đóng: "${text}"`);
  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => math[i]);
}

const BIG = { big: true };

function body(lines = []) {
  let html = '';
  let inList = false;
  for (const raw of [].concat(lines)) {
    const line = String(raw);
    const bullet = line.match(/^\s*[-•]\s+(.*)$/);
    if (bullet) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(bullet[1], BIG)}</li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    const callout = line.match(/^>\s+(.*)$/);
    if (callout) html += `<p class="callout">${inline(callout[1], BIG)}</p>`;
    else if (/^\$\$[\s\S]+\$\$$/.test(line.trim())) html += `<div class="display">${esc(line.trim())}</div>`;
    else html += `<p>${inline(line, BIG)}</p>`;
  }
  if (inList) html += '</ul>';
  return html;
}

// ---------- Hình minh hoạ trong thẻ ----------
const VISUALS = {
  icon: (v) => `<div class="v-icon ${v.align ?? 'right'}">${icon(v.name, 'doodle big')}</div>`,

  formula: (v) => `<div class="v-formula">
      <svg class="blob" viewBox="0 0 200 90" preserveAspectRatio="none"><path d="M18 46c-14-20 10-38 34-30 10-16 44-16 56-2 18-12 52-6 54 14 26 4 30 34 6 42 4 18-30 24-46 12-14 14-52 14-64 0-22 8-48-4-40-36z"/></svg>
      <div class="tex">${esc(v.tex.startsWith('$') ? v.tex : `$${v.tex}$`)}</div>
      ${v.note ? `<div class="note">${inline(v.note)}</div>` : ''}
    </div>`,

  numberline: (v) => {
    const min = v.min ?? -2, max = v.max ?? 2, step = v.step ?? 1;
    const W = 300, pad = 22, y = 30;
    const X = (x) => pad + ((x - min) / (max - min)) * (W - 2 * pad);
    let ticks = '';
    for (let x = min; x <= max + 1e-9; x += step) {
      ticks += `<line x1="${X(x)}" y1="${y - 6}" x2="${X(x)}" y2="${y + 6}"/>`;
    }
    const tickLabels = [];
    for (let x = min; x <= max + 1e-9; x += step) tickLabels.push({ x: X(x), t: String(+x.toFixed(4)).replace('-', '−') });
    const pts = (v.points ?? []).map((p) => ({ x: X(p.x), label: p.label }));
    return `<div class="v-numberline">
      <svg viewBox="0 0 ${W} 60"><g class="axis"><path d="M6 ${y}L${W - 6} ${y}M${W - 14} ${y - 6}L${W - 6} ${y}L${W - 14} ${y + 6}"/>${ticks}</g>
      ${pts.map((p) => `<circle cx="${p.x}" cy="${y}" r="4.5" class="pt"/><path class="arrowup" d="M${p.x} ${y + 26}V${y + 10}M${p.x - 4} ${y + 15}L${p.x} ${y + 10}L${p.x + 4} ${y + 15}"/>`).join('')}
      </svg>
      ${tickLabels.map((t) => `<span class="tick" style="left:${(t.x / W) * 100}%">${t.t}</span>`).join('')}
      ${pts.map((p) => `<span class="plabel" style="left:${(p.x / W) * 100}%">${esc(bigFrac(p.label.startsWith('$') ? p.label : `$${p.label}$`))}</span>`).join('')}
    </div>`;
  },

  nested: (v) => {
    const sets = v.sets ?? [];
    const n = sets.length;
    // Mỗi vòng ngoài chừa một dải 34px phía trên cho nhãn; vòng trong cùng ghi nhãn ở giữa.
    const band = 34, H = 56 + n * band;
    const geo = sets.map((_, i) => {
      const top = 3 + i * band, bottom = H - 3 - i * 7;
      return { top, cy: (top + bottom) / 2, ry: (bottom - top) / 2, rx: 147 - i * 26 };
    });
    const rings = geo.map((g, i) =>
      `<ellipse cx="150" cy="${g.cy}" rx="${g.rx}" ry="${g.ry}" class="ring r${i}"/>`).join('');
    const labels = sets.map((s, i) => {
      const g = geo[i];
      const y = i === n - 1 ? g.cy - 11 : g.top + 7;
      return `<span class="slabel" style="top:${(y / H) * 100}%">${inline(s)}</span>`;
    }).join('');
    return `<div class="v-nested"><svg viewBox="0 0 300 ${H}">${rings}</svg>${labels}</div>`;
  },

  // Đồ thị đơn giản: trục toạ độ + các đường gấp khúc; tô vùng dưới một đường (diện tích = quãng đường…).
  graph: (v) => {
    const W = 300, H = 170, L = 34, R = 16, T = 14, B = 28;
    const lines = (v.lines ?? []).map((l) => (Array.isArray(l) ? { points: l } : l));
    const all = lines.flatMap((l) => l.points);
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    const x0 = Math.min(0, ...xs), x1 = (v.xmax ?? Math.max(...xs) * 1.12) || 1;
    const y0 = Math.min(0, ...ys), y1 = (v.ymax ?? Math.max(...ys) * 1.18) || 1;
    const X = (x) => L + ((x - x0) / (x1 - x0)) * (W - L - R);
    const Y = (y) => H - B - ((y - y0) / (y1 - y0)) * (H - B - T);
    const pts = (l) => l.points.map((p) => `${X(p[0])},${Y(p[1])}`).join(' ');
    const shade = v.shade != null && lines[v.shade]
      ? `<polygon class="area" points="${X(lines[v.shade].points[0][0])},${Y(0)} ${pts(lines[v.shade])} ${X(lines[v.shade].points.at(-1)[0])},${Y(0)}"/>` : '';
    const guides = (v.marks ?? []).map((m) => `<path class="guide" d="M${X(m.at[0])} ${Y(0)}V${Y(m.at[1])}H${X(0)}"/><circle class="pt" cx="${X(m.at[0])}" cy="${Y(m.at[1])}" r="3.5"/>`).join('');
    const lab = (x, y, t, cls = '') => `<span class="glabel ${cls}" style="left:${(x / W) * 100}%;top:${(y / H) * 100}%">${inline(t.includes('$') ? t : `$${t}$`)}</span>`;
    return `<div class="v-graph"><div class="gbox"><svg viewBox="0 0 ${W} ${H}">
      ${shade}
      <g class="axis"><path d="M${L} ${H - B + 6}V${T - 4}M${L - 5} ${T + 3}L${L} ${T - 4}L${L + 5} ${T + 3}"/><path d="M${L - 6} ${Y(0)}H${W - 4}M${W - 11} ${Y(0) - 5}L${W - 4} ${Y(0)}L${W - 11} ${Y(0) + 5}"/></g>
      ${guides}
      ${lines.map((l, i) => `<polyline class="gline g${i}" points="${pts(l)}"/>`).join('')}
    </svg>
    ${lab(L - 12, T - 2, v.y ?? 'y')}${lab(W - 8, Y(0) + 12, v.x ?? 'x')}${lab(L - 10, Y(0) + 10, 'O')}
    ${(v.marks ?? []).filter((m) => m.label).map((m) => lab(X(m.at[0]) + 4, Y(m.at[1]) - 12, m.label, 'mark')).join('')}
    ${lines.filter((l) => l.label).map((l) => { const p = l.points.at(-1); return lab(X(p[0]) - 4, Y(p[1]) - 13, l.label, 'line'); }).join('')}
    </div>
    ${v.caption ? `<div class="gcap">${inline(v.caption)}</div>` : ''}
    </div>`;
  },

  // Mũi tên dính liền bước sau (không rơi lẻ khi xuống dòng); arrows[i] là nhãn trên mũi tên thứ i.
  steps: (v) => `<div class="v-steps">${(v.items ?? []).map((s, i) => {
      const lbl = i && v.arrows?.[i - 1] ? `<span class="arr-lbl">${inline(v.arrows[i - 1])}</span>` : '';
      const arr = i ? `<span class="arr">${lbl}<span class="arr-head">➜</span></span>` : '';
      return `<span class="step-wrap">${arr}<span class="step">${inline(s)}</span></span>`;
    }).join('')}</div>`,

  // Phương trình chữ (sinh, hoá): vế trái → vế phải, điều kiện ghi trên/dưới mũi tên, dùng font viết tay.
  equation: (v) => {
    const side = (xs) => [].concat(xs ?? []).map((t) => `<span class="term">${inline(t)}</span>`).join('<span class="plus">+</span>');
    return `<div class="v-equation"><div class="side">${side(v.left)}</div>
      <div class="eq-arrow">${v.over ? `<span class="over">${inline(v.over)}</span>` : ''}<svg viewBox="0 0 90 14" preserveAspectRatio="none"><path d="M2 7H86M78 2L87 7L78 12"/></svg>${v.under ? `<span class="under">${inline(v.under)}</span>` : ''}</div>
      <div class="side">${side(v.right)}</div></div>`;
  },

  table: (v) => `<table class="v-table">${(v.head ? `<tr>${v.head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr>` : '')}${
      (v.rows ?? []).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</table>`,

  compare: (v) => `<div class="v-compare"><div>${body(v.left)}</div><span class="vs">${inline(v.sep ?? 'vs')}</span><div>${body(v.right)}</div></div>`,

  icons: (v) => `<div class="v-icons">${(v.names ?? []).map((n) => icon(n, 'doodle mid')).join('')}</div>`,
};

function visual(v) {
  if (!v) return '';
  const list = Array.isArray(v) ? v : [v];
  return list.map((x) => {
    const f = VISUALS[x.type];
    if (!f) { warnings.push(`Visual không hỗ trợ: ${x.type}`); return ''; }
    return f(x);
  }).join('');
}

// ---------- Bố cục ----------
const cards = bp.cards ?? [];
const cols = bp.columns ?? (cards.length <= 4 ? 2 : 3);
if (cards.length > 9) warnings.push(`Có ${cards.length} thẻ — nên ≤ 9; gộp hoặc bỏ ý yếu nhất.`);
// Đếm theo tiếng (âm tiết) như cách đếm chữ tiếng Việt; công thức tính là 1.
const syllables = (t) => String(t ?? '').replace(/\$\$?[^$]*\$\$?/g, 'X').replace(/[-•>*=]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
for (const [i, c] of cards.entries()) {
  const n = syllables([].concat(c.body ?? []).join(' '));
  if (n > 55) warnings.push(`Thẻ ${i + 1} "${c.title}" dài ${n} tiếng — nên ≤ 50; chuyển bớt sang visual hoặc tách thẻ.`);
  if (!c.keywords) warnings.push(`Thẻ ${i + 1} "${c.title}" thiếu từ khoá.`);
  else {
    const terms = c.keywords.replace(/\$[^$]*\$/g, 'X').split(/[,;]/).length, kn = syllables(c.keywords);
    if (terms > 4 || kn > 8) warnings.push(`Từ khoá thẻ ${i + 1} dài (${terms} cụm, ${kn} tiếng) — nên ≤ 4 cụm, ≤ 8 tiếng.`);
  }
  if (syllables(c.title.replace(/\$[^$]*\$/g, 'X')) > 8) warnings.push(`Tiêu đề thẻ ${i + 1} dài — nên 2–6 tiếng.`);
}
const cells = cards.reduce((a, c) => a + Math.min(c.span === 3 ? cols : (c.span ?? 1), cols), 0);
if (cells % cols) warnings.push(`Lưới ${cols} cột còn trống ${cols - (cells % cols)} ô ở hàng cuối — thêm/bớt thẻ hoặc dùng "span".`);

const cardHtml = cards.map((c, i) => `
  <section class="card${c.span ? ` span-${c.span}` : ''}">
    <header><span class="num">${i + 1}</span><h3>${inline(c.title)}</h3></header>
    <div class="content">${c.visualFirst ? visual(c.visual) + body(c.body) : body(c.body) + visual(c.visual)}</div>
    ${c.keywords ? `<footer><span class="kw">${esc(bp.labels?.keywords ?? 'TỪ KHÓA')}</span><span>${inline(c.keywords)}</span></footer>` : ''}
  </section>`).join('');

const h = bp.header ?? {};
const recap = bp.recap;
const deco = bp.decorations ?? ['laurel', 'star'];

const html = `<!doctype html>
<html lang="${bp.lang ?? 'vi'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(h.subtitle ?? h.title ?? 'Sketchnote')}</title>
<link href="${A.fonts}" rel="stylesheet">
<link rel="stylesheet" href="${A.katex}/katex.min.css">
<script>window.__renderDone = false;
// Công thức rộng hơn khung thì thu nhỏ dần cho vừa (thay vì bị cắt).
function fitFormulas(){document.fonts.ready.then(()=>{for(const el of document.querySelectorAll('.v-formula .tex,.display')){let f=100;while(el.scrollWidth>el.clientWidth+1&&f>55){f-=5;el.style.fontSize=f+'%';}}});}
</script>
<script defer src="${A.katex}/katex.min.js"></script>
<script defer src="${A.katex}/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});fitFormulas();window.__renderDone=true;"
  onerror="window.__renderDone=true;"></script>
<style>${readFileSync(join(here, 'poster.css'), 'utf8')}
:root{${Object.entries(theme.vars).map(([k, v]) => `--${k}:${v}`).join(';')}}
</style>
</head>
<body class="theme-${bp.theme ?? 'blue-ink'}">
<svg width="0" height="0" style="position:absolute">
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${bp.seed ?? 7}"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>
  <filter id="rough-strong"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
</svg>
<main class="poster cols-${cols}">
  <div class="hero">
    ${deco.includes('star') ? `${icon('star', 'deco star s1')}${icon('star', 'deco star s2')}` : ''}
    ${deco.includes('laurel') ? `${icon('laurel', 'deco laurel l')}${icon('laurel', 'deco laurel r')}` : ''}
    ${h.title ? `<div class="banner"><svg viewBox="0 0 600 120" preserveAspectRatio="none"><path class="ribbon-tail" d="M40 40L0 52l22 22L0 96l58-4zM560 40l40 12-22 22 22 22-58-4z"/><path class="ribbon" d="M40 18C200 4 400 4 560 18l4 80C400 86 200 86 36 98z"/></svg><h1>${inline(h.title)}</h1></div>` : ''}
    ${h.tag ? `<div class="tag">${inline(h.tag)}</div>` : ''}
    ${h.subtitle ? `<h2 class="subtitle">${inline(h.subtitle)}</h2>` : ''}
    <svg class="wave" viewBox="0 0 400 16"><path d="M4 8c25-8 25 8 50 0s25 8 50 0 25 8 50 0 25 8 50 0 25 8 50 0 25 8 50 0 25 8 50 0"/></svg>
  </div>
  <div class="grid">${cardHtml}</div>
  ${recap ? `<section class="recap">
    <div class="recap-label">${icon('bulb', 'doodle mid')}<span>${inline(recap.label ?? 'GHI NHỚ NHANH')}</span></div>
    <ul>${(recap.items ?? []).map((t) => `<li>${icon('check', 'ic')}<span>${inline(t, BIG)}</span></li>`).join('')}</ul>
    ${icon(recap.icon ?? 'stack', 'deco recap-deco')}
  </section>` : ''}
  ${bp.footer ? `<footer class="slogan">${icon('book', 'doodle mid')}<span>${inline(bp.footer)}</span>${icon('plant', 'doodle mid')}</footer>` : ''}
  ${bp.source ? `<div class="source">Nguồn: ${inline(bp.source)}</div>` : ''}
</main>
</body>
</html>`;

writeFileSync(out, html);
console.log(out);
for (const w of new Set(warnings)) console.error('⚠️ ', w);

if (wantPng || wantPdf) {
  const r = spawnSync(process.execPath, [join(here, 'render.mjs'), out, out.replace(/\.html$/, '.png'),
    '--width', String(bp.width ?? (cols === 2 ? 820 : 1080)), '--scale', scale, ...(wantPdf ? ['--pdf'] : []), ...(wantA4 ? ['--a4'] : [])],
    { stdio: 'inherit' });
  process.exitCode = r.status ?? 1;
}
