import { useEffect, useState } from "react";
import { db } from "./firebase"; // Firebase Firestore instance
import { collection, getDocs } from "firebase/firestore";

function AdminPanel() {
  const [timetables, setTimetables] = useState([]);
    
  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "timetables"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTimetables(data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      }
    };

    fetchTimetables();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Panel - View All Timetables</h2>

      {timetables.length === 0 ? (
        <p>No timetables found.</p>
      ) : (
        timetables.map((timetableData) => (
          <div key={timetableData.id} className="mt-4">
            <h4>
              Class: {timetableData.className} | Teacher: {timetableData.teacherName}
            </h4>

            {timetableData.timetable && Array.isArray(timetableData.timetable) ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Time</th>
                    {timetableData.timetable.map((day, index) => (
                      <th key={index}>{day.day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableData.timetable[0]?.subjects?.map((_, slotIndex) => (
                    <tr key={slotIndex}>
                      <td>{`Slot ${slotIndex + 1}`}</td>
                      {timetableData.timetable.map((day, dayIndex) => (
                        <td key={dayIndex}>{day.subjects[slotIndex] || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "red" }}>Invalid timetable format or missing data.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;
