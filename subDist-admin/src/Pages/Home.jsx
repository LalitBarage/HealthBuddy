import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Home = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDays, setFilterDays] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));
  const subDist = user.sub_dist;

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/admin/diseaseCount/Chiplun",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setRawData(data.diseaseCount);
      } catch (err) {
        console.error("Error fetching disease data:", err);
      }
    };

    fetchDiseaseData();
  }, []);

  useEffect(() => {
    const now = new Date();

    const filtered = rawData.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      if (filterDays === "1") {
        return (now - entryDate) / (1000 * 60 * 60 * 24) <= 1;
      } else if (filterDays === "7") {
        return (now - entryDate) / (1000 * 60 * 60 * 24) <= 7;
      }
      return true;
    });

    const countMap = {};
    filtered.forEach((item) => {
      const disease = item.diseases.trim();
      countMap[disease] = (countMap[disease] || 0) + 1;
    });

    const chartData = Object.keys(countMap).map((disease) => ({
      diseases: disease,
      count: countMap[disease],
    }));

    setFilteredData(chartData);
  }, [filterDays, rawData]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-semibold mb-6 text-[#0990A5]">
        Disease Cases in {subDist}
      </h2>

      {/* Dropdown for Filter */}
      <div className="mb-6">
        <label htmlFor="filterDays" className="text-lg font-semibold mr-4">
          Filter by:
        </label>
        <select
          id="filterDays"
          value={filterDays}
          onChange={(e) => setFilterDays(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="1">Last 1 Day</option>
          <option value="7">Last 7 Days</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full max-w-4xl">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="diseases" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FF6B6B" name="Number of Cases" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
