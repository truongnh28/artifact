# sketchnote-vn — Poster "Tổng hợp kiến thức" vẽ tay

Skill cho Claude Code biến một tài liệu thành poster ôn tập kiểu sketchnote. Đầu vào có thể là PDF, Word, ảnh chụp sách, link hoặc đoạn văn.

Poster gồm:
- Tiêu đề dạng băng rôn.
- 6–9 thẻ đánh số, mỗi thẻ có **TỪ KHÓA**.
- Icon doodle.
- Khung **GHI NHỚ NHANH**.
- Nền giấy kẻ.

Poster được dựng bằng **HTML + KaTeX rồi chụp thành PNG**, không dùng AI vẽ ảnh. Nhờ vậy, dấu tiếng Việt, phân số và các kí hiệu ℚ ℤ ℕ luôn đúng.

![Toán 7 – Tập hợp các số hữu tỉ](posters/toan-7/toan7-so-huu-ti.png)

## Cài đặt

```bash
git clone https://github.com/truongnh28/artifact.git
mkdir -p ~/.claude/skills
cp -R artifact/sketchnote-vn ~/.claude/skills/
```

Yêu cầu: Node ≥ 22 và Google Chrome, Chromium hoặc Edge. Font và KaTeX đã đóng gói sẵn, nên chạy được khi offline.

## Dùng

Trong Claude Code, gửi tài liệu kèm một câu như:

> Làm cho em một tấm tổng hợp kiến thức kiểu vẽ tay từ bài này nhé

Skill tự đọc tài liệu, chắt lọc ý, viết file nội dung `*.json`, rồi render ra `*.png`.

Bạn cũng có thể tự sửa file JSON rồi build lại:

```bash
node ~/.claude/skills/sketchnote-vn/scripts/build.mjs bai.json --png            # PNG
node ~/.claude/skills/sketchnote-vn/scripts/build.mjs bai.json --png --a4       # thêm PDF A4 để in
node ~/.claude/skills/sketchnote-vn/scripts/build.mjs bai.json --png --theme chalkboard
```

### Bản web có hình động

```bash
node ~/.claude/skills/sketchnote-vn/scripts/web.mjs bai1.json bai2.json -o trang.web.html --title "Tên trang"
```

Lệnh này tạo **một file HTML tự chứa**: font và công thức được nhúng sẵn, nên mở được offline và đưa lên GitHub Pages được.
- Nhiều file JSON sẽ thành các tab trong cùng một trang.
- Trên điện thoại, trang tự xếp thành 1 cột.
- Khi máy để chế độ tối, trang tự đổi sang giao diện bảng đen.
- Hình động gồm:
  - Thẻ trượt vào khi cuộn tới.
  - Icon tự vẽ nét.
  - Trục số, đồ thị, tập hợp lồng nhau và trục thời gian chạy hiệu ứng.
- Bấm vào một thẻ để xem lại hiệu ứng của thẻ đó.
- Hiệu ứng tự tắt khi người xem bật chế độ "giảm chuyển động".

**Xem online (GitHub Pages):**
- Cả 5 poster: https://truongnh28.github.io/artifact/
- Ngữ pháp tiếng Anh 7 (2 tab): https://truongnh28.github.io/artifact/ngu-phap-tieng-anh-7.html
- Toán 7 cả năm (10 chương, 10 tab): https://truongnh28.github.io/artifact/toan-7.html

Mã nguồn của các trang này nằm trong thư mục [`docs/`](docs/).

**Theme:** `blue-ink` (mặc định), `pastel-journal`, `chalkboard`, `print-bw`.

**Mức chi tiết:** thêm `"density": "dense"` vào file JSON khi muốn nhiều kiến thức hơn trên mỗi thẻ.

**Hình minh hoạ:** `mindmap` (sơ đồ tư duy), `positions` (tranh mèo & hộp cho giới từ), `funnel` (phễu in › on › at), `bars` (cột so sánh), `jars` (lọ số lượng), `fraction` (bánh phân số), `flow` (lấy vào → tạo ra), `motion` (chuyển động theo mốc), `reorder` (đảo trật tự từ), `timeline` (trục thời gian), `formula`, `equation` (phương trình chữ), `graph` (đồ thị), `numberline`, `nested` (tập hợp lồng nhau), `steps`, `table`, `compare`, `icon`.

Chi tiết schema nằm trong [`sketchnote-vn/references/blueprint-schema.md`](sketchnote-vn/references/blueprint-schema.md).

## Poster mẫu

| Môn | Poster | Nội dung (JSON) |
|---|---|---|
| Toán 7 – Chương I. Số hữu tỉ | [PNG](posters/toan-7/chuong-01-so-huu-ti.png) | [JSON](posters/toan-7/chuong-01-so-huu-ti.json) |
| Toán 7 – Chương II. Số thực | [PNG](posters/toan-7/chuong-02-so-thuc.png) | [JSON](posters/toan-7/chuong-02-so-thuc.json) |
| Toán 7 – Chương III. Góc và đường thẳng song song | [PNG](posters/toan-7/chuong-03-goc-va-duong-thang-song-song.png) | [JSON](posters/toan-7/chuong-03-goc-va-duong-thang-song-song.json) |
| Toán 7 – Chương IV. Tam giác bằng nhau | [PNG](posters/toan-7/chuong-04-tam-giac-bang-nhau.png) | [JSON](posters/toan-7/chuong-04-tam-giac-bang-nhau.json) |
| Toán 7 – Chương V. Thu thập và biểu diễn dữ liệu | [PNG](posters/toan-7/chuong-05-thu-thap-va-bieu-dien-du-lieu.png) | [JSON](posters/toan-7/chuong-05-thu-thap-va-bieu-dien-du-lieu.json) |
| Toán 7 – Chương VI. Tỉ lệ thức và đại lượng tỉ lệ | [PNG](posters/toan-7/chuong-06-ti-le-thuc-va-dai-luong-ti-le.png) | [JSON](posters/toan-7/chuong-06-ti-le-thuc-va-dai-luong-ti-le.json) |
| Toán 7 – Chương VII. Biểu thức đại số và đa thức một biến | [PNG](posters/toan-7/chuong-07-bieu-thuc-dai-so-va-da-thuc.png) | [JSON](posters/toan-7/chuong-07-bieu-thuc-dai-so-va-da-thuc.json) |
| Toán 7 – Chương VIII. Làm quen với biến cố và xác suất | [PNG](posters/toan-7/chuong-08-bien-co-va-xac-suat.png) | [JSON](posters/toan-7/chuong-08-bien-co-va-xac-suat.json) |
| Toán 7 – Chương IX. Quan hệ giữa các yếu tố trong tam giác | [PNG](posters/toan-7/chuong-09-quan-he-cac-yeu-to-trong-tam-giac.png) | [JSON](posters/toan-7/chuong-09-quan-he-cac-yeu-to-trong-tam-giac.json) |
| Toán 7 – Chương X. Một số hình khối trong thực tiễn | [PNG](posters/toan-7/chuong-10-hinh-khoi-trong-thuc-tien.png) | [JSON](posters/toan-7/chuong-10-hinh-khoi-trong-thuc-tien.json) |
| Toán 7 – Bài 1 (mẫu, 3 cột) | [PNG](posters/toan-7/toan7-so-huu-ti.png) | [JSON](posters/toan-7/toan7-so-huu-ti.json) |
| KHTN 7 – Quang hợp ở thực vật | [PNG](posters/khtn-7/khtn7-quang-hop.png) | [JSON](posters/khtn-7/khtn7-quang-hop.json) |
| Vật lí 10 – Chuyển động thẳng biến đổi đều (bảng đen) | [PNG](posters/vat-li-10/vatli10-chuyen-dong-thang-bien-doi-deu.png) · [PDF A4](posters/vat-li-10/vatli10-chuyen-dong-thang-bien-doi-deu.pdf) | [JSON](posters/vat-li-10/vatli10-chuyen-dong-thang-bien-doi-deu.json) |
| Tiếng Anh 7 – Ngữ pháp Unit 1–6 | [PNG](posters/tieng-anh-7/01-ngu-phap-unit-1-6.png) | [JSON](posters/tieng-anh-7/01-ngu-phap-unit-1-6.json) |
| Tiếng Anh 7 – Ngữ pháp Unit 7–12 | [PNG](posters/tieng-anh-7/02-ngu-phap-unit-7-12.png) | [JSON](posters/tieng-anh-7/02-ngu-phap-unit-7-12.json) |
| Tiếng Anh 7 – bản web (2 tab, có hình động) | [HTML](posters/tieng-anh-7/ngu-phap-tieng-anh-7.web.html) | – |

Nội dung các poster Toán 7 tóm tắt từ SGK Toán 7 (Bộ SGK thống nhất, NXBGD), xem tại taphuan.nxbgd.vn. Nội dung poster tiếng Anh tóm tắt từ bài *Ngữ pháp tiếng Anh lớp 7 Global Success* trên apollo.edu.vn.

## Nguồn ý tưởng và giấy phép

Xem [`sketchnote-vn/CREDITS.md`](sketchnote-vn/CREDITS.md).
- KaTeX: giấy phép MIT.
- Font Mali, Pangolin, Itim, Patrick Hand: giấy phép SIL OFL 1.1.
