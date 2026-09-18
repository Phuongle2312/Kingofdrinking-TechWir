import React, { useState, useEffect, useCallback, useMemo } from "react";
import { COURSES_DATA } from "../data/coursesData";
import { LearningContext } from "./useLearning";

const STORAGE_KEYS = {
  enrolled: "edupulse_enrolled",
  completed: "edupulse_completed_lessons",
  quizzes: "edupulse_quiz_scores",
};

const loadJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Chế độ ẩn danh hoặc bộ nhớ đầy: bỏ qua, tiến độ chỉ giữ trong phiên.
  }
};

export const LearningProvider = ({ children }) => {
  const courses = COURSES_DATA;

  const [enrolledIds, setEnrolledIds] = useState(() =>
    loadJSON(STORAGE_KEYS.enrolled, []),
  );
  const [completedLessons, setCompletedLessons] = useState(() =>
    loadJSON(STORAGE_KEYS.completed, []),
  );
  const [quizScores, setQuizScores] = useState(() =>
    loadJSON(STORAGE_KEYS.quizzes, {}),
  );
  const [tutorContext, setTutorContext] = useState({
    topic: "Trang chủ",
    lesson: "",
  });
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => saveJSON(STORAGE_KEYS.enrolled, enrolledIds), [enrolledIds]);
  useEffect(
    () => saveJSON(STORAGE_KEYS.completed, completedLessons),
    [completedLessons],
  );
  useEffect(() => saveJSON(STORAGE_KEYS.quizzes, quizScores), [quizScores]);

  const enrollCourse = useCallback((courseId) => {
    setEnrolledIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId],
    );
  }, []);

  const toggleCompleteLesson = useCallback((lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
  }, []);

  // Lưu điểm cao nhất, kèm số lần làm bài.
  const saveQuizResult = useCallback((courseId, score, total) => {
    setQuizScores((prev) => {
      const old = prev[courseId];
      const attempts = (old?.attempts || 0) + 1;
      const isBetter = !old || score >= old.score;
      return {
        ...prev,
        [courseId]: isBetter
          ? {
              score,
              total,
              passed: score >= Math.ceil(total * 0.6),
              date: new Date().toLocaleDateString("vi-VN"),
              attempts,
            }
          : { ...old, attempts },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      courses,
      enrolledIds,
      completedLessons,
      quizScores,
      enrollCourse,
      toggleCompleteLesson,
      saveQuizResult,
      tutorContext,
      setTutorContext,
      chatOpen,
      setChatOpen,
    }),
    [
      courses,
      enrolledIds,
      completedLessons,
      quizScores,
      enrollCourse,
      toggleCompleteLesson,
      saveQuizResult,
      tutorContext,
      chatOpen,
    ],
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
