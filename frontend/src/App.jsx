import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login_Signup from "./pages/Login_Signup";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login-signup" element={<Login_Signup />} />
        <Route path="login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
