import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import TaskManager from "./pages/TaskManager";
import TaskDetail from "./pages/TaskDetail";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./utils/ScrollToTop";
console.log("APP MOUNTED - REACT IS WORKING");


function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <div className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="/task/:id" element={<TaskDetail />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;