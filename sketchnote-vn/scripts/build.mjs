#!/usr/bin/env node
// Dựng poster sketchnote từ blueprint JSON → HTML (rồi gọi render.mjs để ra PNG/PDF).
//
//   node build.mjs <blueprint.json> [out.html] [--png] [--pdf] [--a4] [--scale 2] [--theme blue-ink] [--cdn]
//
// Bản web có hình động: xem web.mjs. Schema blueprint: references/blueprint-schema.md

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { THEMES } from './themes.mjs';
import { renderPoster, FILTERS, esc } from './poster.mjs';

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

const { html: main, warnings, cols, dense } = renderPoster(bp);
const h = bp.header ?? {};

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
function fitFormulas(){document.fonts.ready.then(()=>{for(const el of document.querySelectorAll('.v-formula .tex,.display')){let f=100;while(el.scrollWidth>el.clientWidth+1&&f>55){f-=5;el.style.fontSize=f+'%';}}drawMindmaps();});}
${readFileSync(join(here, 'mindmap.js'), 'utf8')}
</script>
<script defer src="${A.katex}/katex.min.js"></script>
<script defer src="${A.katex}/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});fitFormulas();window.__renderDone=true;"
  onerror="window.__renderDone=true;"></script>
<style>${readFileSync(join(here, 'poster.css'), 'utf8')}
:root{${Object.entries(theme.vars).map(([k, v]) => `--${k}:${v}`).join(';')}}
</style>
</head>
<body class="theme-${bp.theme}">
${FILTERS(bp.seed)}
${main}
</body>
</html>`;

writeFileSync(out, html);
console.log(out);
for (const w of warnings) console.error('⚠️ ', w);

if (wantPng || wantPdf) {
  const r = spawnSync(process.execPath, [join(here, 'render.mjs'), out, out.replace(/\.html$/, '.png'),
    '--width', String(bp.width ?? (cols === 2 && !dense ? 820 : 1080)), '--scale', scale, ...(wantPdf ? ['--pdf'] : []), ...(wantA4 ? ['--a4'] : [])],
    { stdio: 'inherit' });
  process.exitCode = r.status ?? 1;
}
