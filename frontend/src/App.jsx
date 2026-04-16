import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ChatbotPage from "./pages/ChatbotPage";
import PracticePage from "./pages/PracticePage";
import LearningStylePage from "./pages/LearningStylePage";
import TasksPage from "./pages/TasksPage";
import RewardsPage from "./pages/RewardsPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/user-login" element={<Navigate to="/" replace />} />
      <Route path="/admin-login" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<Navigate to="/" replace />} />

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
        path="/tasks"
        element={
          <ProtectedRoute userOnly>
            <TasksPage />
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
      <Route
        path="/rewards"
        element={
          <ProtectedRoute userOnly>
            <RewardsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/style"
        element={
          <ProtectedRoute userOnly>
            <LearningStylePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute userOnly>
            <ContactPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
