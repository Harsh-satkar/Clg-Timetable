import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Timetable Management System</h2>
      <div className="mt-4">
        <Link to="/admin" className="btn btn-primary m-2">Admin Panel</Link>
        <Link to="/student" className="btn btn-success m-2">Student Panel</Link>
        <Link to="/teacher" className="btn btn-warning m-2">Teacher Panel</Link>
      </div>
    </div>
  );
}

export default Home;
