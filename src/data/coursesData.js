export const COURSES_DATA = [
  {
    id: "fe-modern-101",
    title: "Lập Trình Web Hiện Đại với React & Tailwind",
    level: "Cơ bản - Trung cấp",
    instructor: "Giảng viên FPT Aptech",
    category: "Lập Trình Frontend",
    rating: 4.9,
    studentsCount: 1240,
    thumbnail:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&auto=format&fit=crop&q=80",
    description:
      "Khóa học rèn luyện tư duy component, quản lý state với Hooks, context API và tối ưu giao diện linh hoạt chuẩn dự án Techwir.",
    lessons: [
      {
        id: "les-1",
        title: "Bài 1: Kiến trúc Component, Virtual DOM & JSX",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        notes:
          "Hiểu rõ Virtual DOM, cách React render và quy tắc viết JSX chuẩn mực.",
      },
      {
        id: "les-2",
        title: "Bài 2: State & Lifecycle với useState, useEffect",
        videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
        notes:
          "Thực hành hook cơ bản, phòng tránh re-render vô hạn và quản lý side-effects.",
      },
      {
        id: "les-3",
        title: "Bài 3: Xây dựng UI chuẩn Design System với Tailwind CSS",
        videoUrl: "https://www.youtube.com/embed/dFgzHOX84xQ",
        notes:
          "Utility-first CSS, Breakpoint responsive và tối ưu cấu trúc ClassName.",
      },
    ],
  },
  {
    id: "ai-prompt-201",
    title: "Ứng Dụng GenAI & Gemini API Trong Phát Triển Web",
    level: "Trung cấp",
    instructor: "Chuyên gia AI Lab FPT",
    category: "AI & Đổi Mới",
    rating: 4.85,
    studentsCount: 980,
    thumbnail:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=80",
    description:
      "Tích hợp mô hình ngôn ngữ lớn (LLM) vào ứng dụng Client-side: kỹ thuật Prompt, streaming và tạo AI Tutor tự động.",
    lessons: [
      {
        id: "les-4",
        title: "Bài 1: Cấu trúc Prompt tối ưu cho Trợ Lý Gia Sư",
        videoUrl: "https://www.youtube.com/embed/jC4v5AS4RIM",
        notes:
          "Kỹ thuật System Prompt, Few-shot và xử lý output JSON chính xác.",
      },
      {
        id: "les-5",
        title: "Bài 2: Gọi Gemini API trực tiếp từ Client và quản lý Context",
        videoUrl: "https://www.youtube.com/embed/a-zakrDShRc",
        notes:
          "Quản lý Chat Token, xử lý timeout và fallback khi gián đoạn mạng.",
      },
    ],
  },
  {
    id: "js-mastery-301",
    title: "JavaScript ES6+ Chuyên Sâu & Bất Đồng Bộ",
    level: "Nâng cao",
    instructor: "Mentor Techwir",
    category: "JavaScript Cốt Lõi",
    rating: 4.95,
    studentsCount: 2150,
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80",
    description:
      "Làm chủ Promise, Async/Await, Event Loop, Closures và xử lý cấu trúc dữ liệu mảng nâng cao.",
    lessons: [
      {
        id: "les-6",
        title: "Bài 1: Phân tích Event Loop, Microtasks & Macrotasks",
        videoUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ",
        notes: "Call stack vận hành ra sao trong JavaScript Engine V8.",
      },
    ],
  },
];
