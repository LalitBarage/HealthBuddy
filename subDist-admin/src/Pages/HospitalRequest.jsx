import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

const HospitalRequest = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: "Patient A", status: "Pending" },
    { id: 2, name: "Patient B", status: "Pending" },
  ]);

  const [showHistory, setShowHistory] = useState(false);
  const [history] = useState([
    { id: 101, name: "Patient X", status: "Accepted" },
    { id: 102, name: "Patient Y", status: "Rejected" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full ${colorMap[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Pending Requests</h2>
        <button
          className="bg-[#0ba9bb] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#0990a5] transition"
          onClick={() => setShowHistory((prev) => !prev)}
        >
          {showHistory ? "Hide History" : "Past History"}
        </button>
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex justify-between bg-[#0ba9bb] items-center rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
          >
            <div>
              <h4 className="text-xl font-semibold text-white">{req.name}</h4>
              <div className="flex items-center space-x-3 mt-2">
                <label className="text-white text-sm">Status:</label>
                <select
                  className="rounded px-3 py-1 text-sm focus:outline-none bg-amber-50"
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <button
              className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded-md hover:text-white transition"
              title="View Details"
            >
              <FaEye size={16} />
              View
            </button>
          </div>
        ))}
      </div>

      {/* Past History */}
      {showHistory && (
        <>
          <h3 className="text-2xl font-bold text-[#0ba9bb] mt-12 mb-4">
            Past Requests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex justify-between items-center bg-[#7dc6ce] rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
              >
                <div>
                  <h4 className="text-xl font-semibold text-white">{h.name}</h4>
                  <div className="mt-1">{getStatusBadge(h.status)}</div>
                </div>
                <button
                  className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded-md hover:bg-[white] hover:text-white transition"
                  title="View History"
                >
                  <FaEye size={16} />
                  View
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HospitalRequest;
