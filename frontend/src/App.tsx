import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Profile from "./components/Profile";
import Recovered from "./components/Recovered";
import ResetPassword from "./components/ResetPassword";
import GenerateOTP from "./components/GenerateOTP";
import OtpVerification from "./components/OtpVerification";
import CareerQuiz from "./components/CareerQuiz";
import CareerExplorer from "./components/CareerExplorer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useThemeStore } from "./store/useThemeStore";
import CareerDashboard from "./components/CareerDashboard";
import PracticePlayground from "./components/PracticePlayground";
import CareerLearningPage from "./components/CareerLearningPage";
import LearningHub from "./components/LearningHub";
import Hub from "./components/Hub";
import AdminDashboard from "./components/AdminDashboard";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
      />
      <Route path="/recover" element={<GenerateOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/otp-verify" element={<OtpVerification />} />
      <Route path="/recovered" element={<Recovered />} />
      <Route path="/careers" element={<CareerExplorer />} />
      <Route
        path="/quiz"
        element={isAuthenticated ? <CareerQuiz /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <CareerDashboard/> : <Navigate to="/login" />}
      />
      <Route
        path="/practice"
        element={isAuthenticated ? <PracticePlayground/> : <Navigate to="/login" />}
      />
      <Route path="/learn/:careerTitle" element={<CareerLearningPage />} />
      <Route path="/learn" element={<LearningHub />} />
      <Route path="/course/:skill" element={<Hub />} />
      <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function AppShell() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16 md:pt-20">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
