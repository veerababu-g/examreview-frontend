import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import MyExams from "./pages/MyExams.js";
import ReviewExam from "./pages/ReviewExam.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/exams" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <MyExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/:courseId"
        element={
          <ProtectedRoute>
            <ReviewExam />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/exams" replace />} />
    </Routes>
  );
}
