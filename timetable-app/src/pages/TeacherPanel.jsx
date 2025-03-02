import { useState } from "react";
import { db, collection, addDoc } from "./firebase"; // Firebase imports

function TeacherPanel() {
  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [subjects, setSubjects] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timeGap, setTimeGap] = useState("");
  const [timetable, setTimetable] = useState(null);

  const generateTimetable = () => {
    if (!className || !teacherName || !subjects || !startTime || !timeGap) {
      alert("Fill all fields before generating the timetable.");
      return;
    }

    const subjectList = subjects.split(",").map(s => s.trim());
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let timetableStructure = Array.from({ length: 6 }, () => Array(4).fill(""));

    let subjectCounts = {};
    subjectList.forEach(sub => (subjectCounts[sub] = 0));

    let availableSlots = [];

    for (let day = 0; day < 6; day++) {
      for (let slot = 0; slot < 4; slot++) {
        availableSlots.push({ day, slot });
      }
    }

    while (Object.values(subjectCounts).some(count => count < 4) && availableSlots.length > 0) {
      for (let sub of subjectList) {
        if (subjectCounts[sub] < 4 && availableSlots.length > 0) {
          let randomIndex = Math.floor(Math.random() * availableSlots.length);
          let { day, slot } = availableSlots.splice(randomIndex, 1)[0];
          timetableStructure[day][slot] = sub;
          subjectCounts[sub]++;
        }
      }
    }

    // Generate time slots dynamically
    let timeSlots = [];
    let [hours, minutes] = startTime.split(":").map(Number);
    let gap = parseInt(timeGap, 10);

    for (let i = 0; i < 4; i++) {
      timeSlots.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      minutes += gap;
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes %= 60;
      }
    }

    setTimetable({ days, timeSlots, timetableStructure });
  };

  const saveTimetable = async () => {
    if (!timetable) {
      alert("Generate a timetable before saving.");
      return;
    }

    try {
      // Convert nested array into an object
      const formattedTimetable = timetable.timetableStructure.map((daySubjects, index) => ({
        day: timetable.days[index],
        subjects: [...daySubjects], // Ensuring it's a proper array
      }));

      await addDoc(collection(db, "timetables"), {
        className,
        teacherName,
        timetable: formattedTimetable,
      });

      alert("Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Teacher Panel</h2>
      <input className="form-control mt-2" placeholder="Enter Class Name" onChange={(e) => setClassName(e.target.value)} />
      <input className="form-control mt-2" placeholder="Enter Your Name" onChange={(e) => setTeacherName(e.target.value)} />
      <input className="form-control mt-2" placeholder="Enter Subjects (comma-separated)" onChange={(e) => setSubjects(e.target.value)} />
      <input className="form-control mt-2" type="time" placeholder="Start Time" onChange={(e) => setStartTime(e.target.value)} />
      <input className="form-control mt-2" type="number" placeholder="Time Gap (minutes)" onChange={(e) => setTimeGap(e.target.value)} />
      <button className="btn btn-primary mt-3" onClick={generateTimetable}>Generate Timetable</button>
      <button className="btn btn-success mt-3 ms-2" onClick={saveTimetable}>Save Timetable</button>

      {timetable && (
        <div>
          <h4 className="mt-4">Generated Timetable</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Time</th>
                {timetable.days.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.timeSlots.map((time, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{time}</td>
                  {timetable.days.map((_, colIndex) => (
                    <td key={colIndex}>
                      {timetable.timetableStructure[colIndex][rowIndex] || "-"}
                    </td>
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

export default TeacherPanel;
