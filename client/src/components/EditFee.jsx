import React, { useState, useEffect } from 'react';

const EditFee = ({ student, onDone }) => {
  const [admissionCharge, setAdmissionCharge] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [previousFee, setPreviousFee] = useState('');
  const [extraFees, setExtraFees] = useState([{ key: '', value: '' }]);
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [feeOfMonth, setFeeOfMonth] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Load existing fee details if available
  useEffect(() => {
    if (student && student.feeDetails) {
      setAdmissionCharge(student.feeDetails.admissionCharge || '');
      setMonthlyFee(student.feeDetails.monthlyFee || '');
      setPreviousFee(student.feeDetails.previousFee || '');
      setExtraFees(student.feeDetails.extraFees && student.feeDetails.extraFees.length > 0
        ? student.feeDetails.extraFees
        : [{ key: '', value: '' }]
      );
      setBillDate(student.feeDetails.billDate || new Date().toISOString().slice(0, 10));
      setFeeOfMonth(student.feeDetails.feeOfMonth || new Date().toISOString().slice(0, 7));
    }
  }, [student]);

  // Handle extra fee changes
  const handleExtraFeeChange = (idx, field, value) => {
    setExtraFees(fees =>
      fees.map((fee, i) => (i === idx ? { ...fee, [field]: value } : fee))
    );
  };

  // Add new extra fee row
  const handleAddExtraFee = () => {
    setExtraFees(fees => [...fees, { key: '', value: '' }]);
  };

  // Remove extra fee row
  const handleRemoveExtraFee = (idx) => {
    setExtraFees(fees => fees.filter((_, i) => i !== idx));
  };

  // Calculate total
  const total =
    (parseFloat(admissionCharge) || 0) +
    (parseFloat(monthlyFee) || 0) +
    (parseFloat(previousFee) || 0) +
    extraFees.reduce((sum, fee) => sum + (parseFloat(fee.value) || 0), 0);

  // Handle submit (update fee bill)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student?.id) {
      alert('Student not found.');
      return;
    }
    // Update the selected student's fee and fee details in localStorage
    const stored = JSON.parse(localStorage.getItem('students') || '[]');
    const updated = stored.map(s =>
      s.id === student.id
        ? {
            ...s,
            fee: total,
            feeDetails: {
              previousFee,
              admissionCharge,
              monthlyFee,
              extraFees: extraFees.filter(fee => fee.key && fee.value),
              billDate,
              feeOfMonth,
              total,
            }
          }
        : s
    );
    localStorage.setItem('students', JSON.stringify(updated));
    alert('Fee bill updated!');
    if (onDone) onDone();
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
      {/* Left: Fee Form */}
      <form className="flex-1 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Student</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            value={
              student
                ? `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.replace(/\s+/g, ' ').trim()
                : ''
            }
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Batch</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            value={student?.batch || ''}
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Previous Fee (NPR)</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
            value={previousFee}
            onChange={e => setPreviousFee(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Admission Charge (NPR)</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
            value={admissionCharge}
            onChange={e => setAdmissionCharge(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Monthly Fee (NPR)</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
            value={monthlyFee}
            onChange={e => setMonthlyFee(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Fee of Month</label>
          <input
            type="month"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
            value={feeOfMonth}
            onChange={e => setFeeOfMonth(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Extra Fees</label>
          {extraFees.map((fee, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Fee Title"
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1"
                value={fee.key}
                onChange={e => handleExtraFeeChange(idx, 'key', e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-28 border border-gray-200 rounded-lg px-2 py-1"
                value={fee.value}
                onChange={e => handleExtraFeeChange(idx, 'value', e.target.value)}
                min="0"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 rounded hover:bg-red-700"
                onClick={() => handleRemoveExtraFee(idx)}
                disabled={extraFees.length === 1}
                title="Remove"
              >-</button>
            </div>
          ))}
          <button
            type="button"
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
            onClick={handleAddExtraFee}
          >
            + Add Extra Fee
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-blue-700">Bill Date</label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
            value={billDate}
            onChange={e => setBillDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition text-lg"
        >
          Update Fee Bill
        </button>
      </form>

      {/* Right: Live Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-2xl shadow-inner p-8 flex flex-col items-center border border-blue-100">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-blue-700 mb-2">Suway International Business School</div>
          <div className="text-lg text-gray-700 mb-1">Fee Bill Preview</div>
          <div className="text-sm text-gray-500">Bill Date: {billDate}</div>
          <div className="text-sm text-gray-500">Fee of Month: {feeOfMonth}</div>
        </div>
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6 border border-blue-100">
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Student:</span>{' '}
            {student
              ? `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.replace(/\s+/g, ' ').trim()
              : '---'}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Batch:</span> {student?.batch || '---'}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Previous Fee:</span> NPR {previousFee || 0}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Admission Charge:</span> NPR {admissionCharge || 0}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Monthly Fee:</span> NPR {monthlyFee || 0}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Fee of Month:</span> {feeOfMonth}
          </div>
          {extraFees.filter(fee => fee.key && fee.value).length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-700">Extra Fees:</span>
              <ul className="ml-4 list-disc">
                {extraFees.filter(fee => fee.key && fee.value).map((fee, idx) => (
                  <li key={idx}>
                    {fee.key}: NPR {fee.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 border-t pt-3 font-bold text-lg text-blue-800 flex justify-between">
            <span>Total</span>
            <span>NPR {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFee;