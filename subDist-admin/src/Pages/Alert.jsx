import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

const Alert = () => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("low");

  const [pastAlerts, setPastAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alerting, setAlerting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPastAlerts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const location = user.sub_dist;

      const response = await fetch(
        `http://localhost:3000/api/alert/getAlerts/${location}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setPastAlerts(data.alerts || []);
    } catch (error) {
      console.error("Error fetching past alerts:", error);
    }
  };

  useEffect(() => {
    fetchPastAlerts();
  }, []);

  const filteredAlerts = pastAlerts.filter((c) =>
    c.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const sub_dist = user.sub_dist;

  const handleSubmit = async () => {
    if (!message || !severity || !location) return;

    const token = localStorage.getItem("token");

    try {
      setAlerting(true);
      const res = await fetch("http://localhost:3000/api/admin/addAlert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, severity, location: sub_dist }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit alert");
      }

      await res.json();
      fetchPastAlerts();
      setMessage("");
      setSeverity("low");

      toast.success("Alert submitted successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting alert:", error);
      toast.error("Error submitting alert. Please try again.");
    } finally {
      setAlerting(false);
    }
  };

  const getSeverityBadge = (level) => {
    const base = "text-xs px-2 py-1 rounded-full font-semibold";
    switch (level) {
      case "high":
        return `${base} bg-red-100 text-red-800`;
      case "medium":
        return `${base} bg-yellow-100 text-yellow-800`;
      default:
        return `${base} bg-blue-100 text-blue-800`;
    }
  };

  const handleDelete = async (alertId) => {
    const token = localStorage.getItem("token");

    try {
      // Show confirmation before deletion
      if (window.confirm("Are you sure you want to delete this Alert?")) {
        await axios.delete(
          `http://localhost:3000/api/admin/deleteAlert/${alertId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter out the deleted campaign from the state
        setPastAlerts(pastAlerts.filter((alert) => alert.id !== alertId));

        toast.success("Alert deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting Alert", error);
      toast.error("Failed to delete Alert. Please try again.");
    }
  };

  return (
    <div className="px-10 py-4 mx-auto bg-white max-w-full min-h-screen shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0990A5]">Alert Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0990A5] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#087C8A] transition"
        >
          Add Alert
        </button>
      </div>

      {/* Alerts List */}
      <div>
        <h2 className="text-2xl font-semibold text-[#0990A5] mb-4">
          Past Alerts
        </h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
          <input
            type="text"
            placeholder="Search Alert by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
          />
        </div>
        {filteredAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedAlerts.map((alert, index) => (
              <div
                key={index}
                className="relative p-4 rounded-lg shadow-md border bg-gray-50 border-gray-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-lg text-gray-800">
                    {alert.message}
                  </span>
                  <span className={getSeverityBadge(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Location: {alert.location}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="absolute bottom-3 right-3 p-2 text-red-700 mt-8"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No past alerts available.</p>
        )}
      </div>
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#0990A5] text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#0990A5] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-6 w-[90%] md:w-[500px] rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl text-red-600 font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#0990A5] text-center">
              New Alert
            </h2>
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                placeholder="Enter alert message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <select
                className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="text"
                className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                value={sub_dist}
                readOnly
              />

              <button
                onClick={handleSubmit}
                disabled={alerting}
                className={`w-full py-3 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087C8A] transition-all flex items-center justify-center gap-2 ${
                  alerting
                    ? "bg-[#087C8A] cursor-not-allowed opacity-75"
                    : "bg-[#0990A5] hover:bg-[#087C8A] text-white"
                }`}
              >
                {alerting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Sending Alert...</span>
                  </>
                ) : (
                  "Send Alert"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }} // this ensures it's on top of modal
      />
    </div>
  );
};

export default Alert;
