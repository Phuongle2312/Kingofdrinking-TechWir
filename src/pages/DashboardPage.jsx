import React from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../context/LearningContext";

export const DashboardPage = () => {
  const { courses, enrolledIds, completedLessons, quizScores } = useLearning();

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));
  const totalLessons = courses.reduce(
    (acc, cur) => acc + cur.lessons.length,
    0,
  );
  const completionPercentage =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
          Bảng Tiến Độ Học Tập
        </h1>
        <p className="text-slate-600 text-sm">
          Theo dõi tiến độ bài học và kết quả kiểm tra tự động của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Khóa Đang Học
          </span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {enrolledCourses.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Bài Học Hoàn Thành
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {completedLessons.length} / {totalLessons}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Tổng Tiến Độ
          </span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">
            {completionPercentage}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Các Khóa Học Của Bạn
        </h2>
        {enrolledCourses.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Bạn chưa đăng ký khóa học nào.
          </p>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((c) => {
              const finishedInCourse = c.lessons.filter((l) =>
                completedLessons.includes(l.id),
              ).length;
              const percent = Math.round(
                (finishedInCourse / c.lessons.length) * 100,
              );
              const testScore = quizScores[c.id];

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>
                        Đã học {finishedInCourse}/{c.lessons.length} bài (
                        {percent}%)
                      </span>
                      {testScore && (
                        <span className="font-semibold text-emerald-700">
                          🎯 Test: {testScore.score}/{testScore.total} điểm
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/study/${c.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition whitespace-nowrap"
                  >
                    Vào Học →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
