import React from "react";
import { Link } from "react-router-dom";
import { useTutorContext } from "../context/useLearning";

export const NotFoundPage = ({
  title = "Không tìm thấy trang",
  message = "Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.",
}) => {
  useTutorContext("Tổng quan hệ thống");

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-600 text-sm mb-8">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          Về Trang Chủ
        </Link>
        <Link
          to="/courses"
          className="px-5 py-2.5 rounded-xl bg-surface border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
        >
          Xem Khóa Học
        </Link>
      </div>
    </div>
  );
};
