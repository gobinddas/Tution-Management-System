import React, { useEffect, useState } from "react";

// Dummy data for demonstration
const dummyStudents = [
  { id: 1, name: "John Doe", attendance: 60, feePending: true },
  { id: 2, name: "Jane Smith", attendance: 92, feePending: false },
  { id: 3, name: "Sam Lee", attendance: 70, feePending: true },
  { id: 4, name: "Sara Khan", attendance: 85, feePending: false },
  { id: 5, name: "Mike Brown", attendance: 55, feePending: true },
];

const dummyBatches = [
  { id: 1, name: "Batch A" },
  { id: 2, name: "Batch B" },
  { id: 3, name: "Batch C" },
];

const todayEvents = [
  { id: 1, title: "Maths Seminar", time: "10:00 AM" },
  { id: 2, title: "Science Quiz", time: "2:00 PM" },
];

const Info = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace with API calls if needed
    setStudents(dummyStudents);
    setBatches(dummyBatches);
    setEvents(todayEvents);
  }, []);

  const lowAttendanceStudents = students.filter((s) => s.attendance < 75);
  const feePendingStudents = students.filter((s) => s.feePending);

  return (
    <div className="p-3 sm:p-6 min-h-screen ">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-[#1b6896] tracking-tight text-center sm:text-left">
        Dashboard Overview
      </h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#1b6896]">
          <span className="text-3xl font-bold text-[#1b6896]">{students.length}</span>
          <span className="text-gray-600 mt-2 font-medium">Total Students</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#a16f55]">
          <span className="text-3xl font-bold text-[#a16f55]">{batches.length}</span>
          <span className="text-gray-600 mt-2 font-medium">Total Batches</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#020202]">
          <span className="text-3xl font-bold text-[#020202]">{events.length}</span>
          <span className="text-gray-600 mt-2 font-medium">Today's Events</span>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#e53e3e] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#e53e3e]"></span>
            Low Attendance Students
          </h2>
          {lowAttendanceStudents.length === 0 ? (
            <p className="text-gray-400 text-sm">No students with low attendance.</p>
          ) : (
            <ul className="space-y-2">
              {lowAttendanceStudents.map((s) => (
                <li key={s.id} className="flex justify-between items-center bg-[#f8f9fb] rounded px-3 py-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-[#e53e3e] font-semibold">{s.attendance}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#eab308] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#eab308]"></span>
            Fee Pending Students
          </h2>
          {feePendingStudents.length === 0 ? (
            <p className="text-gray-400 text-sm">No students with pending fees.</p>
          ) : (
            <ul className="space-y-2">
              {feePendingStudents.map((s) => (
                <li key={s.id} className="flex justify-between items-center bg-[#f8f9fb] rounded px-3 py-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-[#eab308] font-semibold">Pending</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Events */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#1b6896] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1b6896]"></span>
          Today's Events
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">No events today.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="flex justify-between items-center bg-[#f8f9fb] rounded px-3 py-2">
                <span className="font-medium">{event.title}</span>
                <span className="text-xs text-[#1b6896] font-semibold">{event.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Info;