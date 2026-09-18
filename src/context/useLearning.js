import { createContext, useContext, useEffect } from "react";

export const LearningContext = createContext(null);

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) {
    throw new Error("useLearning phải được dùng bên trong <LearningProvider>");
  }
  return ctx;
};

// Cho ChatWidget biết người dùng đang học chủ đề / bài học nào.
export const useTutorContext = (topic, lesson = "") => {
  const { setTutorContext } = useLearning();
  useEffect(() => {
    setTutorContext({ topic, lesson });
  }, [topic, lesson, setTutorContext]);
};
