import { COURSES_DATA } from "../data/coursesData";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.6-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;
const TIMEOUT_MS = 60000;
const HISTORY_LIMIT = 10;

export const isAiConfigured = () =>
  Boolean(GEMINI_API_KEY) && GEMINI_API_KEY !== "your_gemini_api_key_here";

const COURSE_CATALOG = COURSES_DATA.map(
  (c) =>
    `- "${c.title}" (${c.category}, trình độ ${c.level}, ${c.lessons.length} bài): ${c.description}\n  Bài học: ${c.lessons.map((l) => l.title).join("; ")}`,
).join("\n");

const buildSystemPrompt = (
  context,
) => `Bạn là "EduPulse AI Tutor", gia sư lập trình web của nền tảng học tập EduPulse AI (dự án FPT Techwir: Web Innovation Unleashed).

Người dùng đang ở: ${context}.

Danh mục khóa học hiện có trên EduPulse:
${COURSE_CATALOG}

Nguyên tắc trả lời:
1. Dùng tiếng Việt, thân thiện, súc tích. Ưu tiên câu trả lời ngắn; chỉ viết dài khi người dùng cần giải thích chi tiết.
2. Lời chào hoặc câu hỏi chung chung: trả lời ngắn gọn (1-2 câu) và gợi ý người dùng có thể hỏi gì. KHÔNG kèm code.
3. Chỉ đưa ví dụ code khi câu hỏi mang tính kỹ thuật. Code phải ngắn, chạy được, đặt trong khối \`\`\` có ghi ngôn ngữ (vd: \`\`\`jsx).
4. Khi được hỏi nên học gì / chọn khóa nào: chỉ gợi ý các khóa có trong danh mục trên, nêu lý do phù hợp.
5. Nếu người dùng đang học một bài cụ thể, bám sát nội dung bài đó.
6. Không bịa ra tính năng, khóa học hay thông tin không có trên nền tảng. Nếu không chắc, hãy nói rõ.
7. Nếu phát hiện lỗi trong code hoặc câu hỏi, giải thích nguyên nhân và cách sửa.
8. Định dạng: dùng **đậm**, danh sách gạch đầu dòng (- ), \`inline code\` khi cần. Không dùng bảng.`;

const extractText = (payload) =>
  (payload.candidates?.[0]?.content?.parts || [])
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join("");

/**
 * Gửi câu hỏi tới Gemini và nhận câu trả lời dạng stream.
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {string} opts.context  Mô tả trang / bài học hiện tại.
 * @param {{sender: string, text: string}[]} opts.history
 * @param {(text: string) => void} [opts.onChunk]  Gọi với toàn bộ văn bản đã nhận.
 * @param {AbortSignal} [opts.signal]  Hủy yêu cầu (vd: người dùng xóa hội thoại).
 * @returns {Promise<{ ok: boolean, text: string, aborted?: boolean }>}
 */
export const askAiTutor = async ({
  prompt,
  context = "EduPulse AI",
  history = [],
  onChunk,
  signal,
}) => {
  if (!isAiConfigured()) {
    return {
      ok: false,
      text: "Bạn chưa nhập VITE_GEMINI_API_KEY vào file .env. Hãy tạo API Key tại Google AI Studio (aistudio.google.com) để trò chuyện với AI Tutor nhé!",
    };
  }

  const contents = [
    ...history.slice(-HISTORY_LIMIT).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), TIMEOUT_MS);
  const onExternalAbort = () => controller.abort("user");
  signal?.addEventListener("abort", onExternalAbort);

  let text = "";
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(context) }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const payload = Array.isArray(err) ? err[0] : err;
      throw new Error(payload?.error?.message || `Lỗi API (${res.status})`);
    }

    // Đọc Server-Sent Events: mỗi sự kiện là một dòng "data: {json}".
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const chunk = extractText(JSON.parse(line.slice(5)));
        if (chunk) {
          text += chunk;
          onChunk?.(text);
        }
      }
    }

    return text
      ? { ok: true, text }
      : {
          ok: false,
          text: "AI chưa có câu trả lời phù hợp. Bạn thử hỏi lại nhé.",
        };
  } catch (error) {
    if (controller.signal.aborted && controller.signal.reason === "user") {
      return { ok: false, aborted: true, text };
    }
    const message = controller.signal.aborted
      ? "AI phản hồi quá lâu, vui lòng thử lại."
      : error.message;
    return { ok: false, text: `Lỗi kết nối AI: ${message}` };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onExternalAbort);
  }
};
