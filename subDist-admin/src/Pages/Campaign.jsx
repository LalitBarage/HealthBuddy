import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main";

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
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/alert/getCampaigns",
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

      await axios.post("http://localhost:3000/api/alert/addCampaign", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(payload);

      fetchCampaigns();
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Campaigns</h1>

      <button
        onClick={() => setShowPopup(true)}
        className="py-2 px-4 rounded text-white"
        style={{ backgroundColor: "#0990A5" }}
      >
        + Add Campaign
      </button>

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add New Campaign</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="title"
                placeholder="Campaign Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Campaign Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded"
              />

              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="link"
                placeholder="Campaign Link"
                value={formData.link}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded text-white"
                style={{ backgroundColor: "#0990A5" }}
              >
                Save Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Existing Campaigns</h2>
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
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
              <strong>Start:</strong> {campaign.start_date} |{" "}
              <strong>End:</strong> {campaign.end_date}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaign;
