# Đường phụ: prompt cho AI tạo ảnh

Chỉ dùng khi người dùng **muốn ảnh do AI vẽ**, tức là cần nét tay "nghệ" hơn bản HTML. Đường chính vẫn là `build.mjs`, vì chữ và công thức luôn đúng.

Cảnh báo trước cho người dùng: AI tạo ảnh hay sai dấu tiếng Việt, phân số và kí hiệu ℚ/ℤ. Ảnh cần được soát lại từng chữ. Bài có nhiều công thức thì nên giữ bản HTML.

## Quy trình
1. Dùng **chính blueprint JSON đã viết**, không viết lại nội dung, để hai bản khớp nhau.
2. Render bản HTML trước (`build.mjs --png`). PNG đó dùng làm **ảnh tham chiếu bố cục**.
3. Lưu prompt vào file `prompts/<tên>.md` cạnh JSON để làm lại được về sau.
4. Nếu máy có công cụ tạo ảnh (MCP hoặc API), gọi công cụ đó. Nếu không có, đưa prompt cho người dùng dán vào ChatGPT / Gemini, kèm ảnh PNG tham chiếu.
5. Nếu có ảnh trả về: `Read` ảnh, so **từng chữ** với blueprint, kể cả dấu. Sai thì tạo lại, tối đa 2 lần, mỗi lần chỉ nhấn mạnh chỗ sai. Sau đó báo trung thực những chữ còn sai.

## Mẫu prompt
Viết phần mô tả bằng **tiếng Anh**, vì model hiểu tốt hơn. Phần chữ hiển thị giữ **tiếng Việt nguyên văn**. Không dán các kí hiệu định dạng `==`, `**` hay `$` vào prompt, vì model sẽ vẽ chúng thành mực.

```
A hand-drawn educational sketchnote poster, portrait 2:3, on cream lined notebook paper.
Blue ballpoint-pen ink (#1d3a8a) for all text and line art, coral-red hand-drawn rounded
borders around each card, soft yellow highlights, small doodle icons. Clean, legible
handwriting-style lettering, generous spacing, no photorealism, no 3D, no gradients.

Layout (top to bottom):
- Title banner (ribbon with laurels and stars): "<header.title>"
- Pill tag under it: "<header.tag>"
- Handwritten subtitle with wavy underline: "<header.subtitle>"
- A 3×3 grid of numbered cards. Each card: number in a hand-drawn circle, uppercase title,
  1–4 short lines, a small doodle, and at the bottom a green chip "TỪ KHÓA" followed by keywords.
- A dashed box at the bottom with a lightbulb label "GHI NHỚ NHANH" and checkbox bullets.
- Footer slogan: "<footer>"

Render this text exactly, character for character, including all Vietnamese diacritics.
All text must be in Vietnamese; do not translate:
[1] "<title>" — "<line 1>" / "<line 2>" — TỪ KHÓA: "<keywords>" — doodle: <icon/visual described in English>
[2] ...
GHI NHỚ NHANH: "<item 1>" / "<item 2>" / ...

Write math in simple form: "a/b" as a stacked fraction, ℚ ℤ ℕ as double-struck letters.
Avoid: misspelled or invented characters, extra text not listed above, watermark, signature.
```

Thay mỗi công thức LaTeX bằng cách đọc thông thường. Ví dụ `\frac{a}{b}` thành "a/b (stacked fraction)", `\mathbb{Q}` thành "ℚ".

## Theo từng model
- **GPT Image / ChatGPT:** chịu được prompt dài và danh sách chữ chính xác. Đặt kích thước qua tham số (1024×1536) và ghi thêm trong prompt.
- **Gemini / Nano Banana:** đính kèm PNG tham chiếu và nói "match the layout and style of the reference image". Prompt nên ngắn hơn, theo thứ tự: chữ chính xác → phong cách → điều cần tránh. Nhắc lại câu "all text in Vietnamese with correct diacritics", vì Gemini hay tự dịch nhãn sang tiếng Anh.
- Khi làm một bộ nhiều poster: dùng cùng một model và chép nguyên đoạn mô tả phong cách sang mọi prompt.
