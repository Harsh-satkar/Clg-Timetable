import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import TeacherPanel from "./pages/TeacherPanel";
import StudentPanel from "./pages/StudentPanel";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Router>
      <div className="container text-center mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<TeacherPanel />} />
          <Route path="/student" element={<StudentPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
