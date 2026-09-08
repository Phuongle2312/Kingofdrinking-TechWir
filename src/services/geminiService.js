const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const askAiTutor = async (
  prompt,
  lessonContext = "Web Development",
  chatHistory = [],
) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    return "⚠️ Bạn chưa nhập VITE_GEMINI_API_KEY vào file .env. Hãy cấu hình API Key từ Google AI Studio (aistudio.google.com) để trò chuyện với AI Tutor nhé!";
  }

  const systemPrompt = `Bạn là "EduPulse AI Tutor", gia sư thông minh hỗ trợ sinh viên FPT tham gia cuộc thi Techwir (Web Innovation Unleashed).
Ngữ cảnh bài học hiện tại: "${lessonContext}".
Nguyên tắc:
1. Trả lời súc tích, ngắn gọn, dùng tiếng Việt chuẩn mực.
2. Luôn có ví dụ code ngắn gọn (HTML/CSS/JS/React) khi sinh viên hỏi về kỹ thuật.
3. Nếu phát hiện lỗi trong câu hỏi, hãy giải thích nguyên nhân và cách khắc phục trực tiếp.`;

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [{ text: "Đã rõ. Tôi sẵn sàng đồng hành và hỗ trợ bạn học tập!" }],
    },
    ...chatHistory.slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Lỗi API");
    }

    const data = await res.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI chưa có câu trả lời phù hợp."
    );
  } catch (error) {
    return `⚠️ Lỗi kết nối AI: ${error.message}`;
  }
};
