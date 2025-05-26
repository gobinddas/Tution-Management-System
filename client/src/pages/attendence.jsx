import React, { useEffect, useState } from "react";
import PastAttendance from "../components/PastAttendance";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Attendence = () => {
  const [date, setDate] = useState(new Date());
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [attendanceBy, setAttendanceBy] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");

  // Load batches from localStorage
  useEffect(() => {
    const storedBatches = JSON.parse(localStorage.getItem("batches") || "[]");
    setBatches(storedBatches);
  }, []);

  // Load students from localStorage
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(storedStudents);
  }, []);

  // Show students for selected batch and date, or load existing attendance if present
  const handleShow = () => {
    if (!selectedBatch) return;
    const batchObj = batches.find((b) => String(b.id) === String(selectedBatch));
    if (!batchObj) return;
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    // Check if attendance for this batch/date exists
    const prev = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
    const existing = prev.filter(
      (rec) => String(rec.batchId) === String(selectedBatch) && rec.date === formattedDate
    );
    if (existing.length > 0) {
      // Load existing attendance
      const loaded = existing.map((rec) => {
        const student = students.find((s) => String(s.id) === String(rec.studentId));
        return {
          id: rec.studentId,
          name: student ? `${student.firstName || ""} ${student.middleName || ""} ${student.lastName || ""}`.replace(/\s+/g, " ").trim() : rec.studentId,
          status: rec.status,
          remarks: rec.remarks || "",
        };
      });
      setAttendance(loaded);
      setAttendanceBy(existing[0].by || "");
      setSubmitMsg("Attendance for this batch and date is already loaded.");
      return;
    }
    // Otherwise, show students for the batch
    const filtered = students.filter((s) => s.batch === batchObj.name);
    setAttendance(
      filtered.map((s) => ({
        id: s.id,
        name: `${s.firstName || ""} ${s.middleName || ""} ${s.lastName || ""}`.replace(/\s+/g, " ").trim(),
        status: "Present",
        remarks: "",
      }))
    );
    setAttendanceBy("");
    setSubmitMsg("");
  };

  // Handle attendance change
  const handleAttendanceChange = (idx, field, value) => {
    setAttendance((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // Handle submit attendance
  const handleSubmit = () => {
    if (!attendanceBy.trim()) {
      setSubmitMsg("Please enter 'Attendance By' before submitting.");
      return;
    }
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    const records = attendance.map((row) => ({
      studentId: row.id,
      batchId: selectedBatch,
      date: formattedDate,
      status: row.status,
      remarks: row.remarks,
      by: attendanceBy,
    }));

    // Save to localStorage (replace existing for batch/date)
    const prev = JSON.parse(localStorage.getItem("attendanceRecords") || "[]");
    // Remove any previous records for this batch/date
    const filteredPrev = prev.filter(
      (rec) => !(String(rec.batchId) === String(selectedBatch) && rec.date === formattedDate)
    );
    localStorage.setItem("attendanceRecords", JSON.stringify([...filteredPrev, ...records]));
    setSubmitMsg("Attendance submitted successfully!");
    setAttendance([]);
    setAttendanceBy("");
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
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <button
          className="bg-[#a16f55] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#1b6896] transition w-full sm:w-auto"
          onClick={() => setShowPast(true)}
        >
          See Past Attendance
        </button>
        <h1 className="text-2xl font-bold text-[#1b6896] text-left w-full sm:w-auto">Add Attendance</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Column */}
        <div className="md:w-1/3 w-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col gap-8">
          <div>
            <label className="block font-medium mb-1 text-[#a16f55]">Select Batch</label>
            <select
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#1b6896] bg-white/30 backdrop-blur-md"
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
            <label className="block font-medium mb-1 text-[#a16f55]">Select Date</label>
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
            onClick={handleShow}
            disabled={!selectedBatch}
          >
            Show
          </button>
        </div>
        {/* Attendance Table Column */}
        <div className="md:w-2/3 w-full flex flex-col">
          {attendance.length > 0 ? (
            <>
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
                    {attendance.map((row, idx) => (
                      <tr key={row.id} className="even:bg-white/20">
                        <td className="px-4 py-2">{row.id}</td>
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">
                          <select
                            className="border rounded px-2 py-1 bg-white/60 backdrop-blur"
                            value={row.status}
                            onChange={e => handleAttendanceChange(idx, "status", e.target.value)}
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
                            value={row.remarks}
                            onChange={e => handleAttendanceChange(idx, "remarks", e.target.value)}
                            placeholder="-"
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
                  onChange={e => setAttendanceBy(e.target.value)}
                />
                <button
                  className="bg-[#a16f55] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#1b6896] transition w-full sm:w-auto"
                  onClick={handleSubmit}
                >
                  Submit Attendance
                </button>
              </div>
              {submitMsg && (
                <div className={`mt-4 text-center font-semibold ${submitMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {submitMsg}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-center py-8">Select batch and date, then click Show to display students.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendence;