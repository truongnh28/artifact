// Hình minh hoạ dạng tranh: mèo & hộp cho giới từ vị trí, phễu (in/on/at), cột so sánh, sơ đồ tư duy.
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
