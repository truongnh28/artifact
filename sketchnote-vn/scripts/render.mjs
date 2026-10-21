#!/usr/bin/env node
// Render một file HTML thành PNG bằng Chrome/Chromium headless qua DevTools Protocol.
// Không cần cài thư viện: chỉ dùng Node >= 22 (WebSocket, fetch có sẵn).
//
//   node render.mjs <input.html> [output.png] [--width 1080] [--scale 2] [--pdf] [--a4]
//
// Chờ webfont + KaTeX tải xong, đo chiều cao thật của trang rồi chụp toàn trang.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const wantPdf = args.includes('--pdf');
if (wantPdf) args.splice(args.indexOf('--pdf'), 1);
// --a4: PDF khổ A4 dọc, poster thu nhỏ vừa trang (mặc định PDF đúng kích thước poster).
const wantA4 = args.includes('--a4');
if (wantA4) args.splice(args.indexOf('--a4'), 1);
const width = Number(flag('width', 1080));
const scale = Number(flag('scale', 2));
const chromeFlag = flag('chrome', process.env.CHROME_PATH);

const [input, outArg] = args;
if (!input) {
  console.error('Usage: node render.mjs <input.html> [output.png] [--width 1080] [--scale 2] [--pdf]');
  process.exit(1);
}
const inputPath = resolve(input);
const output = resolve(outArg ?? inputPath.replace(/\.html?$/i, '') + '.png');

function findChrome() {
  const candidates = [
    chromeFlag,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const hit = candidates.find((p) => existsSync(p));
  if (!hit) throw new Error('Không tìm thấy Chrome/Chromium. Đặt CHROME_PATH hoặc --chrome <đường dẫn>.');
  return hit;
}

const profile = mkdtempSync(join(tmpdir(), 'sketchnote-chrome-'));
const chrome = spawn(findChrome(), [
  '--headless=new',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--allow-file-access-from-files',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const cleanup = () => {
  try { chrome.kill('SIGKILL'); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
};
process.on('exit', cleanup);

const wsUrl = await new Promise((ok, fail) => {
  let buf = '';
  const t = setTimeout(() => fail(new Error('Chrome không khởi động được (timeout).')), 20000);
  chrome.stderr.on('data', (d) => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(t); ok(m[1]); }
  });
  chrome.on('exit', (c) => fail(new Error(`Chrome thoát sớm (code ${c}).`)));
});

const ws = new WebSocket(wsUrl);
await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });

let nextId = 0;
const pending = new Map();
const waiters = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { ok, fail } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? fail(new Error(msg.error.message)) : ok(msg.result);
  } else if (msg.method) {
    for (const w of [...waiters]) if (w.method === msg.method && w.sessionId === msg.sessionId) {
      waiters.splice(waiters.indexOf(w), 1);
      w.ok(msg.params);
    }
  }
};
const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
  const id = ++nextId;
  pending.set(id, { ok, fail });
  ws.send(JSON.stringify({ id, method, params, ...(sessionId && { sessionId }) }));
});
const once = (method, sessionId) => new Promise((ok) => waiters.push({ method, sessionId, ok }));

try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);

  await s('Page.enable');
  await s('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: scale, mobile: false });
  const loaded = once('Page.loadEventFired', sessionId);
  await s('Page.navigate', { url: pathToFileURL(inputPath).href });
  await loaded;

  // Chờ font + KaTeX auto-render (trang có thể đặt window.__renderDone = true khi xong).
  const { result } = await s('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      const t0 = Date.now();
      while (window.__renderDone === false && Date.now() - t0 < 15000) await new Promise(r => setTimeout(r, 100));
      // Font Google chia subset tiếng Việt theo unicode-range: ép tải đủ glyph có dấu trước khi chụp.
      const probe = 'Ắ ữ ợ ỹ Đ đ ẫ ặ ể ố ự Tổng hợp kiến thức';
      const fams = [...new Set([...document.fonts].map(f => f.family.replace(/"/g, '')))].filter(f => !f.startsWith('KaTeX'));
      await Promise.all(fams.flatMap(f => ['400', '700'].map(w => document.fonts.load(w + ' 24px "' + f + '"', probe).catch(() => {}))));
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 300));
      const el = document.querySelector('.poster') || document.body;
      const r = el.getBoundingClientRect();
      const missing = [...document.querySelectorAll('.katex-error')].map(e => e.title || e.textContent);
      return { w: Math.ceil(r.right), h: Math.ceil(Math.max(r.bottom, document.documentElement.scrollHeight)), missing,
               fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family) };
    })()`,
  });
  const info = result.value;
  if (info.missing.length) console.error('⚠️  Lỗi công thức KaTeX:', info.missing.join(' | '));

  const height = info.h;
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });
  await new Promise((r) => setTimeout(r, 200));

  if (wantPdf) {
    // Khoá bề rộng poster để khi in A4 bố cục không bị dàn lại theo khổ giấy.
    if (wantA4) await s('Runtime.evaluate', {
      expression: `(() => { const p = document.querySelector('.poster') || document.body; p.style.width = '${width}px'; p.style.margin = '0 auto'; })()`,
    });
    const m = 0.25; // lề A4 (inch)
    const fit = Math.min((8.27 - 2 * m) * 96 / width, (11.69 - 2 * m) * 96 / height);
    const pdf = await s('Page.printToPDF', wantA4
      ? { printBackground: true, paperWidth: 8.27, paperHeight: 11.69, scale: Math.max(0.1, Math.min(2, fit)),
          marginTop: m, marginBottom: m, marginLeft: m, marginRight: m, pageRanges: '1' }
      : { printBackground: true, paperWidth: width / 96, paperHeight: height / 96,
          marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    const pdfOut = output.replace(/\.png$/i, '') + '.pdf';
    writeFileSync(pdfOut, Buffer.from(pdf.data, 'base64'));
    console.log(pdfOut);
  }

  const shot = await s('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  writeFileSync(output, Buffer.from(shot.data, 'base64'));
  console.log(`${output}  (${width}×${height} @${scale}x, fonts: ${[...new Set(info.fonts)].join(', ') || 'none'})`);
} catch (e) {
  console.error('Render lỗi:', e.message);
  process.exitCode = 1;
} finally {
  ws.close();
  cleanup();
}
