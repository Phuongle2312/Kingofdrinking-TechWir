import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  LoaderCircle,
  SendHorizontal,
  Square,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { askAiTutor } from "../services/geminiService";
import { useLearning } from "../context/useLearning";
import { ChatMarkdown } from "./ChatMarkdown";

const STORAGE_KEY = "edupulse_chat_messages";
const MAX_SAVED = 40;

const quickPrompts = [
  "Giải thích bài này ngắn gọn?",
  "Cho ví dụ code minh họa?",
  "Tóm tắt 3 lưu ý quan trọng?",
];

let nextId = 0;
const newId = () => `${Date.now()}-${nextId++}`;

const loadMessages = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

// Chỉ gửi lên AI các tin hợp lệ: không phải ghi chú, lỗi hay tin đang stream.
const toHistory = (messages) =>
  messages.filter(
    (m) =>
      (m.sender === "user" || m.sender === "ai") &&
      !m.error &&
      !m.streaming &&
      m.text,
  );

export const ChatWidget = () => {
  const {
    tutorContext,
    chatOpen: isOpen,
    setChatOpen: setIsOpen,
  } = useLearning();
  const { topic, lesson } = tutorContext;
  const contextLabel = lesson || topic;

  // sender: "user" | "ai" | "note".
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const lastLabelRef = useRef(contextLabel);

  useEffect(() => {
    try {
      const done = messages.filter((m) => !m.streaming).slice(-MAX_SAVED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // Không lưu được thì lịch sử chỉ tồn tại trong phiên.
    }
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, isOpen]);

  // Đánh dấu khi người dùng chuyển sang trang / bài học khác giữa cuộc trò chuyện.
  useEffect(() => {
    if (lastLabelRef.current === contextLabel) return;
    lastLabelRef.current = contextLabel;
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const note = {
        id: newId(),
        sender: "note",
        text: `Đã chuyển sang: ${contextLabel}`,
      };
      // Chuyển trang liên tiếp thì chỉ giữ ghi chú mới nhất.
      const base =
        prev[prev.length - 1].sender === "note" ? prev.slice(0, -1) : prev;
      return [...base, note];
    });
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

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateMessage = (id, patch) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  const ask = async (prompt, history) => {
    const aiId = newId();
    const controller = new AbortController();
    abortRef.current = controller;
    setMessages((prev) => [
      ...prev,
      { id: aiId, sender: "ai", text: "", streaming: true },
    ]);
    setLoading(true);

    const context = lesson
      ? `phòng học, khóa "${topic}", bài "${lesson}"`
      : `trang "${topic}" của nền tảng`;
    const result = await askAiTutor({
      prompt,
      context,
      history,
      signal: controller.signal,
      onChunk: (text) => updateMessage(aiId, { text }),
    });

    if (result.aborted) {
      // Người dùng bấm dừng: giữ phần đã nhận, bỏ tin trống.
      setMessages((prev) =>
        result.text
          ? prev.map((m) =>
              m.id === aiId ? { ...m, text: result.text, streaming: false } : m,
            )
          : prev.filter((m) => m.id !== aiId),
      );
    } else if (result.ok) {
      updateMessage(aiId, { text: result.text, streaming: false });
    } else {
      updateMessage(aiId, {
        text: result.text,
        streaming: false,
        error: true,
        prompt,
      });
    }
    if (abortRef.current === controller) abortRef.current = null;
    setLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;
    const history = toHistory(messages);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: newId(), sender: "user", text: prompt },
    ]);
    ask(prompt, history);
  };

  const handleRetry = (errorMsg) => {
    if (loading) return;
    const idx = messages.findIndex((m) => m.id === errorMsg.id);
    // Lịch sử là mọi tin trước câu hỏi đã gặp lỗi.
    const history = toHistory(messages.slice(0, Math.max(0, idx - 1)));
    setMessages((prev) => prev.filter((m) => m.id !== errorMsg.id));
    ask(errorMsg.prompt, history);
  };

  const handleStop = () => abortRef.current?.abort();

  const handleClear = () => {
    abortRef.current?.abort();
    setMessages([]);
    inputRef.current?.focus();
  };

  const waitingFirstChunk =
    loading && messages[messages.length - 1]?.text === "";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label="Trò chuyện với EduPulse AI Tutor"
          className="w-[calc(100vw-2rem)] sm:w-[26rem] h-[min(580px,calc(100dvh-7rem))] bg-surface rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-sm">EduPulse AI Tutor</h3>
                <p className="text-[11px] text-white/80 truncate">
                  {contextLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleClear}
                disabled={messages.length === 0}
                aria-label="Xóa hội thoại"
                title="Xóa hội thoại"
                className="text-white hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-transparent p-1.5 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Đóng khung chat"
                title="Đóng"
                className="text-white hover:bg-white/20 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-100 flex flex-wrap gap-1.5 border-b border-slate-200">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                onClick={() => {
                  setInput(qp);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 bg-surface hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-full text-[11px] font-medium border border-slate-200 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm scrollbar-thin"
            aria-live="polite"
          >
            <div className="p-3 rounded-2xl max-w-[88%] mr-auto bg-surface border border-slate-200 text-slate-800 rounded-tl-none shadow-sm text-[13px] leading-relaxed">
              {`👋 Chào bạn! Tôi là Trợ Lý Gia Sư AI. Bạn đang ở: "${contextLabel}". Cần tôi giải thích đoạn code nào hoặc tóm tắt kiến thức không?`}
            </div>

            {messages.map((m) => {
              if (m.sender === "note") {
                return (
                  <div
                    key={m.id}
                    className="text-center text-[11px] text-slate-400"
                  >
                    — {m.text} —
                  </div>
                );
              }
              if (m.sender === "user") {
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl max-w-[88%] ml-auto bg-blue-600 text-white rounded-tr-none whitespace-pre-wrap break-words leading-relaxed text-[13px]"
                  >
                    {m.text}
                  </div>
                );
              }
              if (m.streaming && !m.text) return null;
              if (m.error) {
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl max-w-[88%] mr-auto bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none text-[13px] leading-relaxed"
                  >
                    <p className="break-words">⚠️ {m.text}</p>
                    {m.prompt && (
                      <button
                        onClick={() => handleRetry(m)}
                        disabled={loading}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-amber-200 text-amber-900 hover:bg-amber-50 disabled:opacity-50 text-xs font-semibold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Thử lại
                      </button>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl max-w-[88%] mr-auto bg-surface border border-slate-200 text-slate-800 rounded-tl-none shadow-sm text-[13px] leading-relaxed break-words min-w-0"
                >
                  <ChatMarkdown text={m.text} />
                  {m.streaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-blue-500 animate-pulse" />
                  )}
                </div>
              );
            })}
            {waitingFirstChunk && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <LoaderCircle className="w-4 h-4 animate-spin" /> AI đang suy
                nghĩ...
              </div>
            )}
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
              className="flex-1 min-w-0 px-3 py-2 bg-surface border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Dừng trả lời"
                title="Dừng"
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-surface rounded-xl transition"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Gửi câu hỏi"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            )}
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
