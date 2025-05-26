import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import MaxAttendance from "./MaxAttendance";
import LowAttendance from "./LowAttendance";


const PastAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load batches and students from localStorage
  useEffect(() => {
    setBatches(JSON.parse(localStorage.getItem("batches") || "[]"));
    setStudents(JSON.parse(localStorage.getItem("students") || "[]"));
    setAttendanceRecords(JSON.parse(localStorage.getItem("attendanceRecords") || "[]"));
  }, []);

  // Format selectedDate to yyyy-mm-dd for comparison
  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  // Filter attendance records by batch and date
  const filteredRecords = attendanceRecords.filter(
    (rec) =>
      rec.batchId === selectedBatch &&
      rec.date === formattedDate
  );

  // Get student info for each record
  const getStudentName = (id) => {
    const s = students.find((stu) => stu.id === id);
    if (!s) return id;
    return `${s.firstName || ""} ${s.middleName || ""} ${s.lastName || ""}`.replace(/\s+/g, " ").trim();
  };

  // Get Attendance By (assume all records for the date/batch have same 'by')
  const attendanceBy =
    filteredRecords.length > 0 ? filteredRecords[0].by || "N/A" : "";

  // Format date in "2025 May 22" style
  const formattedDateEnglish = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filter Column */}
      <div className="md:w-1/3 w-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col gap-8">
        <div>
          <label className="block font-semibold mb-2 text-[#1b6896]">Select Batch</label>
          <select
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#1b6896] bg-white/60 backdrop-blur"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
          >
            <option value="">-- Select Batch --</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-[#1b6896]">Select Date</label>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl shadow border border-white/30 bg-white/60 backdrop-blur"
            styles={{
              caption: { color: "#1b6896", fontWeight: "bold" },
              day_selected: { backgroundColor: "#1b6896", color: "white" },
              day_today: { borderColor: "#a16f55" },
            }}
          />
        </div>
      </div>

      {/* Data Column */}
      <div className="md:w-2/3 w-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6">
        <h2 className="text-xl font-bold mb-2 text-[#1b6896]">Attendance Records</h2>
        {selectedBatch && formattedDate ? (
          filteredRecords.length > 0 ? (
            <>
              <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-[#1b6896] font-semibold text-base">
                  Date: {formattedDateEnglish}
                </div>
                <div className="text-[#a16f55] font-semibold text-base">
                  Attendance By: {attendanceBy}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-xl overflow-hidden bg-white/40 backdrop-blur border border-white/30">
                  <thead>
                    <tr className="bg-[#1b6896]/80 text-white">
                      <th className="px-4 py-2 text-left">Student Name</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((rec, idx) => (
                      <tr key={rec.studentId} className="even:bg-white/20">
                        <td className="px-4 py-2">{getStudentName(rec.studentId)}</td>
                        <td className="px-4 py-2">{rec.status}</td>
                        <td className="px-4 py-2">{rec.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Max and Low Attendance for selected batch (all time) */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <MaxAttendance
                  batchId={selectedBatch}
                  students={students}
                  attendanceRecords={attendanceRecords}
                />
                <LowAttendance
                  batchId={selectedBatch}
                  students={students}
                  attendanceRecords={attendanceRecords}
                />
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">No attendance records found for this batch and date.</div>
          )
        ) : (
          <div className="text-gray-400 text-center py-8">Please select batch and date to view records.</div>
        )}
      </div>
    </div>
  );
};

export default PastAttendance;