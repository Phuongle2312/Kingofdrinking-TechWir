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
  ],
};
