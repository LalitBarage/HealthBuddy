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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#FF6B6B",
  "#4BC0C0",
  "#36A2EB",
  "#FFCE56",
  "#7E57C2",
  "#009688",
];

const Home = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [diseaseTrends, setDiseaseTrends] = useState([]);
  const [filterDays, setFilterDays] = useState("all");
  const [analysisType, setAnalysisType] = useState("default");
  const [selectedDisease, setSelectedDisease] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const subDist = user.sub_dist;

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const location = user.sub_dist;
        const res = await fetch(
          `http://localhost:3000/api/admin/diseaseCount/${location}`,
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
      if (filterDays === "1")
        return (now - entryDate) / (1000 * 60 * 60 * 24) <= 1;
      if (filterDays === "7")
        return (now - entryDate) / (1000 * 60 * 60 * 24) <= 7;
      return true;
    });

    const countMap = {};
    const trendMap = {};

    filtered.forEach((item) => {
      const disease = item.diseases.trim();
      const dateKey = new Date(item.createdAt).toLocaleDateString();

      countMap[disease] = (countMap[disease] || 0) + 1;

      if (!trendMap[disease]) trendMap[disease] = {};
      trendMap[disease][dateKey] = (trendMap[disease][dateKey] || 0) + 1;
    });

    let chartData = Object.keys(countMap).map((disease) => ({
      diseases: disease,
      count: countMap[disease],
    }));

    if (analysisType === "top") {
      chartData = chartData.sort((a, b) => b.count - a.count).slice(0, 5);
    } else if (analysisType === "least") {
      chartData = chartData.sort((a, b) => a.count - b.count).slice(0, 5);
    } else if (analysisType === "alpha") {
      chartData = chartData.sort((a, b) =>
        a.diseases.localeCompare(b.diseases)
      );
    }

    const trendData = selectedDisease
      ? Object.entries(trendMap[selectedDisease] || {}).map(
          ([date, count]) => ({
            date,
            count,
          })
        )
      : [];

    setFilteredData(chartData);
    setDiseaseTrends(trendData);
  }, [filterDays, rawData, analysisType, selectedDisease]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#0990A5] mb-10">
          Disease Dashboard - {subDist}
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div>
            <label className="font-semibold mr-2">Time Filter:</label>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="all">All Time</option>
              <option value="1">Last 1 Day</option>
              <option value="7">Last 7 Days</option>
            </select>
          </div>
          <div>
            <label className="font-semibold mr-2">Analysis Type:</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="default">All Diseases</option>
              <option value="top">Top 5 Diseases</option>
              <option value="least">Least 5 Diseases</option>
              <option value="alpha">Alphabetical Order</option>
            </select>
          </div>
          <div>
            <label className="font-semibold mr-2">Select Disease:</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="">None</option>
              {filteredData.map((item) => (
                <option key={item.diseases} value={item.diseases}>
                  {item.diseases}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Disease Count (Bar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diseases" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FF6B6B" name="Number of Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Disease Distribution (Pie Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData}
                  dataKey="count"
                  nameKey="diseases"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart for Disease Trend */}
        {selectedDisease && diseaseTrends.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Trend for {selectedDisease} (Line Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={diseaseTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#36A2EB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
