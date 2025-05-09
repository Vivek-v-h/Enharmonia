import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login_Signup from "./pages/Login_Signup";
import PrivateRoute from "./components/PrivateRoute"; // If needed for future routes
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import PostAd from "./pages/Postad";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login-signup" element={<Login_Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/post-ad" element={<PostAd/>}/>
        {/* Example Protected Route (for later) */}
        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
