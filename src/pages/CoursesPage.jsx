import React, { useState } from "react";
import { useLearning } from "../context/LearningContext";
import { CourseCard } from "../components/CourseCard";
import { ChatWidget } from "../components/ChatWidget";

export const CoursesPage = () => {
  const { courses } = useLearning();
  const [filter, setFilter] = useState("All");
  const categories = [
    "All",
    "Frontend Development",
    "AI & Innovation",
    "Core JavaScript",
  ];

  const filteredCourses =
    filter === "All" ? courses : courses.filter((c) => c.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Thư Viện Khóa Học
        </h1>
        <p className="text-slate-600 text-sm">
          Nâng cao kỹ năng lập trình web hiện đại và tích hợp trí tuệ nhân tạo.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat === "All" ? "Tất Cả" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <ChatWidget currentTopic="Tư vấn khóa học" />
    </div>
  );
};
