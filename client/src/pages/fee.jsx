import React, { useState, useEffect } from 'react';
import AddFee from '../components/AddFee';
import EditFee from '../components/EditFee';

const Fee = () => {
  const [students, setStudents] = useState([]);
  const [editFeeId, setEditFeeId] = useState(null);
  const [feeValue, setFeeValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(stored);
  }, [showAdd, editFeeId]);

  const handleEditFee = (studentId, currentFee) => {
    setEditFeeId(studentId);
    setFeeValue(currentFee || '');
  };

  const handleSaveFee = (studentId) => {
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, fee: feeValue } : s
    );
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setEditFeeId(null);
    setFeeValue('');
  };

  // Show AddFee component when showAdd is true
  if (showAdd) {
    return (
      <div className="full-w mx-auto mt-0 bg-white rounded-3xl shadow-2xl p-8">
        <button
          className="mb-4 bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => setShowAdd(false)}
        >
          Back to Fee List
        </button>
        <AddFee onDone={() => setShowAdd(false)} />
      </div>
    );
  }

  // Show EditFee component when editFeeId is set
  if (editFeeId !== null) {
    const student = students.find(s => s.id === editFeeId);
    return (
      <div className="full-w mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-8">
        <button
          className="mb-4 bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => setEditFeeId(null)}
        >
          Back to Fee List
        </button>
        {/* Pass the full student object to EditFee */}
        <EditFee student={student} onDone={() => setEditFeeId(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-0 px-2">
      <div className="full-w mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => setShowAdd(true)}
          >
            + Add Fee
          </button>
          <h2 className="text-2xl font-bold text-blue-700">Student Fee List</h2>
        </div>
        <table className="w-full text-left rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Batch</th>
              <th className="py-3 px-4">Fee (NPR)</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">No students found.</td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student.id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-4">{`${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.replace(/\s+/g, ' ').trim()}</td>
                  <td className="py-3 px-4">{student.batch || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={student.fee ? "text-green-700 font-semibold" : "text-red-500 font-semibold"}>
                      {student.fee && !isNaN(student.fee) && Number(student.fee) > 0
                        ? `NPR ${student.fee}`
                        : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setEditFeeId(student.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fee;