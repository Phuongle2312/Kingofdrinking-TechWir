import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "edupulse_theme";

// Theme ban đầu đã được áp dụng bởi script trong index.html.
export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Không lưu được thì chỉ áp dụng trong phiên hiện tại.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
      className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
