import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Check,
  ClipboardList,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLearning, useTutorContext } from "../context/useLearning";
import { QUIZ_DATABASE } from "../data/quizData";
import { QuizModal } from "../components/QuizModal";
import { NotFoundPage } from "./NotFoundPage";

export const StudyRoomPage = () => {
  const { courseId } = useParams();
  const { courses, enrolledIds } = useLearning();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <NotFoundPage
        title="Không tìm thấy khóa học"
        message="Khóa học này không tồn tại. Hãy chọn một khóa học khác trong thư viện."
      />
    );
  }

  if (!enrolledIds.includes(course.id)) {
    return <EnrollGate course={course} />;
  }

  // key giúp reset bài học đang chọn khi chuyển sang khóa khác.
  return <StudyRoom key={course.id} course={course} />;
};

const EnrollGate = ({ course }) => {
  const { enrollCourse } = useLearning();
  useTutorContext(course.title);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm"
      />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h1>
      <p className="text-slate-600 text-sm mb-6">
        Bạn cần đăng ký khóa học này trước khi vào phòng học. Khóa học gồm{" "}
        {course.lessons.length} bài học, do {course.instructor} hướng dẫn.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => enrollCourse(course.id)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          Đăng Ký & Vào Học
        </button>
        <Link
          to="/courses"
          className="px-5 py-2.5 rounded-xl bg-surface border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
        >
          Xem Khóa Khác
        </Link>
      </div>
    </div>
  );
};

const StudyRoom = ({ course }) => {
  const { completedLessons, toggleCompleteLesson } = useLearning();

  // Mở bài đầu tiên chưa hoàn thành.
  const [activeLessonIdx, setActiveLessonIdx] = useState(() => {
    const idx = course.lessons.findIndex(
      (l) => !completedLessons.includes(l.id),
    );
    return idx === -1 ? 0 : idx;
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const closeQuiz = useCallback(() => setShowQuiz(false), []);

  const activeLesson = course.lessons[activeLessonIdx];
  const isCompleted = completedLessons.includes(activeLesson.id);
  const quizQuestions = QUIZ_DATABASE[course.id];
  const lessonCount = course.lessons.length;
  const finishedCount = course.lessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;
  const percent = Math.round((finishedCount / lessonCount) * 100);
  const hasPrev = activeLessonIdx > 0;
  const hasNext = activeLessonIdx < lessonCount - 1;

  useTutorContext(course.title, activeLesson.title);

  const goTo = (idx) => {
    setActiveLessonIdx(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-slate-500 mb-6 min-w-0"
      >
        <Link to="/courses" className="hover:underline shrink-0">
          Khóa học
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate">
          {course.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              key={activeLesson.id}
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Giảng viên: {course.instructor}
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                onClick={() => toggleCompleteLesson(activeLesson.id)}
                aria-pressed={isCompleted}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4" /> Đã Hoàn Thành
                  </>
                ) : (
                  "Đánh Dấu Hoàn Thành"
                )}
              </button>

              {quizQuestions && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Làm Mini-Quiz
                </button>
              )}
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <StickyNote
                className="w-4 h-4 text-amber-500"
                aria-hidden="true"
              />{" "}
              Ghi Chú Trọng Tâm
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {activeLesson.notes}
            </p>
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={() => goTo(activeLessonIdx - 1)}
              disabled={!hasPrev}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-surface text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Bài trước
            </button>
            <button
              onClick={() => goTo(activeLessonIdx + 1)}
              disabled={!hasNext}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1"
            >
              Bài tiếp theo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <aside className="bg-surface p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Danh Sách Bài Học
          </h3>
          <p className="text-xs text-slate-500 mb-2">
            Hoàn thành {finishedCount}/{lessonCount} bài ({percent}%)
          </p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const active = idx === activeLessonIdx;
              const finished = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => goTo(idx)}
                  aria-current={active ? "step" : undefined}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] ${
                        finished
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  {finished && (
                    <span
                      className="text-emerald-600 dark:text-emerald-400 font-bold ml-2"
                      aria-label="Đã hoàn thành"
                    >
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {showQuiz && quizQuestions && (
        <QuizModal
          courseId={course.id}
          questions={quizQuestions}
          onClose={closeQuiz}
        />
      )}
    </div>
  );
};
