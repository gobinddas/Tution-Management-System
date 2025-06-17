import React, { useState, useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [actionMenuBatchId, setActionMenuBatchId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBatchName, setEditBatchName] = useState("");
  const [editingBatchId, setEditingBatchId] = useState(null);
  const actionMenuRef = useRef();

  // Load batches and students from server
  useEffect(() => {
    const fetchBatches = async () => {
      const response = await axios.get("http://localhost:8000/api/getAllBatch");

      setBatches(response.data);
    };

    const fetchStudents = async () =>{
      const response = await axios.get("http://localhost:8000/api/getStudent");
      setStudents(response.data)
    }


fetchStudents();
    fetchBatches();
  }, []);

  // Add new batch
  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/create/batch",
        {
          name: batchName.trim(),
        }
      );
      const newBatch = response.data.batch;
      const newBatches = [...batches, newBatch];
      setBatches(newBatches);
      setBatchName("");
      setSelectedBatch(newBatch);
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      console.error("Error adding batch:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to add batch try again");
      }
    }
  };

  // delete batch

  const handleBatchDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete/${id}`
      );

      const updateBatches = batches.filter((batch) => batch._id !== id);
      setBatches(updateBatches);

      if (selectedBatch && selectedBatch._id === id) {
        setSelectedBatch(null);
      }

      toast.success("Batch deleted successfully", { position: "top-center" });
    } catch (error) {
      console.error(
        "Error deleting batch:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete batch");
    }
  };

  // hide action muenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-menu") && !event.target.closest(".menu-button")) {
        setActionMenuBatchId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // open edit modal

  const openEditModal = (batch) => {
    setEditBatchName(batch.name);
    setEditingBatchId(batch._id);
    setShowEditModal(true);
    setActionMenuBatchId(null);
  };
  // save update batch

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/editBatch/${editingBatchId}`,
        {
          name: editBatchName.trim(),
        }
      );
      const updated = batches.map((b) =>
        b._id === editingBatchId ? { ...b, name: editBatchName } : b
      );
      setBatches(updated);
      setShowEditModal(false);
      toast.success(response.data.message || "Batch updated");
    } catch (error) {
      toast.error("Failed to update batch");
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
            onChange={(e) => setBatchName(e.target.value)}
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
          {batches.map((batch) => (
            <li
              key={batch._id}
              className={`py-2 px-3 rounded cursor-pointer mb-1 flex items-center justify-between ${selectedBatch?._id === batch._id
                ? "bg-blue-100 font-bold"
                : "hover:bg-blue-50"
                }`}
            >
              <span
                onClick={() => setSelectedBatch(batch)}
                className="flex-1 cursor-pointer"
              >
                {batch.name}
              </span>
              <div className="relative" ref={actionMenuRef}>
                <button
                  className="menu-button ml-2 text-gray-700 hover:text-black p-1 rounded transition cursor-pointer"
                  title="more"
                  onClick={() =>
                    setActionMenuBatchId(
                      batch._id === actionMenuBatchId ? null : batch._id
                    )
                  }
                >
                  <IoMdMore />
                </button>
                {actionMenuBatchId === batch._id && (
                  <div className="action-menu absolute right-0 mt-1 w-28 bg-white border border-gray-200 shadow-md rounded z-10">
                    <button
                      onClick={() => openEditModal(batch)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleBatchDelete(batch._id)}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}

              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Students in Selected Batch */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {selectedBatch
            ? `Students in ${selectedBatch.name}`
            : "Select a batch to view students"}
        </h2>

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
            {selectedBatch ? (
              students.filter(student => student.batch?._id === selectedBatch._id).map(student =>(

           
            <tr key={student._id} className="border-b hover:bg-blue-50">
              <td className="py-2">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
              <td className="py-2">{student.phone}</td>
              <td className="py-2">
                <span className="text-green-700 font-semibold">1000</span>
              </td>
              <td className="py-2 flex gap-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">
                  Stats
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs">
                  Delete
                </button>
              </td>
            </tr>
               ))
            ):(<tr> <td className="py-2 text-gray-500" colSpan="4">Select a batch to view students</td></tr>)}

          </tbody>
        </table>
      </div>
      {/* eidt modal  */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center z-50 justify-center z-50 ">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-blue-700">
              Edit Batch Name
            </h2>
            <form onSubmit={handleUpdateBatch}>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setEditBatchName(e.target.value)}
                type="text"
                value={editBatchName}
                required
              />

              <div className="flex justify-end gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                  Save
                </button>
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;
