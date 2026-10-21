# Schema blueprint JSON

Blueprint là nguồn sự thật duy nhất của poster. `scripts/build.mjs` đọc file này và dựng HTML. Mọi trường đều tuỳ chọn, trừ `cards`.

```jsonc
{
  "theme": "blue-ink",            // blue-ink | pastel-journal | chalkboard | print-bw
  "density": "normal",            // normal | dense (chữ nhỏ hơn, thẻ chứa ~90 tiếng; nên đi với columns: 2)
  "columns": 3,                   // mặc định: ≤4 thẻ → 2 cột, còn lại → 3 cột
  "width": 1080,                  // chiều rộng PNG (px, trước khi nhân scale); 2 cột mặc định 820
  "seed": 7,                      // đổi số để nét viền "run tay" khác đi
  "lang": "vi",
  "decorations": ["laurel", "star"],  // trang trí quanh tiêu đề; [] để tắt
  "labels": { "keywords": "TỪ KHÓA" },  // đổi nhãn chip, ví dụ "KEYWORDS" cho poster tiếng Anh

  "header": {
    "title": "TỔNG HỢP KIẾN THỨC",       // chữ trong băng rôn (nên viết HOA, ≤ 22 kí tự)
    "tag": "TOÁN 7 – TẬP 1 – KNTT",      // nhãn viên thuốc: môn – lớp – bộ sách
    "subtitle": "Bài 1. Tập hợp các số hữu tỉ"  // tên bài, font viết tay lớn
  },

  "cards": [
    {
      "title": "Khái niệm số hữu tỉ",    // tự động VIẾT HOA khi hiển thị (trừ công thức)
      "body": [                          // mỗi phần tử là một dòng
        "Đoạn văn thường, có thể chứa $\\frac{a}{b}$",
        "- gạch đầu dòng",
        "> ô nhấn mạnh (nền màu)",
        "$$công thức dòng riêng, căn giữa$$",
        "**đậm**, ==tô dạ quang==, icon nhỏ :plus:, <br> xuống dòng (dùng trong ô bảng)"
      ],
      "visual": { "type": "formula", "tex": "\\dfrac{a}{b}", "note": "ghi chú dưới" },
      // visual cũng có thể là mảng nhiều visual
      "keywords": "$a, b, \\mathbb{Z}, b \\neq 0$",
      "span": 2,                         // tuỳ chọn: thẻ chiếm 2 cột (hoặc 3 = cả hàng)
      "visualFirst": true,               // tuỳ chọn: đặt hình minh hoạ lên trước thân thẻ
      "after": ["- lưu ý sau hình"]       // tuỳ chọn: các dòng hiển thị SAU hình minh hoạ (giải thích → bảng → lưu ý)
    }
  ],

  "recap": {
    "label": "GHI NHỚ NHANH",
    "items": ["3–5 câu chốt"],
    "icon": "stack"                      // icon trang trí góc phải khung
  },
  "footer": "Học để hiểu, hiểu để vận dụng!",   // khẩu hiệu cuối poster
  "source": "SGK Toán 7 KNTT, tr. 5–8"          // tuỳ chọn: dòng nguồn nhỏ góc phải
}
```

## Công thức (KaTeX)
- Inline `$...$` và dòng riêng `$$...$$`. Trong JSON, mỗi `\` phải viết thành `\\`.
- `**đậm**` và `==tô==` bọc được cả công thức: `"**chia $3{,}6$**"`.
- Chữ tiếng Việt trong công thức (`\text{...}`) tự dùng font viết tay. Nhưng phương trình chữ thuần thì dùng visual `equation`, đừng nhét vào KaTeX.
- Trong thân thẻ và GHI NHỚ NHANH, `\frac` tự đổi thành `\dfrac` cho phân số to, dễ đọc. Ở tiêu đề và từ khoá, phân số giữ cỡ nhỏ.
- Tập số: `\mathbb{N}`, `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{R}`. Quan hệ: `\in`, `\notin`, `\subset`, `\neq`, `\leq`, `\geq`, `\Leftrightarrow`, `\Rightarrow`.
- Hoá học: KaTeX không có `\ce`. Viết `$\text{H}_2\text{O}$`, `$\text{CO}_2$`, mũi tên phản ứng `$\xrightarrow{t^\circ}$`.
- Đơn vị: `$9{,}8\ \text{m/s}^2$`. Dùng `{,}` cho dấu phẩy thập phân kiểu Việt Nam.

## Các loại `visual`

| type | Trường | Dùng khi |
|---|---|---|
| `formula` | `tex` (LaTeX, không cần `$`), `note` | Một công thức trọng tâm trong "đám mây". Nên ngắn (≤ ~25 kí tự LaTeX hiển thị); công thức dài tự thu nhỏ — dài hơn nữa thì dùng dòng `$$...$$` |
| `equation` | `left: [...]`, `right: [...]`, `over`, `under` | **Phương trình chữ** (sinh, hoá): "Nước + Carbon dioxide —(ánh sáng, diệp lục)→ Glucose + Oxygen". Dùng font viết tay; thẻ hẹp tự xếp dọc |
| `graph` | `x`, `y` (nhãn trục, LaTeX), `lines: [{points: [[x,y],…], label}]`, `shade` (chỉ số đường tô vùng dưới), `marks: [{at: [x,y], label}]`, `caption`, `xmax`/`ymax` | Đồ thị đơn giản: v–t, s–t, hàm bậc nhất, nhiệt độ theo thời gian. Tô vùng = diện tích dưới đồ thị |
| `numberline` | `min`, `max`, `step`, `points: [{x, label}]` (label là LaTeX) | Trục số, khoảng giá trị |
| `timeline` | `marks: [{at, to?, kind?, label, done?}]`, `labels` (mặc định Quá khứ/Hiện tại/Tương lai) | Thì động từ, mốc thời gian. Toạ độ −1…1, hiện tại = 0. `at` là mảng → các chấm lặp lại (thói quen); có `to` → một đoạn (đang diễn ra); `done: true` → dấu ✓ (đã kết thúc) |
| `nested` | `sets: [ngoài → trong]` (chuỗi, có thể có `$...$`) | Quan hệ bao hàm: ℕ⊂ℤ⊂ℚ, giới → ngành → lớp. 2–4 tầng |
| `steps` | `items: [...]`, `arrows: [nhãn mũi tên 1, …]` (tuỳ chọn) | Quy trình, chuỗi biến đổi (2–5 bước). Nhãn trên mũi tên cho điều kiện/tác nhân |
| `table` | `head: [...]`, `rows: [[...]]` | So sánh nhiều thuộc tính, bảng chia động từ, bảng giá trị (≤ 4 cột, ≤ 6 hàng). Không hợp với phân số lớn — chữ trong bảng nhỏ |
| `compare` | `left: [dòng]`, `right: [dòng]`, `sep` (mặc định "vs") | Hai phía đối lập/đối chiếu. Dùng `"sep": "→"` cho đầu vào → đầu ra, `"≠"`, `"⇔"`… |
| `icon` | `name`, `align`: right/center/left | Minh hoạ khi không có hình mang nghĩa hơn |
| `icons` | `names: [...]` | Một hàng 2–4 icon |

## Lấp đầy lưới
- Lưới 3 cột: tổng số ô (thẻ thường = 1, `span: 2` = 2, `span: 3` = 3) nên chia hết cho 3 — script cảnh báo khi hàng cuối trống. Ví dụ: 8 thẻ → cho 1 thẻ `span: 2` (9 ô ✓); 7 thẻ → 2 thẻ `span: 2` (9 ô ✓); 5 thẻ → 1 thẻ `span: 2` (6 ô ✓).
- Lưới tự lấp chỗ trống (`dense`), nên thẻ `span` có thể đứng bất kì vị trí; thứ tự hiển thị có thể nhảy một chút — kiểm tra thứ tự đọc trong PNG.
- Thẻ có bảng rộng hoặc nhiều công thức dòng riêng → `span: 2`. Thẻ ít chữ → thêm visual hoặc gộp với thẻ bên cạnh.

## Icon có sẵn
`book, pencil, bulb, star, scale, check, warning, target, magnifier, puzzle, chart, clock, calculator, ruler, compass, flask, atom, globe, leaf, heart, people, speech, rocket, gear, key, flag, plus, minus, times, divide, arrow, cloud, laptop, music, sun, map, stack, plant, laurel`

Dùng inline trong văn bản bằng `:ten:`, hoặc làm `visual` với `{"type":"icon","name":"ten"}`.
Thêm icon mới: thêm một chuỗi SVG (viewBox 64×64, nét `currentColor`) vào `scripts/icons.mjs`.

## Lệnh

```bash
node scripts/build.mjs bai.json --png              # HTML + PNG
node scripts/build.mjs bai.json --png --pdf        # thêm PDF đúng kích thước poster (1 trang dài)
node scripts/build.mjs bai.json --png --a4         # PDF khổ A4 dọc, poster thu vừa trang để in
node scripts/build.mjs bai.json --png --theme chalkboard
node scripts/build.mjs bai.json out.html --cdn     # HTML dùng CDN để chia sẻ
node scripts/render.mjs file.html out.png --width 1080 --scale 2   # chỉ chụp
node scripts/web.mjs a.json b.json -o trang.web.html --title "Tên"  # trang web có hình động (nhiều file → tab)
node scripts/web.mjs a.json -o trang.html --artifact               # bản để publish Claude Artifact
```
