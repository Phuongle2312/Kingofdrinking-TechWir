import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLearning } from "../context/LearningContext";
import { QUIZ_DATABASE } from "../data/quizData";
import { QuizModal } from "../components/QuizModal";
import { ChatWidget } from "../components/ChatWidget";

export const StudyRoomPage = () => {
  const { courseId } = useParams();
  const { courses, completedLessons, toggleCompleteLesson } = useLearning();

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const activeLesson = course.lessons[activeLessonIdx];
  const isCompleted = completedLessons.includes(activeLesson.id);
  const quizQuestions = QUIZ_DATABASE[course.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/courses" className="hover:underline">
          Khóa học
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Giảng viên: {course.instructor}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleCompleteLesson(activeLesson.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isCompleted ? "✓ Đã Hoàn Thành" : "Đánh Dấu Hoàn Thành"}
              </button>

              {quizQuestions && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition"
                >
                  📝 Làm Mini-Quiz
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              📌 Ghi Chú Trọng Tâm:
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {activeLesson.notes}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 text-base mb-4">
            Danh Sách Bài Học
          </h3>
          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const active = idx === activeLessonIdx;
              const finished = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-200 text-slate-700 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  {finished && (
                    <span className="text-emerald-600 font-bold ml-2">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showQuiz && quizQuestions && (
        <QuizModal
          courseId={course.id}
          questions={quizQuestions}
          onClose={() => setShowQuiz(false)}
        />
      )}

      <ChatWidget
        currentTopic={course.title}
        currentLesson={activeLesson.title}
      />
    </div>
  );
};
