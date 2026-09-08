import React, { useState, useRef, useEffect } from "react";
import { askAiTutor } from "../services/geminiService";

export const ChatWidget = ({
  currentTopic = "Lập trình web",
  currentLesson = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Chào bạn! Tôi là Trợ Lý Gia Sư AI. Bạn đang học bài: "${currentLesson || currentTopic}". Cần tôi giải thích đoạn code nào hoặc tóm tắt kiến thức không?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    const context = `${currentTopic} - Bài học: ${currentLesson}`;
    const aiResponse = await askAiTutor(userText, context, messages);

    setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    setLoading(false);
  };

  const quickPrompts = [
    "Giải thích bài này ngắn gọn?",
    "Cho ví dụ code minh họa?",
    "Tóm tắt 3 lưu ý quan trọng?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">EduPulse AI Tutor</h3>
                <p className="text-[11px] text-blue-100 truncate max-w-[200px]">
                  {currentLesson || currentTopic}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-lg text-sm"
            >
              ✕
            </button>
          </div>

          <div className="px-3 py-2 bg-slate-100 flex gap-1.5 overflow-x-auto border-b border-slate-200">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => setInput(qp)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full text-[11px] font-medium border border-slate-200 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-600 text-white rounded-tr-none text-[13px]"
                    : "mr-auto bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm text-[13px]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <span className="animate-spin text-sm">⏳</span> AI đang suy
                nghĩ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi AI Tutor điều gì đó..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform text-2xl"
      >
        💬
      </button>
    </div>
  );
};
