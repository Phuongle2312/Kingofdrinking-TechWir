import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Trophy,
  RotateCcw,
  Check,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLearning } from "../context/useLearning";

export const QuizModal = ({ courseId, questions, onClose }) => {
  const { saveQuizResult } = useLearning();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(null);
  const dialogRef = useRef(null);

  const isFinished = score !== null;
  const total = questions.length;
  const passed = isFinished && score >= Math.ceil(total * 0.6);

  // Giữ onClose mới nhất trong ref để effect chỉ chạy một lần khi mở modal.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSelect = (optionIdx) => {
    setSelectedOptions((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((prev) => prev + 1);
      return;
    }
    const result = questions.reduce(
      (acc, q, idx) => acc + (selectedOptions[idx] === q.correctAnswer ? 1 : 0),
      0,
    );
    saveQuizResult(courseId, result, total);
    setScore(result);
  };

  const handleRetry = () => {
    setSelectedOptions({});
    setCurrentIdx(0);
    setScore(null);
  };

  const q = questions[currentIdx];

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        tabIndex={-1}
        className="bg-surface rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-6 shadow-2xl relative focus:outline-none"
      >
        <button
          onClick={onClose}
          aria-label="Đóng bài kiểm tra"
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 pr-8">
              <span id="quiz-title">Trắc Nghiệm Ôn Tập</span>
              <span>
                Câu {currentIdx + 1}/{total}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 transition-all"
                style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
              />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-4 whitespace-pre-line">
              {q.question}
            </h3>
            <div className="space-y-2 mb-6" role="radiogroup">
              {q.options.map((opt, optIdx) => {
                const selected = selectedOptions[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 font-medium text-blue-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between gap-3">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-sm font-semibold transition"
              >
                <ChevronLeft className="w-4 h-4 inline -mt-0.5" /> Câu trước
              </button>
              <button
                disabled={selectedOptions[currentIdx] === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {currentIdx === total - 1 ? (
                  "Nộp bài & Xem điểm"
                ) : (
                  <>
                    Câu tiếp theo{" "}
                    <ChevronRight className="w-4 h-4 inline -mt-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center py-2">
              <div
                className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  passed
                    ? "bg-emerald-100 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-600 dark:text-amber-400"
                }`}
              >
                {passed ? (
                  <Trophy className="w-8 h-8" />
                ) : (
                  <RotateCcw className="w-8 h-8" />
                )}
              </div>
              <h3
                id="quiz-title"
                className="text-xl font-bold text-slate-900 mb-1"
              >
                {passed ? "Chúc mừng, bạn đã đạt!" : "Chưa đạt, cố lên nhé!"}
              </h3>
              <p className="text-3xl font-extrabold mt-2 mb-1 text-blue-600 dark:text-blue-400">
                {score}/{total}
              </p>
              <p className="text-xs text-slate-500 mb-5">
                Cần đúng tối thiểu {Math.ceil(total * 0.6)}/{total} câu để đạt.
                Điểm cao nhất được lưu vào bảng tiến độ.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {questions.map((item, idx) => {
                const correct = selectedOptions[idx] === item.correctAnswer;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-sm ${
                      correct
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-rose-200 bg-rose-50"
                    }`}
                  >
                    <p className="font-semibold text-slate-900 whitespace-pre-line flex gap-1.5">
                      {correct ? (
                        <Check
                          className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-label="Đúng"
                        />
                      ) : (
                        <X
                          className="w-4 h-4 mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
                          aria-label="Sai"
                        />
                      )}
                      <span>
                        Câu {idx + 1}: {item.question}
                      </span>
                    </p>
                    {!correct && (
                      <p className="text-rose-700 mt-1">
                        Bạn chọn: {item.options[selectedOptions[idx]]}
                      </p>
                    )}
                    <p className="text-emerald-700 mt-1">
                      Đáp án: {item.options[item.correctAnswer]}
                    </p>
                    {item.explanation && (
                      <p className="text-slate-600 mt-1 flex gap-1.5">
                        <Lightbulb
                          className="w-4 h-4 mt-0.5 shrink-0 text-amber-500"
                          aria-hidden="true"
                        />
                        <span>{item.explanation}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition"
              >
                Làm Lại
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
              >
                Quay Lại Bài Học
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
