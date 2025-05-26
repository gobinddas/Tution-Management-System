import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStudent from '../components/AddStudent';
import EditStudent from '../components/EditStudent';

function getInitials(name) {
  const names = name.split(' ');
  const initials = names[0][0] + (names[1]?.[0] || '');
  return initials.toUpperCase();
}

// Helper to generate random 6-character string
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const Students = () => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // For delete confirmation popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Fetch students from localStorage on mount or when showAdd changes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(
      stored.map((s) => ({
        id: s.id,
        name: `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        profile: s.profilePreview || '',
        batch: s.batch || '',
      }))
    );
  }, [showAdd]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Delete logic with double confirmation
  const handleDeleteClick = (studentId) => {
    setDeleteCode(generateRandomCode());
    setDeleteInput('');
    setDeleteStudentId(studentId);
    setDeleteError('');
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteInput === deleteCode) {
      // Remove from localStorage
      const stored = JSON.parse(localStorage.getItem('students') || '[]');
      const updated = stored.filter(s => s.id !== deleteStudentId); // <-- FIXED LINE
      // Get deleted student's name for message
      const deletedStudent = students.find(s => s.id === deleteStudentId);
      localStorage.setItem('students', JSON.stringify(updated));
      setStudents(students.filter(s => s.id !== deleteStudentId));
      setShowDeletePopup(false);
      setDeleteStudentId(null);
      setDeleteInput('');
      setDeleteCode('');
      setDeleteError('');
      // Show success message
      if (deletedStudent) {
        setDeleteError(`${deletedStudent.name} deleted successfully!`);
        setTimeout(() => setDeleteError(''), 2000);
      }
    } else {
      setDeleteError('Code did not match. Try again.');
      setShowDeletePopup(false);
      setTimeout(() => setDeleteError(''), 2000);
    }
  };

  if (showAdd) {
    return (
      <div className="mx-auto p-6 bg-white rounded-xl shadow">
        <button
          className="mb-4 bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => setShowAdd(false)}
        >
          Back to Students
        </button>
        <AddStudent />
      </div>
    );
  }

  if (showEdit && editStudent) {
    return (
      <div className="mx-auto p-6 bg-white rounded-xl shadow">
        <button
          className="mb-4 bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => {
            setShowEdit(false);
            setEditStudent(null);
          }}
        >
          Back to Students
        </button>
        {/* Pass the full student object including id */}
        <EditStudent student={editStudent} onDone={() => {
          setShowEdit(false);
          setEditStudent(null);
          // Optionally, refresh students list here if EditStudent does not do it
          const stored = JSON.parse(localStorage.getItem('students') || '[]');
          setStudents(
            stored.map((s) => ({
              id: s.id,
              name: `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''}`.replace(/\s+/g, ' ').trim(),
              profile: s.profilePreview || '',
              batch: s.batch || '',
            }))
          );
        }} />
      </div>
    );
  }

  return (
    <div className="f-w p-6 bg-white rounded-xl shadow relative">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
            <div className="mb-3 text-lg font-bold text-red-600">Confirm Delete</div>
            <div className="mb-2 text-gray-700 text-center">
              Type the code below to confirm deletion:
            </div>
            <div className="mb-4 font-mono text-xl bg-gray-100 px-4 py-2 rounded select-none tracking-widest">
              {deleteCode}
            </div>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter code exactly"
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={handleDeleteConfirm}
              >
                Confirm
              </button>
              <button
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Error message */}
      {deleteError && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded shadow-lg z-50">
          {deleteError}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowAdd(true)}
        >
          + Add Student
        </button>
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="bg-blue-50 rounded-lg p-4 shadow-inner">
        <h2 className="text-lg font-bold text-blue-700 mb-3">
          Students List ({filteredStudents.length})
        </h2>
        <ul className="divide-y divide-blue-100">
          {filteredStudents.length === 0 ? (
            <li className="py-4 text-gray-500 text-center">No students found.</li>
          ) : (
            filteredStudents.map(student => (
              <li
                key={student.id}
                className="py-3 px-2 flex items-center justify-between hover:bg-blue-100 rounded transition"
              >
                <span className="flex items-center gap-3">
                  {student.profile && student.profile.length > 0 ? (
                    <img
                      src={student.profile}
                      alt={student.name}
                      className="h-9 w-9 rounded-full object-cover border-2 border-blue-200 bg-white"
                    />
                  ) : (
                    <span className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-base border-2 border-blue-200">
                      {(() => {
                        const names = student.name.split(' ');
                        const first = names[0]?.[0] || '';
                        const last = names.length > 1 ? names[names.length - 1][0] : '';
                        return (first + last).toUpperCase();
                      })()}
                    </span>
                  )}
                  {student.name}
                  {student.batch && (
                    <span className="ml-2 text-xs text-blue-500 font-semibold">
                      ({student.batch})
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold transition">Show Stat</button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold transition">Show Fee</button>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-semibold transition"
                    onClick={() => {
                      setEditStudent(student); // student object includes id
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold transition"
                    onClick={() => handleDeleteClick(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Students;