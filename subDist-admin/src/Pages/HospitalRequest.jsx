import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const DocumentButtons = ({ documents, onView }) => {
  const docLabels = {
    hospitalcertificate: "hospital certificate",
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
          {docLabels[key]}
        </button>
      ))}
    </div>
  );
};

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const subdist = user.sub_dist;
        console.log("Sub Dist:", subdist);

        const res = await fetch(
          `http://localhost:3000/api/admin/getHospitalRequests/Chiplun`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log("Raw response:", data);

        const formatted = data.hospitals.map((item) => {
          const mappedStatus =
            item.status === true
              ? "Accepted"
              : item.status === false
              ? "Rejected"
              : "Pending";

          const formattedItem = {
            id: item.apscid,
            name: `Hospital Name-${item.hname}`,
            status: mappedStatus,
            documents: {
              hospitalcertificate: item.document_url,
            },
          };

          console.log("Formatted item:", formattedItem);
          return formattedItem;
        });

        setRequests(formatted);
        console.log("All formatted requests:", formatted);
      } catch (error) {
        console.error("Error fetching scheme data:", error);
      }
    };

    fetchHospitals();
  }, []);

  const updateStatusInBackend = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/updateSchemeStatus/${id}`,
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
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Update the status locally first
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    // Handle the backend status change
    if (newStatus === "Accepted" || newStatus === "Rejected") {
      await updateStatusInBackend(id, newStatus === "Accepted");
    }
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

  // Filter the requests for pending and past requests
  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const pastRequests = requests.filter(
    (r) => r.status === "Accepted" || r.status === "Rejected"
  );

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0990a5]">Pending Requests</h2>
        <button
          className="bg-[#0ba9bb] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#0990a5] transition"
          onClick={() => setShowHistory((prev) => !prev)}
        >
          {showHistory ? "Hide History" : "Past History"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
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
              <DocumentButtons
                documents={req.documents}
                onView={setSelectedDocUrl}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending requests found.</p>
        )}
      </div>

      {showHistory && (
        <>
          <h3 className="text-2xl font-bold text-[#0ba9bb] mt-12 mb-4">
            Past Requests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pastRequests.length > 0 ? (
              pastRequests.map((h) => (
                <div
                  key={h.id}
                  className="bg-[#7dc6ce] rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
                >
                  <h4 className="text-xl font-semibold text-white">{h.name}</h4>
                  <div className="mt-1">{getStatusBadge(h.status)}</div>
                  <DocumentButtons
                    documents={h.documents}
                    onView={setSelectedDocUrl}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No past requests found.</p>
            )}
          </div>
        </>
      )}

      {/* PDF Modal Viewer */}
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

export default Request;
