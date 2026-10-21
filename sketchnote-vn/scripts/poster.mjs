// Dựng phần thân poster (<main class="poster">) từ blueprint — dùng chung cho bản PNG (build.mjs)
// và bản web (web.mjs).
//
// renderPoster(bp, { math }) → { html, warnings, cols, dense }
//   math(tex, display) tuỳ chọn: trả HTML đã dựng sẵn cho công thức. Không truyền thì công thức
//   được giữ dạng $...$ để KaTeX auto-render xử lý trong trình duyệt.

import { icon, ICONS } from './icons.mjs';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Phân số inline của KaTeX rất nhỏ; trong thân thẻ dùng \dfrac cho dễ đọc như chữ viết tay.
const bigFrac = (tex) => tex.replace(/\\frac(?=\s*\{|\s*[0-9a-zA-Z])/g, '\\dfrac');

// Đếm theo tiếng (âm tiết) như cách đếm chữ tiếng Việt; công thức tính là 1.
const syllables = (t) => String(t ?? '').replace(/\$\$?[^$]*\$\$?/g, 'X').replace(/[-•>*=]/g, ' ').trim().split(/\s+/).filter(Boolean).length;

export const FILTERS = (seed = 7) => `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>
  <filter id="rough-strong"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
</svg>`;

export function renderPoster(bp, { math, id } = {}) {
  const warnings = [];

  // "$...$" hoặc "$$...$$" → HTML (dựng sẵn) hoặc giữ nguyên cho auto-render.
  const M = (m, big = false) => {
    const src = big ? bigFrac(m) : m;
    if (!math) return esc(src);
    const display = src.startsWith('$$');
    return math(src.slice(display ? 2 : 1, display ? -2 : -1), display);
  };
  const wrapTex = (t) => (t.startsWith('$') ? t : `$${t}$`);

  // Inline: công thức, **đậm**, ==tô sáng==, <br>, :icon:. Công thức được giữ chỗ trước để
  // "**chia $3{,}6$**" vẫn đậm đúng.
  function inline(text, { big = false } = {}) {
    const held = [];
    const t = String(text ?? '').replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, (m) => {
      held.push(M(m, big));
      return `\u0000${held.length - 1}\u0000`;
    });
    const html = esc(t)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>')
      .replace(/:([a-z-]+):/g, (m, n) => {
        if (ICONS[n]) return icon(n, 'ic');
        warnings.push(`Icon không có: ${n}`);
        return m;
      });
    if (/\*\*|==/.test(html)) warnings.push(`Dấu ** hoặc == chưa đóng: "${text}"`);
    return html.replace(/\u0000(\d+)\u0000/g, (_, i) => held[i]);
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
      else if (/^\$\$[\s\S]+\$\$$/.test(line.trim())) html += `<div class="display">${M(line.trim())}</div>`;
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
        <div class="tex">${M(wrapTex(v.tex))}</div>
        ${v.note ? `<div class="note">${inline(v.note)}</div>` : ''}
      </div>`,

    numberline: (v) => {
      const min = v.min ?? -2, max = v.max ?? 2, step = v.step ?? 1;
      const W = 300, pad = 22, y = 30;
      const X = (x) => pad + ((x - min) / (max - min)) * (W - 2 * pad);
      let ticks = '';
      const tickLabels = [];
      for (let x = min; x <= max + 1e-9; x += step) {
        ticks += `<line x1="${X(x)}" y1="${y - 6}" x2="${X(x)}" y2="${y + 6}"/>`;
        tickLabels.push({ x: X(x), t: String(+x.toFixed(4)).replace('-', '−') });
      }
      const pts = (v.points ?? []).map((p) => ({ x: X(p.x), label: p.label }));
      return `<div class="v-numberline">
        <svg viewBox="0 0 ${W} 60"><g class="axis"><path d="M6 ${y}L${W - 6} ${y}M${W - 14} ${y - 6}L${W - 6} ${y}L${W - 14} ${y + 6}"/>${ticks}</g>
        ${pts.map((p, i) => `<g class="np" style="--i:${i}"><circle cx="${p.x}" cy="${y}" r="4.5" class="pt"/><path class="arrowup" d="M${p.x} ${y + 26}V${y + 10}M${p.x - 4} ${y + 15}L${p.x} ${y + 10}L${p.x + 4} ${y + 15}"/></g>`).join('')}
        </svg>
        ${tickLabels.map((t) => `<span class="tick" style="left:${(t.x / W) * 100}%">${t.t}</span>`).join('')}
        ${pts.map((p, i) => `<span class="plabel" style="left:${(p.x / W) * 100}%;--i:${i}">${M(wrapTex(p.label), true)}</span>`).join('')}
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
        `<ellipse cx="150" cy="${g.cy}" rx="${g.rx}" ry="${g.ry}" class="ring r${i}" style="--i:${i}"/>`).join('');
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

    // Trục thời gian Quá khứ – Hiện tại – Tương lai (thì động từ, lịch sử…). Toạ độ -1…1, "now" = 0.
    // marks: { at: số | [số…], to?: số, kind: point|repeat|range, label }
    timeline: (v) => {
      const W = 300, H = 44, y = 22, L = 14, R = 14;
      const X = (t) => L + ((t + 1) / 2) * (W - L - R);
      const labels = v.labels ?? ['Quá khứ', 'Hiện tại', 'Tương lai'];
      const marks = (v.marks ?? []).map((m, k) => {
        const kind = m.kind ?? (Array.isArray(m.at) ? 'repeat' : m.to != null ? 'range' : 'point');
        const ats = [].concat(m.at);
        let g = '';
        if (kind === 'range') {
          g = `<rect class="tl-range" x="${X(ats[0])}" y="${y - 7}" width="${X(m.to) - X(ats[0])}" height="14" rx="7"/>`;
        } else {
          g = ats.map((a, i) => `<circle class="tl-dot" cx="${X(a)}" cy="${y}" r="6" style="--i:${i}"/>`).join('');
          if (m.done) g += `<path class="tl-done" d="M${X(ats.at(-1)) - 4} ${y}l3 3 6-7"/>`;
        }
        const mid = kind === 'range' ? (X(ats[0]) + X(m.to)) / 2 : ats.reduce((a, b) => a + X(b), 0) / ats.length;
        return { g: `<g class="tl-mark tl-${kind}" style="--k:${k}">${g}</g>`, label: m.label, mid };
      });
      return `<div class="v-timeline"><svg viewBox="0 0 ${W} ${H}">
          <path class="tl-axis" d="M${L - 6} ${y}H${W - L + 8}M${W - L + 1} ${y - 5}L${W - L + 8} ${y}L${W - L + 1} ${y + 5}"/>
          <line class="tl-now" x1="${X(0)}" y1="${y - 16}" x2="${X(0)}" y2="${y + 16}"/>
          ${marks.map((m) => m.g).join('')}
        </svg>
        ${marks.filter((m) => m.label).map((m) => `<span class="tl-label" style="left:${(m.mid / W) * 100}%">${inline(m.label)}</span>`).join('')}
        <div class="tl-axis-labels"><span>${inline(labels[0])}</span><span class="now">${inline(labels[1])}</span><span>${inline(labels[2])}</span></div>
      </div>`;
    },

    // Mũi tên dính liền bước sau (không rơi lẻ khi xuống dòng); arrows[i] là nhãn trên mũi tên thứ i.
    steps: (v) => `<div class="v-steps">${(v.items ?? []).map((s, i) => {
        const lbl = i && v.arrows?.[i - 1] ? `<span class="arr-lbl">${inline(v.arrows[i - 1])}</span>` : '';
        const arr = i ? `<span class="arr">${lbl}<span class="arr-head">➜</span></span>` : '';
        return `<span class="step-wrap" style="--i:${i}">${arr}<span class="step">${inline(s)}</span></span>`;
      }).join('')}</div>`,

    // Phương trình chữ (sinh, hoá): vế trái → vế phải, điều kiện ghi trên/dưới mũi tên, dùng font viết tay.
    equation: (v) => {
      const side = (xs) => [].concat(xs ?? []).map((t) => `<span class="term">${inline(t)}</span>`).join('<span class="plus">+</span>');
      return `<div class="v-equation"><div class="side">${side(v.left)}</div>
        <div class="eq-arrow">${v.over ? `<span class="over">${inline(v.over)}</span>` : ''}<svg viewBox="0 0 90 14" preserveAspectRatio="none"><path d="M2 7H86M78 2L87 7L78 12"/></svg>${v.under ? `<span class="under">${inline(v.under)}</span>` : ''}</div>
        <div class="side">${side(v.right)}</div></div>`;
    },

    table: (v) => `<div class="tbl"><table class="v-table">${(v.head ? `<tr>${v.head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr>` : '')}${
        (v.rows ?? []).map((r, i) => `<tr style="--i:${i}">${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</table></div>`,

    compare: (v) => `<div class="v-compare"><div>${body(v.left)}</div><span class="vs">${inline(v.sep ?? 'vs')}</span><div>${body(v.right)}</div></div>`,

    icons: (v) => `<div class="v-icons">${(v.names ?? []).map((n) => icon(n, 'doodle mid')).join('')}</div>`,
  };

  function visual(v) {
    if (!v) return '';
    return [].concat(v).map((x) => {
      const f = VISUALS[x.type];
      if (!f) { warnings.push(`Visual không hỗ trợ: ${x.type}`); return ''; }
      return f(x);
    }).join('');
  }

  // ---------- Kiểm tra nội dung ----------
  const cards = bp.cards ?? [];
  const cols = bp.columns ?? (cards.length <= 4 ? 2 : 3);
  // Chế độ dày (density: "dense") chữ nhỏ hơn, cho phép thẻ chứa nhiều hơn: ví dụ, dấu hiệu, lưu ý.
  const dense = bp.density === 'dense';
  const LIMIT = dense ? 95 : 55;
  if (cards.length > 9) warnings.push(`Có ${cards.length} thẻ — nên ≤ 9; gộp hoặc bỏ ý yếu nhất.`);
  for (const [i, c] of cards.entries()) {
    const n = syllables([].concat(c.body ?? [], c.after ?? []).join(' '));
    if (n > LIMIT) warnings.push(`Thẻ ${i + 1} "${c.title}" dài ${n} tiếng — nên ≤ ${LIMIT - 5}; chuyển bớt sang visual hoặc tách thẻ.`);
    if (!c.keywords) warnings.push(`Thẻ ${i + 1} "${c.title}" thiếu từ khoá.`);
    else {
      const terms = c.keywords.replace(/\$[^$]*\$/g, 'X').split(/[,;]/).length, kn = syllables(c.keywords);
      if (terms > 4 || kn > 8) warnings.push(`Từ khoá thẻ ${i + 1} dài (${terms} cụm, ${kn} tiếng) — nên ≤ 4 cụm, ≤ 8 tiếng.`);
    }
    if (syllables(c.title.replace(/\$[^$]*\$/g, 'X')) > 8) warnings.push(`Tiêu đề thẻ ${i + 1} dài — nên 2–6 tiếng.`);
  }
  const cells = cards.reduce((a, c) => a + Math.min(c.span === 3 ? cols : (c.span ?? 1), cols), 0);
  if (cells % cols) warnings.push(`Lưới ${cols} cột còn trống ${cols - (cells % cols)} ô ở hàng cuối — thêm/bớt thẻ hoặc dùng "span".`);

  // ---------- Bố cục ----------
  const cardHtml = cards.map((c, i) => `
    <section class="card${c.span ? ` span-${c.span}` : ''}" style="--n:${i}">
      <header><span class="num">${i + 1}</span><h3>${inline(c.title)}</h3></header>
      <div class="content">${c.visualFirst ? visual(c.visual) + body(c.body) : body(c.body) + visual(c.visual)}${c.after ? body(c.after) : ''}</div>
      ${c.keywords ? `<footer><span class="kw">${esc(bp.labels?.keywords ?? 'TỪ KHÓA')}</span><span>${inline(c.keywords)}</span></footer>` : ''}
    </section>`).join('');

  const h = bp.header ?? {};
  const recap = bp.recap;
  const deco = bp.decorations ?? ['laurel', 'star'];

  const html = `<main class="poster cols-${cols}${dense ? ' dense' : ''}"${id ? ` id="${id}"` : ''} lang="${bp.lang ?? 'vi'}">
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
    <ul>${(recap.items ?? []).map((t, i) => `<li style="--i:${i}">${icon('check', 'ic')}<span>${inline(t, BIG)}</span></li>`).join('')}</ul>
    ${icon(recap.icon ?? 'stack', 'deco recap-deco')}
  </section>` : ''}
  ${bp.footer ? `<footer class="slogan">${icon('book', 'doodle mid')}<span>${inline(bp.footer)}</span>${icon('plant', 'doodle mid')}</footer>` : ''}
  ${bp.source ? `<div class="source">Nguồn: ${inline(bp.source)}</div>` : ''}
</main>`;

  return { html, warnings: [...new Set(warnings)], cols, dense };
}
