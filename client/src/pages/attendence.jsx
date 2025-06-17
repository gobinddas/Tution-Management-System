import React, { useEffect, useState } from "react";
import PastAttendance from "../components/PastAttendance";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import axios from "axios";

const Attendence = () => {
  const [date, setDate] = useState(new Date());
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [attendanceBy, setAttendanceBy] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [attendanceData,setAttendanceData] = useState([]);

  // Load batches from localStorage
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/getAllBatch"
        );
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches", error);
      }
    };

    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/getStudent"
        );
        setStudents(response.data);
      } catch (error) {
        console.log("Error fetching studnet data", error);
      }
    };
    fetchStudent();
    fetchBatch();
  }, []);


  const filteredStudents = students.filter((student) => {
  return student.batch === selectedBatch || student.batch?._id === selectedBatch;
});

  // show initial attendance 
 const handleShow = () => {
  const data = filteredStudents.map((student) => ({
    studentId: student._id,
    status: "Present",
    remarks: "",
  }));
  setAttendanceData(data);
};

const handleSubmit = async () => {
  try {
    const payload = {
      batchId: selectedBatch,
      date,
      students: attendanceData,
      attendanceBy,
    };
    const res = await axios.post("http://localhost:8000/api/create/attendance", payload);
    setSubmitMsg("Attendance submitted successfully");
    setAttendanceData([]); // ✅ clear table
  } catch (error) {
    console.error("Error submitting attendance", error);
    setSubmitMsg("Failed to submit attendance");
  }
};






  if (showPast) {
    return (
      <div className="w-full mx-auto">
        <button
          className="mb-4 bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => setShowPast(false)}
        >
          Back to Attendance
        </button>
        <PastAttendance />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <button
          className="bg-[#a16f55] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#1b6896] transition w-full sm:w-auto"
          onClick={() => setShowPast(true)}
        >
          See Past Attendance
        </button>
        <h1 className="text-2xl font-bold text-[#1b6896] text-left w-full sm:w-auto">
          Add Attendance
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Column */}
        <div className="md:w-1/3 w-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col gap-8">
          <div>
            <label className="block font-medium mb-1 text-[#a16f55]">
              Select Batch
            </label>
            <select
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#1b6896] bg-white/30 backdrop-blur-md"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">-- Select Batch --</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1 text-[#a16f55]">
              Select Date
            </label>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl shadow border border-white/30 bg-white/60 backdrop-blur w-full"
              styles={{
                caption: { color: "#1b6896", fontWeight: "bold" },
                day_selected: { backgroundColor: "#1b6896", color: "white" },
                day_today: { borderColor: "#a16f55" },
              }}
            />
          </div>
          <button
            className="bg-[#1b6896] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#a16f55] transition mt-2"
            disabled={!selectedBatch}
            onClick={handleShow}
          >
            Show
          </button>
        </div>
        {/* Attendance Table Column */}
        <div className="md:w-2/3 w-full flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-xl overflow-hidden bg-white/30 backdrop-blur-md shadow border border-white/30">
              <thead>
                <tr className="bg-[#1b6896]/80 text-white">
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) =>(

               
                <tr key={student._id} className="even:bg-white/20">
                  <td className="px-4 py-2">{student._id} </td>
                  <td className="px-4 py-2">{student.firstName} {student.middleName} {student.lastName}</td>
                  <td className="px-4 py-2">
                    <select className="border rounded px-2 py-1 bg-white/60 backdrop-blur"
                    value = {attendanceData[idx]?.status}
                    onChange={(e) =>{
                      const newData = [...attendanceData];
                      newData[idx].status = e.target.value;
                      setAttendanceData(newData)
                    }}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full bg-white/60 backdrop-blur"
                      placeholder="-"
                      value={attendanceData[idx]?.remarks}
                      onChange={(e) => {
                        const newData = [...attendanceData];
                        newData[idx].remarks = e.target.value;
                        setAttendanceData(newData);
                      }}
                    />
                  </td>
                </tr>
                 ))}
              </tbody>
            </table>
          </div>
          {/* Attendance By and Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full sm:w-64 bg-white/60 backdrop-blur"
              placeholder="Attendance By (Your Name)"
              value={attendanceBy}
              onChange={(e) => setAttendanceBy(e.target.value)}
            />
            <button className="bg-[#a16f55] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#1b6896] transition w-full sm:w-auto" onClick={handleSubmit}>
              Submit Attendance
            </button>
          </div>

          <div className="mt-4 text-center font-semibold">
            <div className="text-gray-400 text-center py-8">
              Select batch and date, then click Show to display students.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendence;
