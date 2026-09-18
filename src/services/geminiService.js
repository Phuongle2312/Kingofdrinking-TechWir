const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const TIMEOUT_MS = 30000;
const HISTORY_LIMIT = 6;

export const isAiConfigured = () =>
  Boolean(GEMINI_API_KEY) && GEMINI_API_KEY !== "your_gemini_api_key_here";

/**
 * Gửi câu hỏi tới Gemini.
 * @returns {Promise<{ ok: boolean, text: string }>}
 */
export const askAiTutor = async (
  prompt,
  lessonContext = "Web Development",
  chatHistory = [],
) => {
  if (!isAiConfigured()) {
    return {
      ok: false,
      text: "⚠️ Bạn chưa nhập VITE_GEMINI_API_KEY vào file .env. Hãy tạo API Key tại Google AI Studio (aistudio.google.com) để trò chuyện với AI Tutor nhé!",
    };
  }

  const systemPrompt = `Bạn là "EduPulse AI Tutor", gia sư thông minh hỗ trợ sinh viên FPT tham gia cuộc thi Techwir (Web Innovation Unleashed).
Ngữ cảnh bài học hiện tại: "${lessonContext}".
Nguyên tắc:
1. Trả lời súc tích, ngắn gọn, dùng tiếng Việt chuẩn mực.
2. Luôn có ví dụ code ngắn gọn (HTML/CSS/JS/React) khi sinh viên hỏi về kỹ thuật, đặt trong khối \`\`\`.
3. Nếu phát hiện lỗi trong câu hỏi, hãy giải thích nguyên nhân và cách khắc phục trực tiếp.`;

  const contents = [
    ...chatHistory.slice(-HISTORY_LIMIT).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Lỗi API (${res.status})`);
    }

    const data = await res.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join("");

    return text
      ? { ok: true, text }
      : {
          ok: false,
          text: "AI chưa có câu trả lời phù hợp. Bạn thử hỏi lại nhé.",
        };
  } catch (error) {
    const message =
      error.name === "AbortError"
        ? "AI phản hồi quá lâu, vui lòng thử lại."
        : error.message;
    return { ok: false, text: `⚠️ Lỗi kết nối AI: ${message}` };
  } finally {
    clearTimeout(timer);
  }
};
