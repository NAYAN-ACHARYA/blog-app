import React, { useState, useEffect } from "react";
import "../styles/Blog.css";
import "../styles/BlogBox.css";
import axios from "axios";
//this file for myblogs
const Blog2 = ({ activeBlog, setActiveBlog, editOption, setBlogs, blogs }) => {
  const [editMode, setEditMode] = useState(0);
  const [localTitle, setLocalTitle] = useState(activeBlog.title || "");
  const [localDate, setLocalDate] = useState(activeBlog.date || "");
  const [localText, setLocalText] = useState(activeBlog.text || "");
  const [localLocations, setLocalLocations] = useState([...activeBlog.locations] || []);
  const [localImagePreview, setLocalImagePreview] = useState(activeBlog.imagePath || "");
  const [localEmail, setLocalEmail] = useState(activeBlog.email || "");
  const [localImage, setLocalImage] = useState(activeBlog.imagePath || null);
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blog-app-0459.onrender.com/api/userblogs", { params: { email: localEmail } });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (activeBlog.imagePath) {
      setLocalImage(activeBlog.imagePath);
      setLocalImagePreview(activeBlog.imagePath);
    }
  }, [activeBlog.imagePath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localTitle || !localText || !localDate) {
      setErrorMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", localTitle);
    formData.append("text", localText);
    formData.append("date", localDate);
    formData.append("locations", localLocations);
    formData.append("email", localEmail);

    if (localImage instanceof File) {
      formData.append("image", localImage);
    } else {
      formData.append("imagePath", localImage);
    }

    try {
      await axios.put(`https://blog-app-0459.onrender.com/api/update/${activeBlog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setActiveBlog(null);
      const updatedBlogs = await axios.get("https://blog-app-0459.onrender.com/api/userblogs", { params: { email: localEmail } });
      setBlogs(updatedBlogs.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error updating blog");
      window.alert(error);
    }
  };

  const handleImageUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLocalImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLocalImage(file);
    }
  };

  return (
    <div>
      <div className="overlay" onClick={() => setActiveBlog(null)}></div>
      <div className="modal">
        <h3>New Blog Post</h3>
        {editOption === 1 && (
          <button className="edit-btn" onClick={() => setEditMode(1)}>
            Edit
          </button>
        )}
        {editMode === 1 ? (
          <>
            <input
              type="text"
              className="title-input"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
            />
            <input
              type="date"
              className="styled-date-input"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
            />
            <div className="upload-box-container">
              <label htmlFor="imageInput">
                <img
                  className="image-preview"
                  src={localImagePreview}
                  alt="Preview"
                  style={{ maxWidth: "500px", maxHeight: "500px", objectFit: "cover" }}
                />
              </label>
            </div>
            <input
              className="hide"
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageUpdate}
            />
            <textarea
              id="large-textbox"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
            ></textarea>
            <input
              className="add-location-btn"
              type="text"
              placeholder="Add Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="add-icon" onClick={() => {
              if (location) {
                setLocalLocations([...localLocations, location]);
                setLocation("");
              }
            }}>+</button>
            {localLocations.map((loc, index) => (
              <div key={index} className="location-item">
                <span className="location-text">{loc}</span>
                <button className="remove-location-btn" onClick={() => setLocalLocations(localLocations.filter((_, i) => i !== index))}>
                  &times;
                </button>
              </div>
            ))}
            <button className="close-button" onClick={handleSubmit}>Post</button>
            <button className="close-button" onClick={() => setActiveBlog(null)}>Close</button>
          </>
        ) : (
          <>
            <p className="title-input">{activeBlog.title}</p>
            <div>{new Date(activeBlog.date).toLocaleDateString()}</div>
            <img src={activeBlog.imagePath} alt="Uploaded" />
            <p>Story</p>
            <p>{activeBlog.text}</p>
            <div>{activeBlog.locations.map((loc, index) => <div key={index}>{loc}</div>)}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog2;
