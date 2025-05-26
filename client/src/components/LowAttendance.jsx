import React from 'react';

// Props: batchId, students, attendanceRecords
const LowAttendance = ({ batchId, students, attendanceRecords }) => {
  // Filter attendance records for this batch
  const batchRecords = attendanceRecords.filter(
    (rec) => String(rec.batchId) === String(batchId)
  );

  // Count total attendance days for this batch
  const uniqueDates = Array.from(new Set(batchRecords.map((rec) => rec.date)));
  const totalDays = uniqueDates.length;

  // Map studentId to present count
  const presentCount = {};
  students
    .filter((s) => s.batch === (students.find(b => String(b.id) === String(batchId))?.batch || s.batch))
    .forEach((s) => {
      presentCount[s.id] = 0;
    });
  batchRecords.forEach((rec) => {
    if (rec.status === 'Present') {
      if (presentCount[rec.studentId] !== undefined) {
        presentCount[rec.studentId] += 1;
      } else {
        presentCount[rec.studentId] = 1;
      }
    }
  });

  // Prepare array of students with percentage
  const studentPercentages = students
    .filter((s) => {
      // Find batch name by id
      const batchObj = students.find(b => String(b.id) === String(batchId));
      return s.batch === (batchObj ? batchObj.batch : s.batch);
    })
    .map((s) => {
      const present = presentCount[s.id] || 0;
      const percent = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;
      return {
        id: s.id,
        name: `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        percent,
      };
    })
    .filter((s) => s.percent < 60)
    .sort((a, b) => a.percent - b.percent);

  if (studentPercentages.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700 font-semibold shadow">
        No student has less than 60% attendance.
      </div>
    );
  }

  return (
    <div className="bg-red-100 border border-red-400 rounded-xl p-4 shadow">
      <h3 className="text-lg font-bold mb-3 text-red-800">Low Attendance (&lt; 60%)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">% Present</th>
            </tr>
          </thead>
          <tbody>
            {studentPercentages.map((s) => (
              <tr key={s.id} className="even:bg-red-50">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2 font-semibold">{s.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowAttendance;