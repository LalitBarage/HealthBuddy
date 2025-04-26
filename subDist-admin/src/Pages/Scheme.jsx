import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    scname: "",
    eligibility: "",
    description: "",
    pincode: "",
  });
  const [statusModal, setStatusModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    fetchSchemes();
  }, []);
  const fetchSchemes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const location = user.sub_dist;
      const response = await axios.get(
        `https://healthbuddy-ozon.onrender.com/api/scheme/getSchemes/${location}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setSchemes(response.data || []);
    } catch (error) {
      console.error("Error fetching Scheme", error);
    }
  };

  const filteredSchemes = schemes.filter((c) =>
    c.scname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const paginatedSchemes = filteredSchemes
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .reverse();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openStatusModal = (scheme) => {
    setSelectedScheme(scheme);
    setNewStatus(String(scheme.status).toUpperCase());
    setStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://healthbuddy-ozon.onrender.com/api/admin/hideScheme/${selectedScheme.scid}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated successfully!");
      setStatusModal(false);
      fetchSchemes(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status.");
      console.error("Status update error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    console.log(token);
    console.log(formData);

    try {
      await axios.post(
        `https://healthbuddy-ozon.onrender.com/api/admin/addScheme`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchSchemes();
      toast.success("Scheme added successfully!");
      setShowPopup(false);
      setFormData({
        scname: "",
        description: "",
        eligibility: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Error adding campaign", error);
      toast.error("Failed to add campaign. Please try again.");
    }
  };

  const handleDelete = async (schemeId) => {
    const token = localStorage.getItem("token");

    try {
      // Show confirmation before deletion
      if (window.confirm("Are you sure you want to delete this Scheme?")) {
        await axios.delete(
          `https://healthbuddy-ozon.onrender.com/api/admin/deleteScheme/${schemeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter out the deleted campaign from the state
        setSchemes(schemes.filter((scheme) => scheme.id !== schemeId));

        toast.success("Scheme deleted successfully!");
        fetchSchemes(); // Refresh the list of schemes
      }
    } catch (error) {
      console.error("Error deleting Scheme", error);
      toast.error("Failed to delete Scheme. Please try again.");
    }
  };

  return (
    <>
      <div className="px-10 py-4 bg-white min-h-screen text-black">
        <div className="flex flex-row md:flex-row md:items-center md:justify-between mb-6">
          <input
            type="text"
            placeholder="Search Scheme by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="mt-4 md:mt-0 w-full md:w-1/3 p-2 border border-gray-300 rounded"
          />

          <button
            onClick={() => setShowPopup(true)}
            className="py-2 px-4 rounded text-white"
            style={{ backgroundColor: "#0990A5" }}
          >
            + Add Scheme
          </button>
        </div>

        {/* Add Button Row */}

        {showPopup && (
          <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 w-[90%] md:w-[500px] rounded-lg shadow-lg relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
              >
                &times;
              </button>
              <h2 className="text-2xl text-[#0990A5] font-bold text-center mb-4">
                Add New Scheme
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                  type="text"
                  name="scname"
                  placeholder="Scheme Name"
                  value={formData.scname}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <textarea
                  name="eligibility"
                  placeholder="Scheme Eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Scheme Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#0990A5] text-white font-semibold px-4 py-2 rounded hover:bg-[#0a9aaa] transition"
                >
                  Add Scheme
                </button>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0990a5]">
          Existing Schemes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedSchemes.map((scheme) => (
            <div
              key={scheme.scid}
              className="border rounded p-4 shadow hover:shadow-lg transition relative" // Added relative for positioning the delete button
            >
              <h3 className="text-xl font-bold">{scheme.scname}</h3>
              <p className="text-gray-700">Description: {scheme.description}</p>
              <p className="text-gray-700">Eligibility: {scheme.eligibility}</p>
              <p className="text-gray-700">
                Status: {scheme.status ? "Open" : "Closed"}
              </p>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(scheme.scid)}
                className="absolute bottom-3 right-3 p-3 text-red-700"
              >
                <FiTrash2 size={20} /> {/* Display trash icon */}
              </button>
              <button
                onClick={() => openStatusModal(scheme)}
                className="absolute top-3 right-3 p-3 text-blue-600"
              >
                <FiEdit size={18} />
              </button>
            </div>
          ))}
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
      </div>
      {statusModal && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[90%] md:w-[400px] rounded-lg shadow-lg relative">
            <button
              onClick={() => setStatusModal(false)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-[#0990A5] mb-4 text-center">
              Change Scheme Status
            </h2>
            <div className="flex flex-col gap-4">
              <label className="text-sm">Select Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="p-2 border border-[#0990A5] rounded"
              >
                <option value="TRUE">Open</option>
                <option value="FALSE">Closed</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="bg-[#0990A5] text-white py-2 px-4 rounded hover:bg-[#0a9aaa]"
              >
                Update Status
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
    </>
  );
};

export default Scheme;
