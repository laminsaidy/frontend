import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import ScrollToTop from "./utils/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages
const Homepage = lazy(() => import("./pages/Homepage"));
const Loginpage = lazy(() => import("./pages/Loginpage"));
const Registerpage = lazy(() => import("./pages/Registerpage"));
const TaskManager = lazy(() => import("./pages/TaskManager"));
const TaskDetail = lazy(() => import("./pages/TaskDetail"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <div className="app-content">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner fullPage />}>
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
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;