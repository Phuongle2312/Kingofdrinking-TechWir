import React, { useState, useRef, useEffect } from "react";
import { askAiTutor } from "../services/geminiService";
import { MessageCircle, X, LoaderCircle, SendHorizontal } from "lucide-react";
import { useLearning } from "../context/useLearning";

const quickPrompts = [
  "Giải thích bài này ngắn gọn?",
  "Cho ví dụ code minh họa?",
  "Tóm tắt 3 lưu ý quan trọng?",
];

// Render markdown tối giản: khối ```code```, `inline code` và **đậm**.
const renderInline = (text, keyPrefix) =>
  text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="px-1 py-0.5 rounded bg-slate-100 text-rose-600 text-[12px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });

const MessageText = ({ text }) => {
  const segments = text.split(/```[\w-]*\n?([\s\S]*?)```/g);
  return segments.map((seg, i) =>
    i % 2 === 1 ? (
      <pre
        key={i}
        className="my-2 p-3 rounded-lg bg-gray-950 text-gray-100 text-[12px] font-mono overflow-x-auto whitespace-pre"
      >
        <code>{seg.replace(/\n$/, "")}</code>
      </pre>
    ) : (
      <span key={i}>{renderInline(seg, i)}</span>
    ),
  );
};

export const ChatWidget = () => {
  const {
    tutorContext,
    chatOpen: isOpen,
    setChatOpen: setIsOpen,
  } = useLearning();
  const { topic, lesson } = tutorContext;
  const contextLabel = lesson || topic;

  // sender: "user" | "ai" | "note". Tin "note" và tin lỗi không gửi lên AI.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastLabelRef = useRef(contextLabel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Đánh dấu khi người dùng chuyển sang bài học khác giữa cuộc trò chuyện.
  useEffect(() => {
    if (lastLabelRef.current === contextLabel) return;
    lastLabelRef.current = contextLabel;
    setMessages((prev) =>
      prev.length === 0
        ? prev
        : [
            ...prev,
            { sender: "note", text: `Đã chuyển sang: ${contextLabel}` },
          ],
    );
  }, [contextLabel]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || loading) return;

    const history = messages.filter(
      (m) => (m.sender === "user" || m.sender === "ai") && !m.error,
    );
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    const context = lesson ? `${topic} - Bài học: ${lesson}` : topic;
    const { ok, text } = await askAiTutor(userText, context, history);

    setMessages((prev) => [...prev, { sender: "ai", text, error: !ok }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label="Trò chuyện với EduPulse AI Tutor"
          className="w-[calc(100vw-2rem)] sm:w-96 h-[min(520px,calc(100dvh-7rem))] bg-surface rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm">EduPulse AI Tutor</h3>
                <p className="text-[11px] text-white/80 truncate">
                  {contextLabel}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng khung chat"
              className="text-white hover:bg-white/20 p-1.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 py-2 bg-slate-100 flex gap-1.5 overflow-x-auto border-b border-slate-200">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                onClick={() => {
                  setInput(qp);
                  inputRef.current?.focus();
                }}
                className="whitespace-nowrap px-2.5 py-1 bg-surface hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full text-[11px] font-medium border border-slate-200 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm"
            aria-live="polite"
          >
            <div className="p-3 rounded-2xl max-w-[85%] mr-auto bg-surface border border-slate-200 text-slate-800 rounded-tl-none shadow-sm text-[13px] leading-relaxed">
              👋 Chào bạn! Tôi là Trợ Lý Gia Sư AI. Bạn đang ở: "{contextLabel}
              ". Cần tôi giải thích đoạn code nào hoặc tóm tắt kiến thức không?
            </div>

            {messages.map((m, idx) =>
              m.sender === "note" ? (
                <div
                  key={idx}
                  className="text-center text-[11px] text-slate-400"
                >
                  — {m.text} —
                </div>
              ) : (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap break-words leading-relaxed text-[13px] ${
                    m.sender === "user"
                      ? "ml-auto bg-blue-600 text-white rounded-tr-none"
                      : m.error
                        ? "mr-auto bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none"
                        : "mr-auto bg-surface border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {m.sender === "user" ? m.text : <MessageText text={m.text} />}
                </div>
              ),
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <LoaderCircle className="w-4 h-4 animate-spin" /> AI đang suy
                nghĩ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 bg-surface flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi AI Tutor điều gì đó..."
              aria-label="Nội dung câu hỏi"
              className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gửi câu hỏi"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Đóng AI Tutor" : "Mở AI Tutor"}
        aria-expanded={isOpen}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
