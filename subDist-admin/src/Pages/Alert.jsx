import React, { useState, useEffect } from "react";

const Alert = () => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("low");
  const [location, setPincode] = useState("");
  const [pastAlerts, setPastAlerts] = useState([]);

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
      console.log(data);
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
      })
      .catch((error) => console.error("Error submitting alert:", error));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#0990A5]">
        Alert Management
      </h1>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          className="w-full p-4 border border-[#0990A5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0990A5] bg-gray-50"
          placeholder="Enter alert message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <select
          className="w-full p-4 border border-[#0990A5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0990A5] bg-gray-50"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          className="w-full p-4 border border-[#0990A5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0990A5] bg-gray-50"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full py-3 text-white font-semibold rounded-lg bg-[#0990A5] hover:bg-[#087C8A] focus:outline-none focus:ring-2 focus:ring-[#087C8A]"
        >
          Submit Alert
        </button>
      </div>

      {/* Display Past Alerts */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-[#0990A5] mb-4">
          Past Alerts
        </h2>
        {pastAlerts.length > 0 ? (
          <ul className="space-y-4">
            {pastAlerts.map((alert, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg shadow-md border ${
                  alert.severity === "low"
                    ? "bg-blue-100 border-blue-300"
                    : alert.severity === "medium"
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0990A5]">
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Location: {alert.location}
                  </span>
                </div>
                <p>{alert.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No past alerts available.</p>
        )}
      </div>
    </div>
  );
};

export default Alert;
