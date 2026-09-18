import React from "react";
import { Link } from "react-router-dom";
import { Star, Users, Signal, BookOpen, ArrowRight } from "lucide-react";
import { useLearning } from "../context/useLearning";

const numberFormat = new Intl.NumberFormat("vi-VN");

const getAction = (percent) => {
  if (percent === 100)
    return { label: "Ôn Tập", style: "bg-emerald-600 hover:bg-emerald-700" };
  if (percent > 0)
    return { label: "Học Tiếp", style: "bg-emerald-600 hover:bg-emerald-700" };
  return { label: "Bắt Đầu Học", style: "bg-blue-600 hover:bg-blue-700" };
};

export const CourseCard = ({ course }) => {
  const { enrolledIds, enrollCourse, completedLessons } = useLearning();
  const isEnrolled = enrolledIds.includes(course.id);
  const lessonCount = course.lessons.length;
  const finished = course.lessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;
  const percent =
    lessonCount > 0 ? Math.round((finished / lessonCount) * 100) : 0;
  const action = getAction(percent);

  return (
    <article className="group bg-surface rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 motion-safe:hover:-translate-y-1 transition duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
          {course.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px] text-slate-600 mb-2">
            <span className="flex items-center gap-1.5">
              <Star
                className="w-4 h-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              <span className="font-semibold text-slate-800">
                {course.rating}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                {numberFormat.format(course.studentsCount)} học viên
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Signal className="w-3.5 h-3.5" aria-hidden="true" />
              {course.level}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 mb-2">
            {course.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {course.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          {isEnrolled && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Tiến độ</span>
                <span className="font-semibold text-slate-700">{percent}%</span>
              </div>
              <div
                className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Tiến độ ${course.title}`}
              >
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {isEnrolled ? `${finished}/${lessonCount}` : lessonCount} bài học
            </span>
            {isEnrolled ? (
              <Link
                to={`/study/${course.id}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm font-semibold transition ${action.style}`}
              >
                {action.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <button
                onClick={() => enrollCourse(course.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Đăng Ký Học
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
