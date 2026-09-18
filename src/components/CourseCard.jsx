import React from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../context/useLearning";

export const CourseCard = ({ course }) => {
  const { enrolledIds, enrollCourse } = useLearning();
  const isEnrolled = enrolledIds.includes(course.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
          {course.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>
              ⭐ {course.rating} ({course.studentsCount} học viên)
            </span>
            <span>📶 {course.level}</span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-2 mb-2">
            {course.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {course.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-slate-500">
            {course.lessons.length} bài học
          </span>
          {isEnrolled ? (
            <Link
              to={`/study/${course.id}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Vào Học Tiếp →
            </Link>
          ) : (
            <button
              onClick={() => enrollCourse(course.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Đăng Ký Học
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
