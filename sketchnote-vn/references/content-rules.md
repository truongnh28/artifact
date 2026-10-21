# Quy tắc nội dung

Mục tiêu của poster là giúp người học **nhớ lại cả bài chỉ bằng một lần nhìn**. Mọi quy tắc dưới đây đều phục vụ mục tiêu đó.

## 1. Phân tích trước khi viết
Ghi nhanh các mục sau (trong đầu hoặc vào nháp), đừng đưa lên poster:
- **Loại nội dung:** khái niệm, định nghĩa / quy trình / so sánh / phân loại / lịch sử, dòng thời gian / công thức, bài tập mẫu.
- **Mục tiêu học tập (1–3):** "Xem xong, người học hiểu được / làm được…".
- **Thông điệp cốt lõi:** một câu.
- **Độ dày:** đơn giản 4–6 thẻ · vừa 6–8 · dày 9.
- **Dữ liệu nguyên văn:** liệt kê mọi định nghĩa, công thức, số liệu, mốc năm sẽ đưa lên poster.

## 2. Chắt lọc ý
- Ưu tiên theo thứ tự: định nghĩa → kí hiệu, dạng tổng quát → ví dụ → tính chất, quy tắc → so sánh, quan hệ → lưu ý, lỗi hay gặp. Thứ tự này cũng chính là thứ tự đọc từ trái sang phải, trên xuống dưới.
- Một thẻ chứa một ý. Nếu một ý cần hơn 4 dòng, hãy tách thành hai thẻ hoặc chuyển phần phụ vào `visual`.
- Thừa ý thì **gộp các ý gần nhau hoặc bỏ ý yếu nhất**. Không thu nhỏ chữ và không nhồi thêm.
- Ghi lại các ý đã bỏ để báo người dùng.

## 3. Độ trung thành với nguồn
- **Nguyên văn:** định nghĩa, định lí, công thức, số liệu, năm, tên riêng. Ví dụ "73%" không được viết thành "khoảng 70%". "Số hữu tỉ là số viết được dưới dạng…" giữ đúng cách nói của sách.
- **Được rút gọn:** câu giải thích, dẫn dắt, ví dụ dài. Được phép bỏ bớt chữ nhưng không thêm nghĩa.
- **Không thêm** kiến thức ngoài tài liệu, dù đúng. Ngoại lệ: người dùng yêu cầu bổ sung. Khi đó đánh dấu bằng `source`, hoặc báo rõ trong câu trả lời.
- Ví dụ trong thẻ ưu tiên lấy từ chính tài liệu.

## 4. Viết tiếng Việt trên poster
"Tiếng" = một âm tiết ("số hữu tỉ" = 3 tiếng). Script đếm theo tiếng; công thức tính là 1.
- **Tiêu đề thẻ:** 2–6 tiếng, danh từ hoá ("So sánh hai số hữu tỉ", không viết "Cách để so sánh…").
- **Từ khoá:** ≤ 4 cụm, ≤ 8 tiếng, là thứ người học sẽ nhẩm lại. Không lặp nguyên tiêu đề.
- **Thân thẻ:** tối đa ~50 tiếng; câu ngắn, cụm từ. Bỏ "thì, là, mà, của, những" khi không cần, nhưng giữ nguyên câu định nghĩa.
- **GHI NHỚ NHANH:** 3–5 câu hoàn chỉnh, mỗi câu tối đa khoảng 20 từ, chốt những gì dễ bị hỏi nhất.
- Dấu câu Việt: dùng "–" (gạch ngang) cho nhãn, "…" cho liệt kê dở. Số thập phân dùng dấu phẩy: $0{,}5$.
- Viết tắt chỉ dùng loại phổ biến trong sách (SGK, KNTT, CTST, CD, VD, ĐN, T/c). Tránh tự chế.
- **Chủ đề tiếng Anh:** cũng làm được. Đặt `"lang": "en"`, `labels.keywords: "KEYWORDS"`, và viết `recap.label` cùng `header.title` bằng tiếng Anh.

## 5. Chọn hình minh hoạ: hình phải mang nghĩa
Hãy hỏi "hình này giúp hiểu quan hệ nào?". Nếu không trả lời được thì dùng icon nhỏ hoặc bỏ hẳn hình.

| Nội dung | Visual nên dùng |
|---|---|
| Định nghĩa có công thức | `formula` |
| Tập hợp, phân loại bao hàm | `nested` |
| Giá trị trên trục, khoảng, mốc thời gian có số | `numberline` |
| Các bước, quy trình, chuỗi biến đổi | `steps` (có `arrows` cho nhãn mũi tên) |
| Phương trình chữ (quang hợp, hô hấp, phản ứng) | `equation` |
| Thì động từ (tiếng Anh), mốc lịch sử | `timeline` |
| Đồ thị v–t, hàm số, số liệu theo thời gian | `graph` |
| Cấu trúc câu tiếng Anh (S + V + O) | `formula` với `\text{}` hoặc dòng `$$...$$`, hoặc `table` cho khẳng định/phủ định/nghi vấn |
| So sánh 2 khái niệm | `compare` (`sep` đổi "vs" thành "→", "≠"…) |
| So sánh 3+ đối tượng theo nhiều tiêu chí | `table` |
| Phép toán, quy tắc dấu | icon inline `:plus: :minus: :times: :divide:` |

## 6. Gợi ý icon theo môn

| Môn / chủ đề | Icon |
|---|---|
| Toán (số, đại số) | calculator, plus/minus/times/divide, scale (so sánh, phương trình), key (mẹo) |
| Hình học | ruler, compass, puzzle |
| Vật lí | atom, rocket (chuyển động), sun (ánh sáng, nhiệt), gear (máy cơ), clock |
| Hoá học | flask, atom, warning (an toàn thí nghiệm) |
| Sinh học | leaf, plant, heart, people |
| Địa lí | globe, map, sun, cloud |
| Lịch sử | flag, clock, map, people |
| Ngữ văn | book, pencil, speech, heart |
| Tiếng Anh | speech, book, music |
| Tin học | laptop, gear, puzzle |
| Lưu ý, lỗi hay gặp | warning |
| Mẹo, ghi nhớ | bulb, key, star |
| Mục tiêu, ứng dụng | target, rocket |

## 7. Khẩu hiệu cuối (`footer`)
Viết một câu ngắn, tích cực, hợp môn học: "Học để hiểu, hiểu để vận dụng!", "Hiểu bản chất – làm bài chắc chắn!". Có thể bỏ trống nếu người dùng muốn poster gọn.
