import React, { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [batchName, setBatchName] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editFeeId, setEditFeeId] = useState(null);
  const [feeValue, setFeeValue] = useState('');

  // For delete confirmation popup (student)
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // For delete batch confirmation popup
  const [showDeleteBatchPopup, setShowDeleteBatchPopup] = useState(false);
  const [deleteBatchCode, setDeleteBatchCode] = useState('');
  const [deleteBatchInput, setDeleteBatchInput] = useState('');
  const [deleteBatchId, setDeleteBatchId] = useState(null);

  // Load batches and students from localStorage
  useEffect(() => {
    const storedBatches = JSON.parse(localStorage.getItem('batches') || '[]');
    setBatches(storedBatches);
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);

    // By default, select the latest batch (last in the array)
    if (storedBatches.length > 0) {
      setSelectedBatch(storedBatches[storedBatches.length - 1]);
    }
  }, []);

  // Add new batch
  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    // Check for duplicate batch name (case-insensitive)
    if (batches.some(b => b.name.trim().toLowerCase() === batchName.trim().toLowerCase())) {
      alert('Same name batch already exist');
      return;
    }
    const newBatches = [...batches, { id: Date.now(), name: batchName.trim() }];
    setBatches(newBatches);
    localStorage.setItem('batches', JSON.stringify(newBatches));
    setBatchName('');
    setSelectedBatch({ id: newBatches[newBatches.length - 1].id, name: newBatches[newBatches.length - 1].name }); // Select the newly added batch
  };

  // Edit fee for a student
  const handleEditFee = (studentId) => {
    setEditFeeId(studentId);
    const student = students.find(s => s.id === studentId);
    setFeeValue(student?.fee || '');
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

  // Show stats (dummy for now)
  const handleShowStats = (student) => {
    alert(`Stats for ${student.firstName} ${student.lastName}`);
  };

  // Filter students by selected batch
  const filteredStudents = selectedBatch
    ? students.filter(s => s.batch === selectedBatch.name)
    : [];

  // Helper to generate random 6-character string
  function generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Delete logic with double confirmation (student)
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
      // Find the student to delete by id (if present) or by unique fields
      const studentToDelete = students.find(s => s.id === deleteStudentId);
      let updated;
      if (studentToDelete && studentToDelete.id) {
        // If student has an id, use it for deletion
        updated = stored.filter(s => s.id !== deleteStudentId);
      } else if (studentToDelete) {
        // Fallback: match by firstName, lastName, batch, and phone for uniqueness
        updated = stored.filter(
          s =>
            !(
              s.firstName === studentToDelete.firstName &&
              s.lastName === studentToDelete.lastName &&
              s.batch === selectedBatch.name &&
              s.phone === studentToDelete.phone
            )
        );
      } else {
        updated = stored;
      }
      localStorage.setItem('students', JSON.stringify(updated));
      setStudents(students.filter(s => s.id !== deleteStudentId));
      setShowDeletePopup(false);
      setDeleteStudentId(null);
      setDeleteInput('');
      setDeleteCode('');
      setDeleteError(
        studentToDelete
          ? `${studentToDelete.firstName} ${studentToDelete.lastName} deleted successfully!`
          : 'Student deleted successfully!'
      );
      setTimeout(() => setDeleteError(''), 2000);
    } else {
      setDeleteError('Code did not match. Try again.');
      setShowDeletePopup(false);
      setTimeout(() => setDeleteError(''), 2000);
    }
  };

  // Delete batch logic with double confirmation
  const handleDeleteBatchClick = (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    // Check if students exist in this batch
    if (students.some(s => s.batch === batch.name)) {
      alert('Student already in batch');
      return;
    }
    setDeleteBatchCode(generateRandomCode());
    setDeleteBatchInput('');
    setDeleteBatchId(batchId);
    setShowDeleteBatchPopup(true);
  };

  const handleDeleteBatchConfirm = () => {
    if (deleteBatchInput === deleteBatchCode) {
      const batchToDelete = batches.find(b => b.id === deleteBatchId);
      const newBatches = batches.filter(b => b.id !== deleteBatchId);
      setBatches(newBatches);
      localStorage.setItem('batches', JSON.stringify(newBatches));
      // If deleted batch was selected, select latest or null
      if (selectedBatch?.id === deleteBatchId) {
        if (newBatches.length > 0) {
          setSelectedBatch(newBatches[newBatches.length - 1]);
        } else {
          setSelectedBatch(null);
        }
      }
      setShowDeleteBatchPopup(false);
      setDeleteBatchId(null);
      setDeleteBatchInput('');
      setDeleteBatchCode('');
      setDeleteError(
        batchToDelete
          ? `Batch "${batchToDelete.name}" deleted successfully!`
          : 'Batch deleted successfully!'
      );
      setTimeout(() => setDeleteError(''), 2000);
    } else {
      setDeleteError('Code did not match. Try again.');
      setShowDeleteBatchPopup(false);
      setTimeout(() => setDeleteError(''), 2000);
    }
  };

  return (
    <div className="flex gap-8 p-8 bg-blue-50 min-h-screen">
      {/* Left: Add Batch and Batch List */}
      <div className="w-1/4 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Add Batch</h2>
        <form onSubmit={handleAddBatch} className="mb-6">
          <input
            type="text"
            placeholder="Batch Name"
            value={batchName}
            onChange={e => setBatchName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Batch
          </button>
        </form>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Batches</h3>
        <ul>
          {batches.length === 0 && (
            <li className="text-gray-400">No batches yet.</li>
          )}
          {batches.map(batch => (
            <li
              key={batch.id}
              className={`py-2 px-3 rounded cursor-pointer mb-1 flex items-center justify-between ${selectedBatch?.id === batch.id ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
            >
              <span
                onClick={() => setSelectedBatch(batch)}
                className="flex-1 cursor-pointer"
              >
                {batch.name}
              </span>
              <button
                className="ml-2 text-red-600 hover:text-red-800 p-1 rounded transition"
                title="Delete Batch"
                onClick={() => handleDeleteBatchClick(batch.id)}
              >
                <FaTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Students in Selected Batch */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {selectedBatch ? `Students in ${selectedBatch.name}` : 'Select a batch to view students'}
        </h2>
        {/* Delete Confirmation Popup (Student) */}
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
        {/* Delete Confirmation Popup (Batch) */}
        {showDeleteBatchPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
              <div className="mb-3 text-lg font-bold text-red-600">Confirm Delete Batch</div>
              <div className="mb-2 text-gray-700 text-center">
                Type the code below to confirm batch deletion:
              </div>
              <div className="mb-4 font-mono text-xl bg-gray-100 px-4 py-2 rounded select-none tracking-widest">
                {deleteBatchCode}
              </div>
              <input
                type="text"
                value={deleteBatchInput}
                onChange={e => setDeleteBatchInput(e.target.value)}
                className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                placeholder="Enter code exactly"
                autoFocus
              />
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={handleDeleteBatchConfirm}
                >
                  Confirm
                </button>
                <button
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowDeleteBatchPopup(false)}
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
        {selectedBatch && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Fee</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-gray-400 text-center">No students in this batch.</td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-blue-50">
                    <td className="py-2">{student.firstName} {student.lastName}</td>
                    <td className="py-2">{student.phone}</td>
                    <td className="py-2">
                      {student.fee ? (
                        <span className="text-green-700 font-semibold">₹{student.fee}</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Unpaid Now</span>
                      )}
                      {editFeeId === student.id ? (
                        <span className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            value={feeValue}
                            onChange={e => setFeeValue(e.target.value)}
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => handleSaveFee(student.id)}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditFeeId(null)}
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 text-xs"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEditFee(student.id)}
                          className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td className="py-2 flex gap-2">
                      <button
                        onClick={() => handleShowStats(student)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Batches;