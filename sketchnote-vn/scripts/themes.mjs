// Bảng màu cho poster. Mỗi theme chỉ đổi biến CSS; bố cục giữ nguyên.
// paper: nền giấy · line: dòng kẻ · ink: chữ/nét chính · frame: viền thẻ
// accent: điểm nhấn · accent-soft: mảng tô nhạt · chip: nhãn TỪ KHÓA · mark: bút dạ quang

export const THEMES = {
  // Bút bi xanh trên giấy kẻ — giống ảnh mẫu "Tổng hợp kiến thức".
  'blue-ink': {
    label: 'Bút xanh – giấy kẻ (mặc định)',
    vars: {
      mm1: '#d9534f', mm2: '#2e7d4f', mm3: '#d99a16', mm4: '#3b6fd1', mm5: '#8e5bb5', mm6: '#33415c', box: '#f4b98a', 'box-side': '#a8683a', cat: '#d9d6e0', collar: '#3b6fd1', 'card-bg': 'rgba(255,255,255,.35)', 'ring-inner': '#e6f4ea', leaf: '#3c8d5a', 'icon-fill': '#ffd98e', paper: '#fbf8f1', line: 'rgba(120,150,200,.16)', ink: '#1d3a8a', 'ink-soft': '#33415c',
      frame: '#d9534f', accent: '#f2b632', 'accent-soft': '#fdecc8', chip: '#2e7d4f',
      'chip-bg': '#e6f4ea', mark: 'rgba(253,224,71,.55)', 'title-fill': '#fffdf6',
    },
  },
  // Sổ tay pastel (Morandi) — dịu mắt, hợp môn xã hội, ngữ văn.
  'pastel-journal': {
    label: 'Sổ tay pastel',
    vars: {
      mm1: '#b5838d', mm2: '#6f9a7a', mm3: '#c99263', mm4: '#6d8fb3', mm5: '#9d7bb0', mm6: '#6b6170', box: '#efc9a8', 'box-side': '#b98a66', cat: '#e3dde6', collar: '#b5838d', 'card-bg': 'rgba(255,255,255,.35)', 'ring-inner': '#ece4f0', leaf: '#6f9a7a', 'icon-fill': '#f2c6b4', paper: '#f6f1ea', line: 'rgba(150,130,110,.14)', ink: '#4b4453', 'ink-soft': '#6b6170',
      frame: '#b5838d', accent: '#e5989b', 'accent-soft': '#f4e1d2', chip: '#6d6875',
      'chip-bg': '#ece4f0', mark: 'rgba(229,152,155,.35)', 'title-fill': '#fffaf5',
    },
  },
  // Bảng đen phấn trắng — hợp lý, hoá, toán ôn thi.
  chalkboard: {
    label: 'Bảng đen phấn',
    vars: {
      mm1: '#f6d27a', mm2: '#a8d5ba', mm3: '#f4a6a6', mm4: '#9cc7f0', mm5: '#d7b8f3', mm6: '#dfe7dc', box: '#d9a273', 'box-side': '#8a5a35', cat: '#cfd3d8', collar: '#f6d27a', 'card-bg': 'rgba(0,0,0,.08)', 'ring-inner': 'rgba(168,213,186,.22)', leaf: '#a8d5ba', 'icon-fill': 'rgba(246,210,122,.35)', paper: '#2f4a3c', line: 'rgba(255,255,255,.05)', ink: '#f5f2e8', 'ink-soft': '#dfe7dc',
      frame: '#f6d27a', accent: '#f6d27a', 'accent-soft': 'rgba(246,210,122,.18)', chip: '#2f4a3c',
      'chip-bg': '#a8d5ba', mark: 'rgba(246,210,122,.35)', 'title-fill': '#3a5a49',
    },
  },
  // Giấy trắng mực đen tối giản — in đen trắng tiết kiệm mực.
  'print-bw': {
    label: 'Đen trắng (in ấn)',
    vars: {
      mm1: '#1a1a1a', mm2: '#444444', mm3: '#666666', mm4: '#1a1a1a', mm5: '#444444', mm6: '#666666', box: '#eeeeee', 'box-side': '#9a9a9a', cat: '#ffffff', collar: '#1a1a1a', 'card-bg': 'rgba(255,255,255,.35)', 'ring-inner': '#f2f2f2', leaf: '#555555', 'icon-fill': '#dddddd', paper: '#ffffff', line: 'rgba(0,0,0,.06)', ink: '#1a1a1a', 'ink-soft': '#333333',
      frame: '#1a1a1a', accent: '#777777', 'accent-soft': '#eeeeee', chip: '#ffffff',
      'chip-bg': '#1a1a1a', mark: 'rgba(0,0,0,.12)', 'title-fill': '#ffffff',
    },
  },
};
