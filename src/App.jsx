import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LearningProvider } from "./context/LearningContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { StudyRoomPage } from "./pages/StudyRoomPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <LearningProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/study/:courseId" element={<StudyRoomPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LearningProvider>
  );
}
