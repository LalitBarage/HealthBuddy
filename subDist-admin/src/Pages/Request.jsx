import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

// Reusable Component for Document Buttons
const DocumentButtons = ({ documents }) => {
  const docLabels = {
    incomeTax: "Income Tax",
    electricityBill: "Electricity Bill",
    casteCertificate: "Caste Certificate",
    bankPassbook: "Bank Passbook",
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {Object.entries(documents).map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white border border-white px-3 py-1 rounded-md hover:bg-white hover:text-[#0ba9bb] transition text-sm"
        >
          <FaEye size={14} />
          {docLabels[key]}
        </a>
      ))}
    </div>
  );
};

const Request = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Lalit Barage",
      status: "Pending",
      documents: {
        incomeTax: "#",
        electricityBill: "#",
        casteCertificate: "#",
        bankPassbook: "#",
      },
    },
    {
      id: 2,
      name: "Saurabh Shelake",
      status: "Pending",
      documents: {
        incomeTax: "#",
        electricityBill: "#",
        casteCertificate: "#",
        bankPassbook: "#",
      },
    },
  ]);

  const [showHistory, setShowHistory] = useState(false);
  const [history] = useState([
    {
      id: 101,
      name: "Atharva Bhuwad",
      status: "Accepted",
      documents: {
        incomeTax: "#",
        electricityBill: "#",
        casteCertificate: "#",
        bankPassbook: "#",
      },
    },
    {
      id: 102,
      name: "Aman Naikwadi",
      status: "Rejected",
      documents: {
        incomeTax: "#",
        electricityBill: "#",
        casteCertificate: "#",
        bankPassbook: "#",
      },
    },
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
        <h2 className="text-3xl font-bold text-[#0990a5]">Pending Requests</h2>
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
            className="bg-[#0ba9bb] rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
          >
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
            <DocumentButtons documents={req.documents} />
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
                className="bg-[#7dc6ce] rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-white">{h.name}</h4>
                <div className="mt-1">{getStatusBadge(h.status)}</div>
                <DocumentButtons documents={h.documents} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Request;
