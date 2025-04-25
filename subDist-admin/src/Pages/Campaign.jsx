import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/du2pijo5y/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_pdf_upload";

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const location = user.sub_dist;
      const response = await axios.get(
        `http://localhost:3000/api/alert/getCampaigns/${location}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setCampaigns(
        Array.isArray(response.data.campaigns) ? response.data.campaigns : []
      );
    } catch (error) {
      console.error("Error fetching campaigns", error);
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImageToCloudinary = async () => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", "du2pijo5y");

    const res = await axios.post(CLOUDINARY_URL, data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    console.log(token);

    try {
      setUploading(true);

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary();
      }

      const payload = {
        name: formData.title,
        description: formData.description,
        image_url: imageUrl,
        startDate: formData.start_date,
        endDate: formData.end_date,
        link: formData.link,
      };

      console.log(payload);
      const user = JSON.parse(localStorage.getItem("user"));
      const location = user.sub_dist;
      await axios.post(
        `http://localhost:3000/api/alert/addCampaign/${location}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(payload);

      fetchCampaigns();
      toast.success("Campaign added successfully!");
      setShowPopup(false);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        start_date: "",
        end_date: "",
        link: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding campaign", error);
      toast.error("Failed to add campaign. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    const token = localStorage.getItem("token");

    try {
      // Show confirmation before deletion
      if (window.confirm("Are you sure you want to delete this campaign?")) {
        await axios.delete(
          `http://localhost:3000/api/alert/deleteCampaign/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter out the deleted campaign from the state
        setCampaigns(
          campaigns.filter((campaign) => campaign.id !== campaignId)
        );

        toast.success("Campaign deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting campaign", error);
      toast.error("Failed to delete campaign. Please try again.");
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Campaigns</h1>

        <button
          onClick={() => setShowPopup(true)}
          className="py-2 px-4 rounded text-white"
          style={{ backgroundColor: "#0990A5" }}
        >
          + Add Campaign
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
          <input
            type="text"
            placeholder="Search campaigns by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
          />
        </div>

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
                Add New Campaign
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Campaign Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Campaign Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                />

                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                  required
                />
                <input
                  type="text"
                  name="link"
                  placeholder="Campaign Link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#0990A5] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0990A5]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#0990A5" }}
                  disabled={uploading}
                >
                  {uploading ? (
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
                      Saving...
                    </>
                  ) : (
                    "Save Campaign"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-8 mb-4">Existing Campaigns</h2>
        <div className="grid gap-4">
          {paginatedCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border rounded p-4 shadow hover:shadow-lg transition relative" // Added relative for positioning the delete button
            >
              <h3 className="text-xl font-bold">{campaign.title}</h3>
              <p className="text-gray-700">{campaign.description}</p>
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.title}
                  className="w-full h-48 object-cover my-2 rounded"
                />
              )}
              <p>
                <strong>Start:</strong>{" "}
                {new Date(campaign.start_date).toISOString().slice(0, 10)} |{" "}
                <strong>End:</strong>{" "}
                {new Date(campaign.end_date).toISOString().slice(0, 10)}
              </p>

              {campaign.link && (
                <a
                  href={campaign.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0990A5] underline mt-2 inline-block"
                >
                  Learn More
                </a>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(campaign.id)}
                className="absolute bottom-3 right-3 p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <FiTrash2 size={20} /> {/* Display trash icon */}
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

export default Campaign;
