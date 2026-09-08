import React from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../context/LearningContext";
import { CourseCard } from "../components/CourseCard";
import { ChatWidget } from "../components/ChatWidget";

export const HomePage = () => {
  const { courses } = useLearning();

  return (
    <div>
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-6">
            🚀 FPT Techwir: Web Innovation Unleashed
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Nền Tảng Học Công Nghệ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Được Trợ Lực Bởi AI
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Học tập chủ động với lộ trình khóa học thực chiến, tích hợp Trợ lý
            Gia Sư AI Tutor trực tiếp hỗ trợ giải đáp thắc mắc 24/7.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition"
            >
              Khám Phá Khóa Học
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              Xem Tiến Độ Của Tôi
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Khóa Học Tiêu Biểu
            </h2>
            <p className="text-sm text-slate-500">
              Được chọn lọc theo xu hướng công nghệ mới nhất
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <ChatWidget currentTopic="Tổng quan hệ thống" />
    </div>
  );
};
