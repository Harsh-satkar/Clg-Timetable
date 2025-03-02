import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function StudentPanel() {
  const [className, setClassName] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [allClasses, setAllClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "timetables"));
        const classes = querySnapshot.docs.map(doc => doc.data().className);
        setAllClasses(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const fetchTimetable = async () => {
    if (!className) return;
    try {
      const querySnapshot = await getDocs(collection(db, "timetables"));
      const data = querySnapshot.docs.map(doc => doc.data());
      const selectedTimetable = data.find(item => item.className === className);
      setTimetable(selectedTimetable?.timetable || null);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Panel - View Timetable</h2>
      <select className="form-control" onChange={(e) => setClassName(e.target.value)}>
        <option value="">Select Class</option>
        {allClasses.map((cls, index) => (
          <option key={index} value={cls}>{cls}</option>
        ))}
      </select>
      <button className="btn btn-primary mt-3" onClick={fetchTimetable}>View Timetable</button>

      {timetable && (
        <div className="mt-4">
          <h4>Timetable for {className}</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Time</th>
                {timetable.map((day, index) => (
                  <th key={index}>{day.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable[0].subjects.map((_, slotIndex) => (
                <tr key={slotIndex}>
                  <td>{`Slot ${slotIndex + 1}`}</td>
                  {timetable.map((day, dayIndex) => (
                    <td key={dayIndex}>{day.subjects[slotIndex] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentPanel;
