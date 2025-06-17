import React, { useState, useEffect } from 'react';
import axios from 'axios';

const shiftOptions = ['Morning', 'Day', 'Evening'];

const initialForm = {
  profile: '',
  firstName: '',
  middleName: '',
  lastName: '',
  batch: '',
  shift: shiftOptions[0],
  phone: '',
  email: '',
  address: '',
  stream: '',
  parentName: '',
  parentPhone: '',
  pastEducation: '',
};

const AddStudent = () => {
  const [form, setForm] = useState(initialForm);
  const [profilePreview, setProfilePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [batchOptions, setBatchOptions] = useState([]);
  const selectedBatch = batchOptions.find(b => b._id.toString() ===(form.batch));
  const batchName = selectedBatch ? selectedBatch.name : 'xxxxx';

  // Fetch batches from api
  useEffect(() => {


    const fetchBatch = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getAllBatch");


        setBatchOptions(response.data)

      } catch (error) {
        console.error("Error fetching Batch", error)
      }
    }



    fetchBatch();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone and parentPhone, allow only numbers
    if ((name === "phone" || name === "parentPhone") && value && !/^\d*$/.test(value)) {
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Phone validation: must start with 9 and be exactly 10 digits
    if (!/^9\d{9}$/.test(form.phone)) {
      newErrors.phone = "Phone number must start with 9 and be exactly 10 digits.";
    }
    if (form.parentPhone && !/^9\d{9}$/.test(form.parentPhone)) {
      newErrors.parentPhone = "Parent phone must start with 9 and be exactly 10 digits.";
    }

    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      const response = await axios.post("http://localhost:8000/api/create/student", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201 || response.status === 200) {
        alert("Student added successfully!");
        setForm(initialForm);
        console.log(form);
        setProfilePreview("");
        setErrors({});
      } else {
        alert("Something went wrong");
      }

    } catch (error) {
      console.error(error);
      alert("Failed to add student. Check console for details.")

    }

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, profile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
      {/* Form */}
      <form className="flex-1 space-y-6" autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-2 text-blue-700">Profile Image</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow group-hover:bg-blue-700 transition">
              Upload Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Preview"
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-300 shadow"
              />
            )}
          </label>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"

            >
              {batchOptions.length === 0 ? (
                <option value="">No batch found</option>
              ) : (
                batchOptions.map(batch => (
                  <option key={batch._id} value={batch._id}>{batch.name}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Shift</label>
            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            >
              {shiftOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={`w-full border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition`}
            />
            {errors.phone && (
              <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
            )}
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Address</label>
          <input
            type="text"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Stream</label>
          <input
            type="text"
            name="stream"
            value={form.stream}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-blue-700">Parent Phone Number</label>
            <input
              type="text"
              name="parentPhone"
              value={form.parentPhone}
              onChange={handleChange}
              maxLength={10}
              className={`w-full border ${errors.parentPhone ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition`}
            />
            {errors.parentPhone && (
              <div className="text-red-500 text-sm mt-1">{errors.parentPhone}</div>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Past Education</label>
          <input
            type="text"
            name="pastEducation"
            value={form.pastEducation}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition text-lg"
        >
          Add Student
        </button>
      </form>

      {/* Live Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-2xl shadow-inner p-8 flex flex-col items-center border border-blue-100">
        <div className="mb-6">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile Preview"
              className="h-28 w-28 rounded-full object-cover border-4 border-blue-300 shadow-lg"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-blue-300 flex items-center justify-center text-white text-5xl font-bold border-4 border-blue-200 shadow-lg">
              {form.firstName || form.lastName
                ? `${form.firstName[0] || ''}${form.lastName[0] || ''}`.toUpperCase()
                : <span className="text-2xl text-center font-medium ">No Image</span>}
            </div>
          )}
        </div>
        <div className="text-center space-y-2">
          <div className="text-3xl font-extrabold text-blue-700">
            Full Name: {form.firstName || 'xxxxx'} {form.middleName || 'xxxxx'} {form.lastName || 'xxxxx'}
          </div>
          <div className="text-xl text-blue-600">
             Batch: {batchName} &bull; Shift: {form.shift || 'xxxxx'}
          </div>
          <div className="text-xl text-gray-700">
            Phone: {form.phone || 'xxxxx'}
          </div>
          <div className="text-xl text-gray-700">
            Email: {form.email || 'xxxxx'}
          </div>
          <div className="text-xl text-gray-700">
            Address: {form.address || 'xxxxx'}
          </div>
          <div className="text-xl text-gray-700">
            Stream: {form.stream || 'xxxxx'}
          </div>
          <div className="text-xl text-gray-700">
            Parent Name: {form.parentName || 'xxxxx'} ({form.parentPhone || 'xxxxx'})
          </div>
          <div className="text-xl text-gray-700">
            Past Education: {form.pastEducation || 'xxxxx'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;