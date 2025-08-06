import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import TaskManager from "./pages/TaskManager";
import TaskDetail from "./pages/TaskDetail";
import ScrollToTop from "./utils/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded components
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

function App() {
  useEffect(() => {
    toast.info("🧪 Toast system is working!", { autoClose: 2000 });
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <div className="app-content">
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/register" element={<Registerpage />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route
                    path="/tasks"
                    element={
                      <PrivateRoute>
                        <TaskManager />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/task/:id"
                    element={
                      <PrivateRoute>
                        <TaskDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
          <ToastContainer />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
