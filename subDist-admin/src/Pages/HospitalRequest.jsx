import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const DocumentButtons = ({ documents, onView }) => {
  const docLabels = {
    hospitalcertificate: "Hospital Certificate",
    electricityBill: "Electricity Bill",
    casteCertificate: "Caste Certificate",
    bankPassbook: "Bank Passbook",
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {Object.entries(documents).map(([key, url]) => (
        <button
          key={key}
          onClick={() => onView(url)}
          className="flex items-center gap-2 text-white border border-white px-3 py-1 rounded-md hover:bg-white hover:text-[#0ba9bb] transition text-sm"
        >
          <FaEye size={14} />
          {docLabels[key] || key}
        </button>
      ))}
    </div>
  );
};

const HospitalRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const subdist = user.sub_dist;

        const res = await fetch(
          `https://healthbuddy-ozon.onrender.com/api/admin/getHospitalRequests/${subdist}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        const formatted = data.hospitals.map((item) => {
          const mappedStatus =
            item.status === true
              ? "Accepted"
              : item.status === false
              ? "Rejected"
              : "Pending";

          return {
            id: item.apscid,
            name: `Hospital Name-${item.hname}`,
            status: mappedStatus,
            hid: item.hid,
            pincode: item.pincode,
            documents: {
              hospitalcertificate: item.document_url,
            },
          };
        });

        setRequests(formatted);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      }
    };

    fetchHospitals();
  }, []);

  const updateStatusInBackend = async (hid, status) => {
    try {
      const res = await fetch(
        `https://healthbuddy-ozon.onrender.com/api/admin/updateHospitalStatus/${hid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: status === "Accepted" }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again.");
    }
  };

  const handleStatusChange = async (hid, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.hid === hid ? { ...req, status: newStatus } : req))
    );
    await updateStatusInBackend(hid, newStatus);
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

  const pendingOrRejected = requests.filter(
    (r) => r.status === "Pending" || r.status === "Rejected"
  );
  const acceptedRequests = requests.filter((r) => r.status === "Accepted");

  const filteredAccepted = acceptedRequests.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalAcceptedPages = Math.ceil(filteredAccepted.length / itemsPerPage);
  const paginatedAccepted = filteredAccepted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-10 py-4 bg-white min-h-screen text-black">
      <h2 className="text-3xl font-bold text-[#0990a5] mb-6">
        Pending & Rejected Hospital Requests
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pendingOrRejected.length > 0 ? (
          pendingOrRejected.map((req) => (
            <div
              key={req.hid}
              className={`${
                req.status === "Rejected" ? "bg-red-400" : "bg-[#0ba9bb]"
              } rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition`}
            >
              <h4 className="text-xl font-semibold text-white">{req.name}</h4>
              <div className="flex items-center space-x-3 mt-2">
                <label className="text-white text-sm">Status:</label>
                <select
                  className="rounded px-3 py-1 text-sm focus:outline-none bg-amber-50"
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.hid, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <DocumentButtons
                documents={req.documents}
                onView={setSelectedDocUrl}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No pending or rejected requests found.
          </p>
        )}
      </div>

      <h3 className="text-2xl font-bold text-[#0ba9bb] mt-12 mb-4">
        Accepted Requests by Pincode
      </h3>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paginatedAccepted.length > 0 ? (
          paginatedAccepted.map((h) => (
            <div
              key={h.hid}
              className="bg-[#7dc6ce] rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
            >
              <h4 className="text-xl font-semibold text-white">{h.name}</h4>
              <div className="mt-1 flex justify-between items-center">
                {getStatusBadge(h.status)}
                <span className="text-white text-sm font-medium">
                  Pincode: {h.pincode}
                </span>
              </div>
              <DocumentButtons
                documents={h.documents}
                onView={setSelectedDocUrl}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No accepted requests found.</p>
        )}
      </div>

      {totalAcceptedPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalAcceptedPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#0ba9bb] text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedDocUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-[90%] md:w-[60%] h-[80%] relative">
            <button
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
              onClick={() => setSelectedDocUrl(null)}
            >
              &times;
            </button>
            <embed
              src={selectedDocUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalRequest;
