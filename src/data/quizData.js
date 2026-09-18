export const QUIZ_DATABASE = {
  "fe-modern-101": [
    {
      id: "q1",
      question:
        "Trong React, hook nào được sử dụng để quản lý trạng thái cục bộ của Functional Component?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation:
        "useState là hook cơ bản để khai báo state trong functional component.",
    },
    {
      id: "q2",
      question:
        "Để ngăn chặn hành vi reload trang mặc định khi submit form trong React, ta dùng:",
      options: [
        "e.stopPropagation()",
        "e.preventDefault()",
        "e.stopImmediate()",
        "e.cancelBubble()",
      ],
      correctAnswer: 1,
      explanation:
        "e.preventDefault() chặn reload và submit form mặc định của trình duyệt.",
    },
    {
      id: "q3",
      question: "Tailwind CSS tuân thủ phương pháp thiết kế nào?",
      options: ["BEM", "Semantic CSS", "Utility-First CSS", "OOCSS"],
      correctAnswer: 2,
      explanation:
        "Tailwind là Utility-First CSS framework cung cấp class tiện ích dùng ngay.",
    },
  ],
  "ai-prompt-201": [
    {
      id: "q4",
      question: "Trong tương tác LLM, vai trò của 'System Instruction' là gì?",
      options: [
        "Chỉ định schema cơ sở dữ liệu",
        "Định hình vai trò, giọng điệu và giới hạn phản hồi cho mô hình AI",
        "Tăng tốc độ băng thông",
        "Xác thực bản quyền hệ thống",
      ],
      correctAnswer: 1,
      explanation:
        "System Instruction đặt ra giới hạn và vai trò hoạt động cốt lõi cho mô hình AI.",
    },
    {
      id: "q5",
      question:
        "Vì sao không nên để lộ API Key của Gemini trong mã nguồn public trên GitHub?",
      options: [
        "Vì API Key làm chậm tốc độ build",
        "Vì người khác có thể dùng key để gọi API và tiêu tốn hạn mức của bạn",
        "Vì GitHub sẽ tự động xóa repository",
        "Vì trình duyệt không đọc được biến môi trường",
      ],
      correctAnswer: 1,
      explanation:
        "API Key là thông tin bí mật; lộ key đồng nghĩa với việc bất kỳ ai cũng có thể dùng hạn mức (và chi phí) của bạn. Hãy để key trong .env và thêm .env vào .gitignore.",
    },
  ],
  "js-mastery-301": [
    {
      id: "q6",
      question: "Đoạn code sau in ra thứ tự nào?\nconsole.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');",
      options: ["A B C D", "A D C B", "A D B C", "A C D B"],
      correctAnswer: 1,
      explanation:
        "Code đồng bộ chạy trước (A, D), sau đó Event Loop xử lý microtask (Promise → C) trước macrotask (setTimeout → B).",
    },
    {
      id: "q7",
      question: "Promise.then() callback được đưa vào hàng đợi nào?",
      options: [
        "Macrotask queue",
        "Microtask queue",
        "Call stack trực tiếp",
        "Web API",
      ],
      correctAnswer: 1,
      explanation:
        "Callback của Promise được đưa vào microtask queue và luôn được xử lý hết trước macrotask tiếp theo.",
    },
    {
      id: "q8",
      question: "Closure trong JavaScript là gì?",
      options: [
        "Cách đóng một kết nối mạng",
        "Hàm ghi nhớ được biến trong phạm vi nơi nó được khai báo",
        "Từ khóa dùng để kết thúc vòng lặp",
        "Một kiểu dữ liệu nguyên thủy mới trong ES6",
      ],
      correctAnswer: 1,
      explanation:
        "Closure là hàm cùng với lexical scope mà nó được tạo ra, nên vẫn truy cập được biến bên ngoài kể cả khi hàm cha đã chạy xong.",
    },
  ],
};
