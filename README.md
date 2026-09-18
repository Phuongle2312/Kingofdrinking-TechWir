# EduPulse AI

Nền tảng học lập trình web tích hợp **gia sư AI (Google Gemini)**, dự thi **FPT Techwir: Web Innovation Unleashed**.

## Tính năng

- **Thư viện khóa học**: lọc theo danh mục, đăng ký khóa học.
- **Phòng học**: xem video bài giảng, ghi chú trọng tâm, đánh dấu hoàn thành, chuyển bài trước/sau.
- **Mini-quiz**: chấm điểm tự động, hiển thị đáp án và giải thích, cho phép làm lại (lưu điểm cao nhất).
- **Bảng tiến độ**: số khóa đang học, số bài đã hoàn thành, điểm quiz từng khóa.
- **AI Tutor**: khung chat nổi trên mọi trang, tự nhận biết khóa/bài đang học, hiển thị code block.
- **Giao diện sáng/tối**: tự theo hệ điều hành, có nút chuyển trên thanh điều hướng.

Tiến độ học tập được lưu trong `localStorage` của trình duyệt (không cần backend).

## Công nghệ

React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · lucide-react · Gemini API · Oxlint

Font: [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) (Google Fonts).

## Cài đặt & chạy

Yêu cầu Node.js 20.19+ (hoặc 22.12+).

```bash
npm install
cp .env.example .env   # rồi điền API key
npm run dev
```

### Cấu hình `.env`

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | Có (để dùng AI Tutor) | Lấy tại [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_GEMINI_MODEL` | Không | Mặc định `gemini-3.6-flash` |

> ⚠️ `.env` đã nằm trong `.gitignore`, **không commit file này**. Lưu ý: biến có tiền tố `VITE_` sẽ được đóng gói vào mã JS phía client, nên ai mở trang web cũng có thể xem được key. Chỉ dùng key có giới hạn hạn mức / giới hạn domain cho bản demo; nếu triển khai thật, hãy gọi Gemini qua một serverless proxy.

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production vào `dist/` |
| `npm run preview` | Xem thử bản build |
| `npm run lint` | Kiểm tra code bằng Oxlint |

## Cấu trúc thư mục

```
src/
├── components/   # Navbar, Footer, CourseCard, QuizModal, ChatWidget
├── context/      # LearningProvider (state + localStorage) và hook useLearning
├── data/         # Dữ liệu khóa học và câu hỏi quiz
├── pages/        # Home, Courses, StudyRoom, Dashboard, NotFound
├── services/     # geminiService: gọi Gemini API
├── App.jsx       # Router + lazy-load các trang
└── main.jsx
```

Thêm khóa học mới: sửa `src/data/coursesData.js`; thêm quiz: sửa `src/data/quizData.js` (key là `id` của khóa học).

## Triển khai

Ứng dụng dùng `BrowserRouter`, nên server phải trả về `index.html` cho mọi đường dẫn:

- **Vercel**: đã có sẵn `vercel.json`.
- **Netlify**: đã có sẵn `public/_redirects`.

Nhớ khai báo `VITE_GEMINI_API_KEY` trong phần Environment Variables của nền tảng deploy.
