import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const DocumentButtons = ({ documents, onView }) => {
  const docLabels = {
    incomeTax: "Income Tax",
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
    const fetchSchemes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const subdist = user.sub_dist;
        console.log("Sub Dist:", subdist);
        const res = await fetch(
          `http://localhost:3000/api/admin/getSchemeBySubDist/${subdist}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log("Raw response:", data);

        const formatted = data.schemes.map((item) => {
          const mappedStatus = item.status ? "Accepted" : "Pending";

          const formattedItem = {
            id: item.apscid,
            name: `PID-${item.pid} | SCID-${item.scid}`,
            status: mappedStatus,
            documents: {
              incomeTax: item.income_cert_url,
              casteCertificate: item.caste_cert_url,
              electricityBill: item.ele_bill_url,
              bankPassbook: item.bank_passbook_url,
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

    fetchSchemes();
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
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    if (newStatus === "Accepted" || newStatus === "Rejected") {
      await updateStatusInBackend(id, newStatus);
    }
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full ${colorMap[status]}`}
      >
        {status}
      </span>
    );
  };

  const pendingRequests = requests.filter(
    (r) => r.status === "Pending" // Only show requests with "Pending" status
  );

  const pastRequests = requests.filter(
    (r) => r.status === "Accepted" // Only show requests with "Accepted" status
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
            Accepted requests
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
