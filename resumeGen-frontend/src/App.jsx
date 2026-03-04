import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
}
