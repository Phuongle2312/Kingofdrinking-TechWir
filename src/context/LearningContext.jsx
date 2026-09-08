import React, { createContext, useContext, useState, useEffect } from "react";
import { COURSES_DATA } from "../data/coursesData";

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [courses] = useState(COURSES_DATA);

  const [enrolledIds, setEnrolledIds] = useState(() => {
    try {
      const saved = localStorage.getItem("edupulse_enrolled");
      return saved ? JSON.parse(saved) : ["fe-modern-101"];
    } catch {
      return ["fe-modern-101"];
    }
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem("edupulse_completed_lessons");
      return saved ? JSON.parse(saved) : ["les-1"];
    } catch {
      return ["les-1"];
    }
  });

  const [quizScores, setQuizScores] = useState(() => {
    try {
      const saved = localStorage.getItem("edupulse_quiz_scores");
      return saved
        ? JSON.parse(saved)
        : { "fe-modern-101": { score: 3, total: 3, passed: true } };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("edupulse_enrolled", JSON.stringify(enrolledIds));
  }, [enrolledIds]);

  useEffect(() => {
    localStorage.setItem(
      "edupulse_completed_lessons",
      JSON.stringify(completedLessons),
    );
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("edupulse_quiz_scores", JSON.stringify(quizScores));
  }, [quizScores]);

  const enrollCourse = (courseId) => {
    if (!enrolledIds.includes(courseId)) {
      setEnrolledIds((prev) => [...prev, courseId]);
    }
  };

  const toggleCompleteLesson = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
  };

  const saveQuizResult = (courseId, score, total) => {
    setQuizScores((prev) => ({
      ...prev,
      [courseId]: {
        score,
        total,
        passed: score >= Math.ceil(total * 0.6),
        date: new Date().toLocaleDateString("vi-VN"),
      },
    }));
  };

  return (
    <LearningContext.Provider
      value={{
        courses,
        enrolledIds,
        completedLessons,
        quizScores,
        enrollCourse,
        toggleCompleteLesson,
        saveQuizResult,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => useContext(LearningContext);
