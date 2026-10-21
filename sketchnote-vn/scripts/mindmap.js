// Vẽ đường nối cong cho sơ đồ tư duy (.v-mindmap) theo vị trí thật của các nút sau khi dàn trang.
// Dùng chung cho bản PNG (build.mjs) và bản web (web.mjs); gọi lại khi đổi kích thước / đổi tab.
function drawMindmaps() {
  const COLORS = ['var(--mm1)', 'var(--mm2)', 'var(--mm3)', 'var(--mm4)', 'var(--mm5)', 'var(--mm6)'];
  for (const mm of document.querySelectorAll('.v-mindmap')) {
    const svg = mm.querySelector('.mm-links');
    const box = mm.getBoundingClientRect();
    if (!box.width) continue;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    const c = mm.querySelector('.mm-center').getBoundingClientRect();
    const cx = c.left + c.width / 2 - box.left, cy = c.top + c.height / 2 - box.top;
    const stacked = getComputedStyle(mm).gridTemplateColumns.trim().split(/\s+/).length === 1;
    let paths = '', trunk = '', trunkEnd = 0;
    mm.querySelectorAll('.mm-branch').forEach((br) => {
      const n = br.querySelector('.mm-node').getBoundingClientRect();
      const color = COLORS[Number(getComputedStyle(br).getPropertyValue('--b')) % COLORS.length];
      br.style.setProperty('--bc', color);
      const nx = n.left + n.width / 2 - box.left, ny = n.top + n.height / 2 - box.top;
      let x1, y1, x2, y2, d;
      if (stacked) { // xếp dọc (màn hẹp): thân chạy dọc lề trái, mỗi nhánh rẽ ngang vào nút
        const tx = 8, cb = c.bottom - box.top;
        trunkEnd = Math.max(trunkEnd, ny);
        trunk = `M${cx} ${cb}C${cx} ${cb + 16} ${tx} ${cb + 6} ${tx} ${cb + 26}`;
        d = `M${tx} ${ny}H${n.left - box.left}`;
      } else {
        const right = nx > cx;
        x1 = right ? c.right - box.left - 4 : c.left - box.left + 4; y1 = cy;
        x2 = right ? n.left - box.left : n.right - box.left; y2 = ny;
        const mx = (x1 + x2) / 2;
        d = `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
      }
      paths += `<path d="${d}" style="stroke:${color}" pathLength="1"/>`;
    });
    if (trunk) paths = `<path d="${trunk}V${trunkEnd}" style="stroke:var(--ink-soft)" pathLength="1"/>` + paths;
    svg.innerHTML = paths;
  }
}
