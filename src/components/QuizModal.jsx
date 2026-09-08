import React, { useState } from "react";
import { useLearning } from "../context/LearningContext";

export const QuizModal = ({ courseId, questions, onClose }) => {
  const { saveQuizResult } = useLearning();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionIdx) => {
    setSelectedOptions((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedOptions[idx] === q.correctAnswer) score += 1;
      });
      saveQuizResult(courseId, score, questions.length);
      setIsFinished(true);
    }
  };

  const q = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
        >
          ✕
        </button>

        {!isFinished ? (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <span>Trắc Nghiệm Ôn Tập</span>
              <span>
                Câu {currentIdx + 1}/{questions.length}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-4">
              {q.question}
            </h3>
            <div className="space-y-2 mb-6">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition ${
                    selectedOptions[currentIdx] === optIdx
                      ? "border-blue-600 bg-blue-50 font-medium text-blue-800"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="font-bold mr-2">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>{" "}
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                disabled={selectedOptions[currentIdx] === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {currentIdx === questions.length - 1
                  ? "Nộp bài & Xem điểm"
                  : "Câu tiếp theo →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Đã Hoàn Thành Bài Kiểm Tra!
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Điểm số đã được lưu vào bảng tiến độ cá nhân của bạn.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
            >
              Quay Lại Bài Học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
