#!/usr/bin/env node
// Xuất bản WEB có hình động từ một hoặc nhiều blueprint (nhiều blueprint → các tab trong một trang).
//
//   node web.mjs <a.json> [b.json …] -o out.html [--title "Tên trang"] [--theme blue-ink] [--artifact]
//
// - Một file HTML tự chứa: font viết tay + font KaTeX nhúng base64, công thức dựng sẵn bằng KaTeX
//   (không cần mạng, không cần JS để đọc được).
// - Co giãn: điện thoại về 1 cột; tự chuyển sang giao diện bảng đen khi máy để chế độ tối.
// - Hình động: thẻ trượt vào, icon tự vẽ, trục số/đồ thị/tập hợp/trục thời gian chạy hiệu ứng;
//   bấm thẻ để xem lại. Tắt khi người xem bật "giảm chuyển động".
// - --artifact: bỏ <!doctype>/<html>/<head>/<body> để publish làm Claude Artifact.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { THEMES } from './themes.mjs';
import { renderPoster, FILTERS, esc } from './poster.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, '..', 'assets');
const katex = createRequire(import.meta.url)(join(assets, 'katex', 'katex.min.js'));

const args = process.argv.slice(2);
const opt = (f, d) => { const i = args.indexOf(f); if (i >= 0) { const v = args[i + 1]; args.splice(i, 2); return v; } return d; };
const has = (f) => { const i = args.indexOf(f); if (i >= 0) { args.splice(i, 1); return true; } return false; };
const outArg = opt('-o');
const titleArg = opt('--title');
const themeFlag = opt('--theme');
const asArtifact = has('--artifact');
const files = args;
if (!files.length) {
  console.error('Usage: node web.mjs <a.json> [b.json …] -o out.html [--title "Tên"] [--theme blue-ink] [--artifact]');
  process.exit(1);
}

const b64 = (p) => readFileSync(p).toString('base64');

// Font viết tay: thay url(file.woff2) bằng data URI.
const fontCss = readFileSync(join(assets, 'fonts', 'fonts.css'), 'utf8')
  .replace(/url\(([^)]+\.woff2)\)/g, (_, f) => `url(data:font/woff2;base64,${b64(join(assets, 'fonts', f))})`);

// CSS KaTeX: chỉ giữ woff2, nhúng base64.
const katexCss = readFileSync(join(assets, 'katex', 'katex.min.css'), 'utf8')
  .replace(/src:url\(fonts\/([^)]+\.woff2)\) format\("woff2"\)(,url\([^)]+\) format\("[^"]+"\))*/g,
    (_, f) => `src:url(data:font/woff2;base64,${b64(join(assets, 'katex', 'fonts', f))}) format("woff2")`);

const math = (tex, display) => katex.renderToString(tex, { displayMode: display, throwOnError: false });

const vars = (t) => Object.entries(THEMES[t].vars).map(([k, v]) => `--${k}:${v}`).join(';');
const slug = (p) => basename(p, '.json').toLowerCase().replace(/[^a-z0-9._~-]+/g, '-');

const posters = [];
const allWarnings = [];
let lightTheme;
for (const f of files) {
  const bp = JSON.parse(readFileSync(f, 'utf8'));
  bp.theme = themeFlag ?? bp.theme ?? 'blue-ink';
  if (!THEMES[bp.theme]) throw new Error(`Theme không tồn tại: ${bp.theme}`);
  lightTheme ??= bp.theme;
  const id = slug(f);
  const r = renderPoster(bp, { math, id });
  const full = bp.header?.subtitle ?? bp.header?.title ?? id;
  // Nhãn tab ngắn: "tab" trong blueprint, hoặc phần "Chương IV" / "Bài 3" / "Unit 1" trước dấu chấm.
  const short = bp.tab ?? (full.match(/^((?:Chương|Bài|Unit|Phần|Chủ đề)\s+[^.:]+)[.:]/)?.[1] ?? full);
  posters.push({ id, html: r.html, label: short, full, seed: bp.seed });
  allWarnings.push(...r.warnings.map((w) => `${basename(f)}: ${w}`));
  const errs = (r.html.match(/class="katex-error"[^>]*title="([^"]*)"/g) ?? []);
  errs.forEach((e) => allWarnings.push(`${basename(f)}: lỗi KaTeX ${e}`));
}

// Sáng: theme đã chọn. Tối: bảng đen (trừ khi chính theme đã là bảng đen → giữ một giao diện tối).
const dark = 'chalkboard';
const themeCss = lightTheme === dark
  ? `:root{${vars(dark)};color-scheme:dark}`
  : `:root{${vars(lightTheme)};color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${vars(dark)};color-scheme:dark}}
:root[data-theme="dark"]{${vars(dark)};color-scheme:dark}`;

const title = titleArg ?? posters[0].label;
const bar = `<nav class="web-bar" aria-label="Poster">
  ${posters.length > 1 ? posters.map((p) => `<button type="button" data-tab="${p.id}" aria-selected="false" title="${esc(p.full)}">${esc(p.label)}</button>`).join('') : ''}
  <button type="button" class="replay" title="Phát lại hiệu ứng" aria-label="Phát lại hiệu ứng">↻<span class="txt"> Phát lại hiệu ứng</span></button>
</nav>`;

const page = `<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
${fontCss}
${katexCss}
${readFileSync(join(here, 'poster.css'), 'utf8')}
${readFileSync(join(here, 'web.css'), 'utf8')}
${themeCss}
</style>
${FILTERS(posters[0].seed)}
<div class="web web-wrap">
${bar}
${posters.map((p) => p.html).join('\n')}
</div>
<script>
${readFileSync(join(here, 'mindmap.js'), 'utf8')}
${readFileSync(join(here, 'web.js'), 'utf8')}
</script>`;

const html = asArtifact ? page : `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
${page.replace('</style>', '</style>\n</head>\n<body>')}
</body>
</html>`;

const out = resolve(outArg ?? files[0].replace(/\.json$/i, '') + '.web.html');
writeFileSync(out, html);
console.log(`${out}  (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, ${posters.length} poster)`);
for (const w of new Set(allWarnings)) console.error('⚠️ ', w);
