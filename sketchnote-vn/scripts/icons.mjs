// Thư viện icon doodle vẽ tay (SVG inline, viewBox 0 0 64 64).
// Dùng currentColor cho nét, var(--accent) / var(--accent-2) cho mảng màu nhạt.
// Thêm icon mới: một chuỗi SVG nội dung (không có thẻ <svg>), nét stroke-linecap round.

const S = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
const F = 'style="fill:var(--icon-fill)"';

export const ICONS = {
  book: `<path ${F} d="M6 16c9-3 18-2 26 4 8-6 17-7 26-4v34c-9-3-18-2-26 4-8-6-17-7-26-4z"/><path ${S} d="M6 16c9-3 18-2 26 4 8-6 17-7 26-4v34c-9-3-18-2-26 4-8-6-17-7-26-4zM32 20v34M11 24c5-1 10-1 15 2M11 31c5-1 10-1 15 2M38 26c5-3 10-3 15-2M38 33c5-3 10-3 15-2"/>`,
  pencil: `<path ${F} d="M14 50l4-12 28-28 8 8-28 28z"/><path ${S} d="M14 50l4-12 28-28 8 8-28 28zM40 16l8 8M18 38l8 8M14 50l6-2"/>`,
  bulb: `<path ${F} d="M32 8c-11 0-18 8-18 17 0 7 4 11 7 14 2 2 3 4 3 7h16c0-3 1-5 3-7 3-3 7-7 7-14 0-9-7-17-18-17z"/><path ${S} d="M32 8c-11 0-18 8-18 17 0 7 4 11 7 14 2 2 3 4 3 7h16c0-3 1-5 3-7 3-3 7-7 7-14 0-9-7-17-18-17zM25 52h14M27 57h10M32 46V30M28 30h8M6 22h3M55 22h3M12 7l2 3M52 7l-2 3"/>`,
  star: `<path ${F} d="M32 6l7 16 17 2-13 11 4 17-15-9-15 9 4-17L8 24l17-2z"/><path ${S} d="M32 6l7 16 17 2-13 11 4 17-15-9-15 9 4-17L8 24l17-2z"/>`,
  scale: `<path ${S} d="M32 10v42M20 54h24M12 18h40M32 10l-2 4h4zM12 18L4 36h16zM52 18l-8 18h16z"/><path ${F} d="M4 36c2 6 14 6 16 0zM44 36c2 6 14 6 16 0z"/><path ${S} d="M4 36c2 6 14 6 16 0M44 36c2 6 14 6 16 0"/>`,
  check: `<rect x="8" y="8" width="48" height="48" rx="10" ${F}/><rect x="8" y="8" width="48" height="48" rx="10" ${S}/><path ${S} d="M18 33l9 9 19-20"/>`,
  warning: `<path ${F} d="M32 8l26 46H6z"/><path ${S} d="M32 8l26 46H6zM32 24v15M32 46v1"/>`,
  target: `<circle cx="32" cy="32" r="24" ${F}/><circle cx="32" cy="32" r="24" ${S}/><circle cx="32" cy="32" r="14" ${S}/><circle cx="32" cy="32" r="4" ${S}/><path ${S} d="M32 32L54 10M48 10h6v6"/>`,
  magnifier: `<circle cx="26" cy="26" r="16" ${F}/><circle cx="26" cy="26" r="16" ${S}/><path ${S} d="M38 38l18 18M18 22c1-4 4-6 8-7"/>`,
  puzzle: `<path ${F} d="M10 18h14c-3-8 13-8 10 0h14v14c-8-3-8 13 0 10v14H34c3 8-13 8-10 0H10V42c8 3 8-13 0-10z"/><path ${S} d="M10 18h14c-3-8 13-8 10 0h14v14c-8-3-8 13 0 10v14H34c3 8-13 8-10 0H10V42c8 3 8-13 0-10z"/>`,
  chart: `<path ${S} d="M8 8v48h48"/><rect x="16" y="34" width="8" height="18" ${F}/><rect x="30" y="24" width="8" height="28" ${F}/><rect x="44" y="14" width="8" height="38" ${F}/><path ${S} d="M16 52V34h8v18M30 52V24h8v28M44 52V14h8v38"/>`,
  clock: `<circle cx="32" cy="32" r="24" ${F}/><circle cx="32" cy="32" r="24" ${S}/><path ${S} d="M32 16v16l10 8"/>`,
  calculator: `<rect x="14" y="6" width="36" height="52" rx="5" ${F}/><rect x="14" y="6" width="36" height="52" rx="5" ${S}/><rect x="20" y="12" width="24" height="10" rx="2" ${S}/><path ${S} d="M22 31h4M30 31h4M38 31h4M22 40h4M30 40h4M38 40h4M22 49h4M30 49h4M38 49h4"/>`,
  ruler: `<path ${F} d="M6 42L42 6l16 16-36 36z"/><path ${S} d="M6 42L42 6l16 16-36 36zM16 32l5 5M23 25l3 3M30 18l5 5M37 11l3 3M44 18l-0 0"/>`,
  compass: `<path ${S} d="M32 6v6M32 12l-14 44M32 12l14 44M22 40h20"/><circle cx="32" cy="12" r="4" ${F}/><circle cx="32" cy="12" r="4" ${S}/>`,
  flask: `<path ${F} d="M18 40h28l6 12c1 3-1 6-4 6H16c-3 0-5-3-4-6z"/><path ${S} d="M26 6h12M28 6v18L12 52c-1 3 1 6 4 6h32c3 0 5-3 4-6L36 24V6M18 40h28M30 48h2M38 46h2"/>`,
  atom: `<ellipse cx="32" cy="32" rx="26" ry="10" ${S}/><ellipse cx="32" cy="32" rx="26" ry="10" ${S} transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" ${S} transform="rotate(-60 32 32)"/><circle cx="32" cy="32" r="5" fill="var(--accent)"/>`,
  globe: `<circle cx="32" cy="32" r="24" ${F}/><circle cx="32" cy="32" r="24" ${S}/><path ${S} d="M8 32h48M32 8c-8 8-8 40 0 48M32 8c8 8 8 40 0 48M12 20h40M12 44h40"/>`,
  leaf: `<path ${F} d="M10 54C10 26 26 10 56 8c0 30-16 46-46 46z"/><path ${S} d="M10 54C10 26 26 10 56 8c0 30-16 46-46 46zM10 54L40 24M22 42h12M30 34v-10"/>`,
  heart: `<path ${F} d="M32 54S8 40 8 22c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 18-24 32-24 32z"/><path ${S} d="M32 54S8 40 8 22c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 18-24 32-24 32z"/>`,
  people: `<circle cx="22" cy="20" r="8" ${F}/><circle cx="22" cy="20" r="8" ${S}/><circle cx="44" cy="24" r="6" ${S}/><path ${S} d="M6 54c0-12 7-20 16-20s16 8 16 20M34 54c0-8 4-15 10-15s12 6 12 15"/>`,
  speech: `<path ${F} d="M8 12h48v30H26l-12 10v-10H8z"/><path ${S} d="M8 12h48v30H26l-12 10v-10H8zM18 22h28M18 31h18"/>`,
  rocket: `<path ${F} d="M32 6c10 8 14 20 10 34H22C18 26 22 14 32 6z"/><path ${S} d="M32 6c10 8 14 20 10 34H22C18 26 22 14 32 6zM22 40l-8 8 2-14M42 40l8 8-2-14M27 46l5 12 5-12"/><circle cx="32" cy="22" r="5" ${S}/>`,
  gear: `<circle cx="32" cy="32" r="10" ${S}/><path ${F} d="M28 6h8l2 8 6 3 7-4 6 6-4 7 3 6 8 2v8l-8 2-3 6 4 7-6 6-7-4-6 3-2 8h-8l-2-8-6-3-7 4-6-6 4-7-3-6-8-2v-8l8-2 3-6-4-7 6-6 7 4 6-3z"/><path ${S} d="M28 6h8l2 8 6 3 7-4 6 6-4 7 3 6 8 2v8l-8 2-3 6 4 7-6 6-7-4-6 3-2 8h-8l-2-8-6-3-7 4-6-6 4-7-3-6-8-2v-8l8-2 3-6-4-7 6-6 7 4 6-3z"/><circle cx="32" cy="32" r="10" ${S}/>`,
  key: `<circle cx="20" cy="24" r="12" ${F}/><circle cx="20" cy="24" r="12" ${S}/><path ${S} d="M29 32l25 22M44 46l6-6M50 52l4-4"/>`,
  flag: `<path ${S} d="M12 58V6"/><path ${F} d="M12 8h36l-8 12 8 12H12z"/><path ${S} d="M12 8h36l-8 12 8 12H12"/>`,
  plus: `<rect x="10" y="10" width="44" height="44" rx="8" ${S}/><path ${S} d="M32 20v24M20 32h24"/>`,
  minus: `<rect x="10" y="10" width="44" height="44" rx="8" ${S}/><path ${S} d="M20 32h24"/>`,
  times: `<rect x="10" y="10" width="44" height="44" rx="8" ${S}/><path ${S} d="M23 23l18 18M41 23L23 41"/>`,
  divide: `<rect x="10" y="10" width="44" height="44" rx="8" ${S}/><path ${S} d="M20 32h24"/><circle cx="32" cy="23" r="2.5" fill="currentColor"/><circle cx="32" cy="41" r="2.5" fill="currentColor"/>`,
  arrow: `<path ${S} d="M8 36c12-14 30-16 44-8M44 18l8 10-12 4"/>`,
  cloud: `<path ${F} d="M18 48c-8 0-12-6-10-12 1-5 6-7 10-6 1-8 8-13 16-11 5 1 9 5 10 10 6-1 12 3 12 10 0 5-4 9-10 9z"/><path ${S} d="M18 48c-8 0-12-6-10-12 1-5 6-7 10-6 1-8 8-13 16-11 5 1 9 5 10 10 6-1 12 3 12 10 0 5-4 9-10 9z"/>`,
  laptop: `<rect x="12" y="12" width="40" height="28" rx="3" ${F}/><rect x="12" y="12" width="40" height="28" rx="3" ${S}/><path ${S} d="M4 48h56l-4 6H8z"/>`,
  music: `<path ${S} d="M24 46V12l28-6v34"/><ellipse cx="18" cy="46" rx="7" ry="5" ${F}/><ellipse cx="18" cy="46" rx="7" ry="5" ${S}/><ellipse cx="46" cy="40" rx="7" ry="5" ${F}/><ellipse cx="46" cy="40" rx="7" ry="5" ${S}/>`,
  sun: `<circle cx="32" cy="32" r="12" ${F}/><circle cx="32" cy="32" r="12" ${S}/><path ${S} d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6"/>`,
  map: `<path ${F} d="M6 14l16-6 20 6 16-6v42l-16 6-20-6-16 6z"/><path ${S} d="M6 14l16-6 20 6 16-6v42l-16 6-20-6-16 6zM22 8v42M42 14v42"/>`,
  stack: `<rect x="10" y="40" width="44" height="12" rx="2" ${F}/><path ${S} d="M10 40h44v12H10zM14 28h40v12H14zM8 16h44v12H8zM16 46h8M20 34h8M14 22h8"/>`,
  plant: `<path ${F} d="M18 40h28l-4 18H22z"/><path ${S} d="M18 40h28l-4 18H22zM32 40V18M32 30c-8 0-14-6-14-14 8 0 14 6 14 14zM32 24c8 0 14-6 14-14-8 0-14 6-14 14z"/>`,
  laurel: `<path ${S} d="M40 60C20 50 14 30 22 6"/><path ${F} d="M22 14c-8-2-10-8-8-12 6 1 9 6 8 12zM20 26c-8 0-12-5-11-10 6 0 10 4 11 10zM22 38c-8 1-13-3-13-8 6-1 11 3 13 8zM28 48c-7 3-13 0-15-5 6-2 12 0 15 5zM24 14c6-5 12-4 14 0-5 4-10 4-14 0zM23 27c6-4 12-2 13 2-5 3-10 3-13-2zM26 39c6-3 11 0 12 4-6 2-10 1-12-4z"/><path ${S} d="M22 14c-8-2-10-8-8-12 6 1 9 6 8 12zM20 26c-8 0-12-5-11-10 6 0 10 4 11 10zM22 38c-8 1-13-3-13-8 6-1 11 3 13 8zM28 48c-7 3-13 0-15-5 6-2 12 0 15 5z"/>`,
};

export const iconNames = Object.keys(ICONS);

export function icon(name, cls = 'doodle') {
  const body = ICONS[name];
  if (!body) return '';
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;
}
