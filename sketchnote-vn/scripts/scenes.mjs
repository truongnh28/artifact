// Hình minh hoạ dạng tranh: mèo & hộp cho giới từ vị trí, phễu (in/on/at), cột so sánh, sơ đồ tư duy,
// bánh phân số, sơ đồ lấy vào → thải ra, chuyển động theo mốc, lọ số lượng, đảo trật tự từ.
import { icon } from './icons.mjs';
// Mỗi hàm nhận (v, inline) — inline() là bộ định dạng chữ của poster (công thức, **đậm**…).

// ---------- Mèo ngồi nhìn thẳng (khung 40×44) ----------
const CAT = `
  <path class="c-tail" d="M30 38c10-2 10-14 3-16"/>
  <path class="c-body" d="M10 42c-2-12 2-18 10-18s12 6 10 18z"/>
  <path class="c-legs" d="M17 42v-8M23 42v-8"/>
  <path class="c-head" d="M8 16 7 4l7 5c3-1 9-1 12 0l7-5-1 12c0 7-5 10-12 10S8 23 8 16z"/>
  <circle class="c-eye" cx="15" cy="16" r="1.6"/><circle class="c-eye" cx="25" cy="16" r="1.6"/>
  <path class="c-nose" d="M19 19h2l-1 1.5z"/>
  <path class="c-line" d="M20 20.5q-1.5 2-3 1M20 20.5q1.5 2 3 1M12 19l-7-1M12 21l-7 1M28 19l7-1M28 21l7 1"/>
  <path class="c-collar" d="M13 25.5q7 2.5 14 0"/>`;

// Đặt mèo: (x, y) là góc trên-trái, s là tỉ lệ, flip lật ngang. Lớp .cat-anim để CSS tạo chuyển động.
const cat = (x, y, s = 0.8, flip = false) =>
  `<g transform="translate(${flip ? x + 40 * s : x} ${y}) scale(${flip ? -s : s} ${s})"><g class="cat-anim">${CAT}</g></g>`;

// Hộp nhìn thẳng: mặt trước + dải cạnh sẫm bên phải; open = có nắp mở.
const box = (x, y, w, h, open = false) => {
  const side = Math.round(w * 0.22);
  const flaps = open
    ? `<path class="b-flap" d="M${x} ${y}l-9 -9h${w * 0.5}l4 9zM${x + w} ${y}l7 -8h-${w * 0.45}l-3 8z"/>` : '';
  return `<g class="box">${flaps}<rect class="b-front" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="b-side" x="${x + w - side}" y="${y}" width="${side}" height="${h}"/></g>`;
};

const K = 1.05; // tỉ lệ mèo (khung 42×46 sau khi phóng)
const SCENES = {
  in: () => `${cat(38, 34, K)}${box(30, 60, 58, 30, true)}`,
  on: () => `${box(30, 58, 60, 32)}${cat(39, 12, K)}`,
  under: () => `<g class="table"><path d="M22 36v54M98 36v54"/><rect x="14" y="31" width="92" height="7" rx="2"/></g>${cat(39, 44, K)}`,
  above: () => `${box(30, 64, 60, 26)}<g class="float">${cat(39, 0, K)}</g>`,
  below: () => `${box(30, 2, 60, 28)}${cat(39, 46, K)}`,
  'in-front-of': () => `${box(28, 26, 64, 64)}${cat(37, 44, K)}`,
  behind: () => `${cat(66, 42, K)}${box(16, 38, 58, 52)}`,
  'next-to': () => `${box(8, 50, 52, 40)}${cat(66, 44, K)}`,
  between: () => `${box(0, 50, 36, 40)}${box(84, 50, 36, 40)}${cat(39, 44, K)}`,
  opposite: () => `${cat(4, 44, K)}${cat(74, 44, K, true)}<path class="pos-arrow" d="M50 34h20M54 30l-4 4 4 4M66 30l4 4-4 4"/>`,
  'on-the-left': () => `${cat(2, 44, K)}${box(54, 50, 60, 40)}`,
  'on-the-right': () => `${box(6, 50, 60, 40)}${cat(72, 44, K)}`,
  at: () => `<g class="sign"><path d="M34 24v66"/><rect x="10" y="6" width="48" height="20" rx="4"/><path d="M18 16h32" class="sign-txt"/></g>${cat(62, 44, K)}`,
};

export function positions(v, inline) {
  const n = (v.items ?? []).length;
  // Chia hàng đều: ≤5 tranh một hàng; 6–10 tranh chia 2 hàng bằng nhau (hoặc gần bằng).
  const cols = n <= 5 ? n : Math.ceil(n / Math.ceil(n / 5));
  return `<div class="v-positions" style="--cols:${cols}">${(v.items ?? []).map((it, i) => {
    const key = String(it.pos ?? it.label ?? '').toLowerCase().trim().replace(/\s+/g, '-');
    const scene = SCENES[key];
    if (!scene) return `<figure class="pos-tile"><figcaption><b>${inline(it.label ?? key)}</b> (thiếu hình: ${key})</figcaption></figure>`;
    return `<figure class="pos-tile" data-pos="${key}" style="--i:${i}"><svg viewBox="0 0 120 96" aria-hidden="true">${scene()}</svg>
      <figcaption><b>${inline(it.label ?? key.replace(/-/g, ' '))}</b>${it.note ? `<span>${inline(it.note)}</span>` : ''}${it.ex ? `<em>${inline(it.ex)}</em>` : ''}</figcaption></figure>`;
  }).join('')}</div>`;
}
export const SCENE_NAMES = Object.keys(SCENES);

// ---------- Phễu: rộng → hẹp (in → on → at; khái quát → cụ thể) ----------
export function funnel(v, inline) {
  const n = (v.items ?? []).length;
  return `<div class="v-funnel">${(v.items ?? []).map((it, i) => {
    const w = 100 - (i * 46) / Math.max(1, n - 1);
    return `<div class="lv" style="--w:${w}%;--i:${i}"><b>${inline(it.word)}</b><span>${inline(it.text ?? '')}</span>${it.ex ? `<em>${inline(it.ex)}</em>` : ''}</div>`;
  }).join('')}${v.caption ? `<div class="f-cap">${inline(v.caption)}</div>` : ''}</div>`;
}

// ---------- Cột so sánh tăng dần ----------
export function bars(v, inline) {
  const items = v.items ?? [];
  const max = Math.max(...items.map((it) => it.value ?? 1), 1);
  return `<div class="v-bars">${items.map((it, i) => `
    <div class="bar-col" style="--h:${((it.value ?? 1) / max) * 100}%;--i:${i}">
      <div class="bar-track">${i === items.length - 1 && v.star !== false ? '<span class="bar-star">★</span>' : ''}<div class="bar"></div></div>
      <div class="bar-label">${inline(it.label)}</div>
    </div>`).join('')}${v.caption ? `<div class="bars-cap">${inline(v.caption)}</div>` : ''}</div>`;
}

// ---------- Sơ đồ tư duy: nút giữa + các nhánh (nửa trái, nửa phải); đường nối do mindmap.js vẽ ----------
export function mindmap(v, inline) {
  const branches = v.branches ?? [];
  const half = Math.ceil(branches.length / 2);
  const node = (b, i) => `<div class="mm-branch" style="--b:${i}">
      <div class="mm-node">${inline(b.label)}</div>
      ${b.items?.length ? `<ul class="mm-items">${b.items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>` : ''}
    </div>`;
  return `<div class="v-mindmap"><svg class="mm-links" aria-hidden="true"></svg>
    <div class="mm-col mm-left">${branches.slice(0, half).map((b, i) => node(b, i)).join('')}</div>
    <div class="mm-center"><span>${inline(v.center)}</span></div>
    <div class="mm-col mm-right">${branches.slice(half).map((b, i) => node(b, i + half)).join('')}</div>
  </div>`;
}

// ---------- Bánh phân số: b phần bằng nhau, tô a phần ----------
export function fraction(v, inline) {
  const b = Math.max(1, v.parts ?? 4), a = Math.min(b, v.filled ?? 1);
  const R = 34, C = 40;
  const pt = (k) => {
    const t = (k / b) * 2 * Math.PI - Math.PI / 2;
    return `${(C + R * Math.cos(t)).toFixed(2)} ${(C + R * Math.sin(t)).toFixed(2)}`;
  };
  const slices = Array.from({ length: b }, (_, k) => b === 1
    ? `<circle class="fr-slice${k < a ? ' on' : ''}" cx="${C}" cy="${C}" r="${R}" style="--i:${k}"/>`
    : `<path class="fr-slice${k < a ? ' on' : ''}" style="--i:${k}" d="M${C} ${C}L${pt(k)}A${R} ${R} 0 0 1 ${pt(k + 1)}Z"/>`).join('');
  const tex = v.tex ?? `$\\dfrac{${a}}{${b}}$`;
  return `<div class="v-fraction"><svg viewBox="0 0 80 80" aria-hidden="true">${slices}</svg>
    <div class="fr-legend"><div class="fr-tex">${inline(tex)}</div>${(v.notes ?? []).map((t) => `<div>${inline(t)}</div>`).join('')}</div></div>`;
}

// ---------- Lấy vào → quá trình → thải ra ----------
export function flow(v, inline) {
  const chips = (xs, cls) => (xs ?? []).map((t, i) => `<span class="fl-chip ${cls}" style="--i:${i}">${inline(t)}</span>`).join('');
  const arrow = `<svg class="fl-arrow" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M29 2l7 6-7 6"/></svg>`;
  const c = v.center ?? {};
  return `<div class="v-flow">
    <div class="fl-side fl-in">${v.inLabel ? `<span class="fl-cap">${inline(v.inLabel)}</span>` : ''}${chips(v.inputs, 'in')}</div>
    ${arrow}
    <div class="fl-center">${c.icon ? icon(c.icon, 'doodle big') : ''}<b>${inline(c.label ?? '')}</b>${c.note ? `<span>${inline(c.note)}</span>` : ''}</div>
    ${arrow}
    <div class="fl-side fl-out">${v.outLabel ? `<span class="fl-cap">${inline(v.outLabel)}</span>` : ''}${chips(v.outputs, 'out')}</div>
  </div>`;
}

// ---------- Chuyển động theo mốc thời gian (ảnh hoạt nghiệm): nhanh dần / chậm dần / đều ----------
const CAR = `<g class="mv-car"><path class="car-body" d="M2 14h4l4-7h12l5 7h5v6H2z"/><path class="car-win" d="M11 9h5v5h-8zM18 9h3l3.5 5H18z"/><circle class="car-wheel" cx="9" cy="20" r="3.2"/><circle class="car-wheel" cx="26" cy="20" r="3.2"/></g>`;
export function motion(v, inline) {
  const n = v.steps ?? 5;
  const pos = (mode) => Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return mode === 'accel' ? t * t : mode === 'decel' ? 1 - (1 - t) * (1 - t) : t;
  });
  const vertical = !!v.vertical;
  const rows = (v.rows ?? [{ mode: 'accel' }]).map((r, k) => {
    const ps = pos(r.mode ?? 'accel');
    const W = vertical ? 80 : 300, H = vertical ? 200 : 46, pad = vertical ? 16 : 20, span = (vertical ? H : W) - 2 * pad - (vertical ? 8 : 34);
    const objs = ps.map((p, i) => {
      const off = pad + p * span;
      const op = i === n - 1 ? 1 : 0.28 + 0.5 * (i / (n - 1));
      const shape = vertical
        ? `<circle class="mv-ball" cx="30" cy="${off}" r="7"/>`
        : `<g transform="translate(${off} 12)">${v.object === 'ball' ? '<circle class="mv-ball" cx="10" cy="14" r="7"/>' : CAR}</g>`;
      const tick = vertical
        ? `<path class="mv-tick" d="M44 ${off}h10"/><text class="mv-t" x="58" y="${off + 3}">${i}</text>`
        : `<path class="mv-tick" d="M${off + 16} 40v5"/>`;
      return `<g class="mv-obj" style="--i:${i};opacity:${op.toFixed(2)}">${shape}</g>${tick}`;
    }).join('');
    const ground = vertical ? `<path class="mv-ground" d="M44 ${pad - 6}V${H - pad + 6}"/>` : `<path class="mv-ground" d="M6 40H${W - 6}"/>`;
    return `<div class="mv-row" style="--k:${k}">${r.label ? `<span class="mv-label">${inline(r.label)}</span>` : ''}<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${ground}${objs}</svg>${r.note ? `<span class="mv-note">${inline(r.note)}</span>` : ''}</div>`;
  }).join('');
  return `<div class="v-motion${vertical ? ' vertical' : ''}">${rows}${v.caption ? `<div class="mv-cap">${inline(v.caption)}</div>` : ''}</div>`;
}

// ---------- Lọ số lượng: many → some → a few → few → none ----------
export function jars(v, inline) {
  return `<div class="v-jars">${(v.items ?? []).map((it, i) => {
    const f = Math.max(0, Math.min(1, it.fill ?? 0.5));
    const top = 18 + (1 - f) * 52;
    return `<figure class="jar" style="--i:${i};--f:${f}"><svg viewBox="0 0 60 76" aria-hidden="true">
        <defs><clipPath id="jc${i}${Math.round(f * 100)}"><path d="M14 16h32v6c4 3 6 7 6 12v30c0 5-4 8-9 8H17c-5 0-9-3-9-8V34c0-5 2-9 6-12z"/></clipPath></defs>
        <rect class="jar-fill" x="0" y="${top.toFixed(1)}" width="60" height="${(76 - top).toFixed(1)}" clip-path="url(#jc${i}${Math.round(f * 100)})"/>
        <path class="jar-glass" d="M14 16h32v6c4 3 6 7 6 12v30c0 5-4 8-9 8H17c-5 0-9-3-9-8V34c0-5 2-9 6-12z"/>
        <rect class="jar-lid" x="12" y="8" width="36" height="9" rx="2"/>
      </svg><figcaption><b>${inline(it.label)}</b>${it.note ? `<span>${inline(it.note)}</span>` : ''}</figcaption></figure>`;
  }).join('')}</div>`;
}

// ---------- Đảo trật tự từ (câu khẳng định → câu hỏi) ----------
export function reorder(v, inline) {
  const from = v.from ?? [], to = v.to ?? [];
  const moved = new Set((v.moved ?? []).map(Number));
  const row = (xs, cls) => xs.map((t, i) => `<span class="ro-chip${cls === 'to' && moved.has(i) ? ' moved' : ''}" style="--i:${i}">${inline(t)}</span>`).join('');
  return `<div class="v-reorder">
    <div class="ro-row ro-from">${row(from, 'from')}</div>
    <div class="ro-mid"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 2v24M5 19l7 7 7-7"/></svg>${v.note ? `<span>${inline(v.note)}</span>` : ''}</div>
    <div class="ro-row ro-to">${row(to, 'to')}</div>
  </div>`;
}
