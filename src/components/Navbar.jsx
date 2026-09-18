import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Trang Chủ", short: "Trang Chủ", path: "/" },
  { name: "Khóa Học", short: "Khóa Học", path: "/courses", also: ["/study"] },
  { name: "Tiến Độ Của Tôi", short: "Tiến Độ", path: "/dashboard" },
];

const isLinkActive = (pathname, link) => {
  if (link.path === "/") return pathname === "/";
  return [link.path, ...(link.also || [])].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
};

export const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="EduPulse AI - Trang chủ"
        >
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            E
          </span>
          <div className="hidden sm:block">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              EduPulse
            </span>
            <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              AI
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3 min-w-0">
          <nav className="flex items-center gap-0.5 sm:gap-2 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = isLinkActive(pathname, link);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span className="sm:hidden">{link.short}</span>
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
