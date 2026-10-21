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

// ---------- Hình học: điểm, đoạn, tia, đường thẳng, đa giác, góc, góc vuông, kí hiệu bằng nhau ----------
// v.points: { A: [x, y], … } trong khung v.w × v.h (mặc định 220 × 150).
// v.shapes: [{ poly: "ABC", fill: 1 }, { seg: "AB", ticks: 1, par: 1, dash: true }, { line: "AB" },
//            { ray: "OA" }, { angle: "BAC", arcs: 1, label: "60°" }, { right: "ABC" }]
// v.hide: ["M"] để ẩn nhãn điểm; v.dots: false để bỏ chấm tròn.
// Nhãn chữ trong hình: "S_đáy", "x_{1}" → chỉ số dưới; "a^2" → mũ. Còn lại giữ nguyên.
const svgText = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/_\{([^}]*)\}|_(\S+)/g, (_, a, b) => `<tspan class="sub" dy="3" font-size="75%">${a ?? b}</tspan><tspan dy="-3"></tspan>`)
  .replace(/\^\{([^}]*)\}|\^(\S)/g, (_, a, b) => `<tspan dy="-5" font-size="70%">${a ?? b}</tspan><tspan dy="5"></tspan>`);

export function geometry(v, inline) {
  const W = v.w ?? 220, H = v.h ?? 150, P = v.points ?? {};
  const pt = (n) => { const p = P[n]; if (!p) throw new Error(`geometry: thiếu điểm ${n}`); return p; };
  // Tách tên điểm theo danh sách đã khai báo, ưu tiên tên dài nhất ("a2AB" → a2, A, B). Có thể truyền mảng.
  const keys = Object.keys(P).sort((x, y) => y.length - x.length);
  const names = (s) => {
    if (Array.isArray(s)) return s;
    const out = []; let rest = String(s).replace(/\s+/g, '');
    while (rest) {
      const k = keys.find((n) => rest.startsWith(n));
      if (!k) throw new Error(`geometry: không nhận ra điểm ở "${rest}" (các điểm: ${keys.join(', ')})`);
      out.push(k); rest = rest.slice(k.length);
    }
    return out;
  };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = (a) => Math.hypot(a[0], a[1]) || 1;
  const unit = (a) => { const l = len(a); return [a[0] / l, a[1] / l]; };
  const f = (n) => n.toFixed(1);
  let out = '';
  for (const s of v.shapes ?? []) {
    const cls = s.dash ? ' dash' : '';
    if (s.poly) {
      const ps = names(s.poly).map(pt);
      out += `<path class="g-poly f${s.fill ?? 0}${cls}"${s.dash ? '' : ' pathLength="1"'} d="M${ps.map((p) => p.map(f).join(' ')).join('L')}Z"/>`;
    } else if (s.seg || s.line || s.ray) {
      const [a, b] = names(s.seg ?? s.line ?? s.ray).map(pt);
      const d = sub(b, a), e = s.ext ?? 0.3;
      const p1 = s.line ? [a[0] - d[0] * e, a[1] - d[1] * e] : a;
      const p2 = s.seg ? b : [b[0] + d[0] * e, b[1] + d[1] * e];
      out += `<path class="g-line${cls}"${s.dash ? '' : ' pathLength="1"'} d="M${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}"/>`;
      const t0 = s.at ?? 0.5, m = [a[0] + d[0] * t0, a[1] + d[1] * t0], u = unit(d), nrm = [-u[1], u[0]];
      for (let k = 0; k < (s.ticks ?? 0); k++) {         // kí hiệu đoạn bằng nhau
        const o = (k - ((s.ticks - 1) / 2)) * 4, c = [m[0] + u[0] * o, m[1] + u[1] * o];
        out += `<path class="g-mark" d="M${f(c[0] - nrm[0] * 5)} ${f(c[1] - nrm[1] * 5)}L${f(c[0] + nrm[0] * 5)} ${f(c[1] + nrm[1] * 5)}"/>`;
      }
      for (let k = 0; k < (s.par ?? 0); k++) {            // kí hiệu song song (mũi tên)
        const c = [m[0] + u[0] * (k * 6), m[1] + u[1] * (k * 6)];
        out += `<path class="g-mark" d="M${f(c[0] - u[0] * 5 - nrm[0] * 4)} ${f(c[1] - u[1] * 5 - nrm[1] * 4)}L${f(c[0])} ${f(c[1])}L${f(c[0] - u[0] * 5 + nrm[0] * 4)} ${f(c[1] - u[1] * 5 + nrm[1] * 4)}"/>`;
      }
      if (s.label) {
        const q = [m[0] + nrm[0] * 12, m[1] + nrm[1] * 12];
        out += `<text class="g-tlabel" x="${f(q[0])}" y="${f(q[1])}">${svgText(s.label)}</text>`;
      }
    } else if (s.angle) {
      const [b, a, c] = names(s.angle).map(pt);
      const u1 = unit(sub(b, a)), u2 = unit(sub(c, a));
      let a1 = Math.atan2(u1[1], u1[0]), a2 = Math.atan2(u2[1], u2[0]);
      let dA = a2 - a1; while (dA <= -Math.PI) dA += 2 * Math.PI; while (dA > Math.PI) dA -= 2 * Math.PI;
      const sweep = dA > 0 ? 1 : 0;
      for (let k = 0; k < (s.arcs ?? 1); k++) {
        const r = (s.r ?? 16) + k * 4;
        const p1 = [a[0] + Math.cos(a1) * r, a[1] + Math.sin(a1) * r], p2 = [a[0] + Math.cos(a1 + dA) * r, a[1] + Math.sin(a1 + dA) * r];
        out += `<path class="g-arc${s.fill && k === 0 ? ' fill' : ''}" d="${s.fill && k === 0 ? `M${f(a[0])} ${f(a[1])}L` : 'M'}${f(p1[0])} ${f(p1[1])}A${r} ${r} 0 0 ${sweep} ${f(p2[0])} ${f(p2[1])}${s.fill && k === 0 ? 'Z' : ''}"/>`;
      }
      if (s.label) {
        const mid = a1 + dA / 2, r = (s.r ?? 16) + 4 * ((s.arcs ?? 1) - 1) + 11;
        out += `<text class="g-alabel" x="${f(a[0] + Math.cos(mid) * r)}" y="${f(a[1] + Math.sin(mid) * r + 4)}">${svgText(s.label)}</text>`;
      }
    } else if (s.circle) {                       // { circle: "O", r: 40 } hoặc { circle: "O", through: "A" }
      const c = pt(names(s.circle)[0]);
      const r = s.r ?? len(sub(pt(names(s.through)[0]), c));
      out += `<circle class="g-circle${cls}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}"${s.dash ? '' : ' pathLength="1"'}/>`;
    } else if (s.right) {
      const [a, b, c] = names(s.right).map(pt);
      const u1 = unit(sub(a, b)), u2 = unit(sub(c, b)), k = 8;
      const p1 = [b[0] + u1[0] * k, b[1] + u1[1] * k], p3 = [b[0] + u2[0] * k, b[1] + u2[1] * k];
      out += `<path class="g-right" d="M${f(p1[0])} ${f(p1[1])}L${f(p1[0] + u2[0] * k)} ${f(p1[1] + u2[1] * k)}L${f(p3[0])} ${f(p3[1])}"/>`;
    }
  }
  // Nhãn điểm: đẩy ra xa trọng tâm các điểm.
  const all = Object.values(P), cx = all.reduce((t, p) => t + p[0], 0) / all.length, cy = all.reduce((t, p) => t + p[1], 0) / all.length;
  const hide = new Set(v.hide ?? []);
  for (const [n, p] of Object.entries(P)) {
    if (hide.has(n)) continue;                 // điểm phụ (đầu mút đường thẳng…): không chấm, không nhãn
    if (v.dots !== false) out += `<circle class="g-dot" cx="${f(p[0])}" cy="${f(p[1])}" r="2.4"/>`;
    const o = v.offsets?.[n] ?? (() => { const u = unit([p[0] - cx, p[1] - cy]); return [u[0] * 11, u[1] * 11]; })();
    out += `<text class="g-plabel" x="${f(p[0] + o[0])}" y="${f(p[1] + o[1] + 4)}">${svgText(n)}</text>`;
  }
  return `<figure class="v-geometry"${v.maxw ? ` style="max-width:${v.maxw}px"` : ''}><svg viewBox="${-10} ${-10} ${W + 20} ${H + 20}" aria-hidden="true">${out}</svg>${v.caption ? `<figcaption>${inline(v.caption)}</figcaption>` : ''}</figure>`;
}

// ---------- Biểu đồ hình quạt tròn ----------
export function pie(v, inline) {
  const items = v.items ?? [];
  const total = items.reduce((t, it) => t + (it.value ?? 0), 0) || 1;
  let acc = 0;
  const R = 46, C = 50;
  const at = (t) => [C + R * Math.cos(2 * Math.PI * t - Math.PI / 2), C + R * Math.sin(2 * Math.PI * t - Math.PI / 2)];
  const sectors = items.map((it, i) => {
    const a = acc / total; acc += it.value ?? 0; const b = acc / total;
    const [x1, y1] = at(a), [x2, y2] = at(b);
    const d = b - a >= 0.9999 ? `M${C} ${C - R}A${R} ${R} 0 1 1 ${C - 0.01} ${C - R}Z` : `M${C} ${C}L${x1.toFixed(2)} ${y1.toFixed(2)}A${R} ${R} 0 ${b - a > 0.5 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
    return `<path class="pie-s" style="--i:${i};fill:var(--mm${(i % 6) + 1})" d="${d}"/>`;
  }).join('');
  const pct = (x) => (Math.round((x / total) * 1000) / 10).toString().replace('.', ',');
  return `<div class="v-pie"><svg viewBox="0 0 100 100" aria-hidden="true">${sectors}</svg>
    <ul class="pie-legend">${items.map((it, i) => `<li><span class="sw" style="background:var(--mm${(i % 6) + 1})"></span>${inline(it.label)} <b>${it.pct ?? pct(it.value ?? 0) + '%'}</b></li>`).join('')}</ul>
    ${v.caption ? `<div class="pie-cap">${inline(v.caption)}</div>` : ''}</div>`;
}

// ---------- Biểu đồ đoạn thẳng ----------
export function linechart(v, inline) {
  // Nhiều đường: v.series = [{label, values}]; một đường: v.values.
  const series = v.series ?? [{ values: v.values ?? [] }];
  const xs = v.labels ?? [], ys = series.flatMap((sr) => sr.values);
  const W = 300, H = 150, L = 34, R = 12, T = 18, B = 26;
  const max = v.max ?? Math.max(...ys) * 1.15, min = v.min ?? 0;
  const X = (i) => L + (xs.length > 1 ? (i / (xs.length - 1)) * (W - L - R - 28) + 16 : (W - L - R) / 2);
  const Y = (y) => H - B - ((y - min) / (max - min || 1)) * (H - B - T);
  const grid = [0.25, 0.5, 0.75, 1].map((t) => `<path class="lc-grid" d="M${L} ${Y(min + (max - min) * t).toFixed(1)}H${W - R}"/>`).join('');
  return `<div class="v-linechart"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${grid}
      <path class="lc-axis" d="M${L} ${T - 8}V${H - B}H${W - R + 4}"/>
      ${series.map((sr, k) => {
        const col = series.length > 1 ? `var(--mm${(k % 6) + 1})` : 'var(--frame)';
        const p = sr.values.map((y, i) => `${X(i).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');
        return `<polyline class="lc-line" pathLength="1" style="stroke:${col}" points="${p}"/>` + sr.values.map((y, i) =>
          `<circle class="lc-pt" style="--i:${i};fill:${col}" cx="${X(i).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.2"/><text class="lc-val" x="${X(i).toFixed(1)}" y="${(Y(y) - 7).toFixed(1)}">${String(y).replace('.', ',')}</text>`).join('');
      }).join('')}
      ${xs.map((x, i) => `<text class="lc-x" x="${X(i).toFixed(1)}" y="${H - B + 14}">${x}</text>`).join('')}
      ${v.unit ? `<text class="lc-unit" x="${L - 4}" y="${T - 10}">${v.unit}</text>` : ''}
    </svg>${series.length > 1 ? `<div class="lc-legend">${series.map((sr, k) => `<span><i style="background:var(--mm${(k % 6) + 1})"></i>${inline(sr.label ?? '')}</span>`).join('')}</div>` : ''}${v.caption ? `<div class="lc-cap">${inline(v.caption)}</div>` : ''}</div>`;
}
