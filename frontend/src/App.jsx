import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ClerkAuthBar from "./components/ClerkAuthBar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import LearningStylePage from "./pages/LearningStylePage";
import ChatbotPage from "./pages/ChatbotPage";
import PracticePage from "./pages/PracticePage";

export default function App() {
  return (
    <div className="main-shell">
      <ClerkAuthBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/user-login" element={<Navigate to="/" replace />} />
        <Route path="/admin-login" element={<Navigate to="/" replace />} />
        <Route path="/reset-password" element={<Navigate to="/" replace />} />

        <Route
          path="/style"
          element={
            <ProtectedRoute userOnly>
              <LearningStylePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute userOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute userOnly>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute userOnly>
              <PracticePage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
