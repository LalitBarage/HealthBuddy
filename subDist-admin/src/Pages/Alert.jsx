import React, { useState, useEffect } from "react";

const Alert = () => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("low");
  const [location, setPincode] = useState("");
  const [pastAlerts, setPastAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      setPastAlerts(data.alerts);
    } catch (error) {
      console.error("Error fetching past alerts:", error);
    }
  };

  useEffect(() => {
    fetchPastAlerts();
  }, []);

  const handleSubmit = () => {
    if (!message || !severity || !location) return;

    fetch("http://localhost:3000/api/admin/addAlert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ message, severity, location }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchPastAlerts();
        setMessage("");
        setSeverity("low");
        setPincode("");
        setShowModal(false);
      })
      .catch((error) => console.error("Error submitting alert:", error));
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

  return (
    <div className="p-6 mx-auto bg-white max-w-full min-h-screen shadow-xl">
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
        {pastAlerts.length > 0 ? (
          <ul className="space-y-4">
            {pastAlerts.map((alert, index) => (
              <li
                key={index}
                className="p-4 rounded-lg shadow-md border bg-gray-50 border-gray-200"
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No past alerts available.</p>
        )}
      </div>

      {/* Add Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-40 z-50 flex items-center justify-center">
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
                className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-[#0990A5] text-white font-semibold rounded-lg hover:bg-[#087C8A] focus:outline-none focus:ring-2 focus:ring-[#087C8A]"
              >
                Submit Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alert;
