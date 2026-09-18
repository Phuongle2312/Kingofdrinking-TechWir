import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Bot,
  ListChecks,
  ChartColumn,
  ArrowRight,
} from "lucide-react";
import { useLearning, useTutorContext } from "../context/useLearning";
import { CourseCard } from "../components/CourseCard";

const FEATURED_LIMIT = 3;
const numberFormat = new Intl.NumberFormat("vi-VN");

const features = [
  {
    icon: Bot,
    title: "AI Tutor theo ngữ cảnh",
    desc: "Gia sư AI biết bạn đang học bài nào, giải thích và đưa ví dụ code ngay trong phòng học.",
    color: "text-blue-600 dark:text-blue-400 bg-blue-50",
    action: "chat",
    cta: "Trò chuyện ngay",
  },
  {
    icon: ListChecks,
    title: "Mini-quiz có giải thích",
    desc: "Kiểm tra nhanh sau mỗi khóa, chấm điểm tức thì kèm đáp án và giải thích chi tiết.",
    color: "text-amber-600 dark:text-amber-400 bg-amber-50",
    to: "/courses",
    cta: "Chọn khóa học",
  },
  {
    icon: ChartColumn,
    title: "Theo dõi tiến độ",
    desc: "Xem số bài đã học, phần trăm hoàn thành và điểm quiz của từng khóa trong một bảng.",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50",
    to: "/dashboard",
    cta: "Xem tiến độ",
  },
];

export const HomePage = () => {
  const { courses, setChatOpen } = useLearning();
  useTutorContext("Trang chủ");

  const featured = [...courses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, FEATURED_LIMIT);
  const stats = [
    { value: courses.length, label: "Khóa học" },
    {
      value: numberFormat.format(
        courses.reduce((acc, c) => acc + c.lessons.length, 0),
      ),
      label: "Bài học video",
    },
    {
      value: `${numberFormat.format(courses.reduce((acc, c) => acc + c.studentsCount, 0))}+`,
      label: "Học viên",
    },
    { value: "24/7", label: "AI Tutor hỗ trợ" },
  ];

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-slate-200/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-slate-50" />
          <div className="absolute -top-24 left-1/2 -translate-x-[70%] w-[36rem] h-[36rem] rounded-full bg-blue-400/25 blur-3xl" />
          <div className="absolute -top-10 left-1/2 translate-x-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(100_116_139/0.18)_1px,transparent_0)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-20 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            FPT Techwir: Web Innovation Unleashed
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Nền Tảng Học Công Nghệ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Được Trợ Lực Bởi AI
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Học tập chủ động với lộ trình khóa học thực chiến, tích hợp Trợ lý
            Gia Sư AI Tutor trực tiếp hỗ trợ giải đáp thắc mắc 24/7.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition"
            >
              Khám Phá Khóa Học
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-surface border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
            >
              Xem Tiến Độ Của Tôi
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-surface/70 backdrop-blur border border-slate-200 px-4 py-4 shadow-sm"
              >
                <dt className="text-xs sm:text-sm text-slate-500">{s.label}</dt>
                <dd className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Mọi thứ bạn cần để tự học hiệu quả, ngay trên trình duyệt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, ...f }) => {
            const inner = (
              <>
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-4">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1.5 flex-1">
                  {f.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mt-4">
                  {f.cta}
                  <ArrowRight
                    className="w-4 h-4 motion-safe:group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </>
            );
            const cls =
              "group text-left flex flex-col bg-surface rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 motion-safe:hover:-translate-y-1 transition duration-300";
            return f.action === "chat" ? (
              <button
                key={f.title}
                onClick={() => setChatOpen(true)}
                className={cls}
              >
                {inner}
              </button>
            ) : (
              <Link key={f.title} to={f.to} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Khóa Học Tiêu Biểu
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Được chọn lọc theo xu hướng công nghệ mới nhất
            </p>
          </div>
          {courses.length > FEATURED_LIMIT && (
            <Link
              to="/courses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};
