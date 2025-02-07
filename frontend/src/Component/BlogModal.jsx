import React from "react";
import "../styles/BlogBox.css";

const BlogModal = ({
  isModalOpen,
  closeModal,
  handleSubmit,
  title,
  setTitle,
  date,
  setDate,
  imagePreview,
  handleImageUpload,
  text,
  setText,
  locations,
  location,
  setLocation,
  addLocation,

  errorMessage,
  setImagePreview,
  setLocations
}) => {
  if (!isModalOpen) return null;

  
  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };
  return (
    <div>
      <div className="overlay" onClick={closeModal}></div>
      <div className="modal">
        <h3>New Blog Post</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="title-input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
            placeholder="Enter title here..."
          />
        </div>

        <div className="styled-date-input-container">
          <label htmlFor="styled-date-picker">Select a Date:</label>
          <input
            type="date"
            id="styled-date-picker"
            className="styled-date-input"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="upload-box-container">
          {imagePreview && (
            <div className="image-edit-container">
              <label htmlFor="imageInput">
                <img
                  className="image-preview"
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "500px",
                    maxHeight: "500px",
                    objectFit: "cover",
                  }}
                />
              </label>
            </div>
          )}
          {!imagePreview && (
            <label htmlFor="imageInput" className="upload-box">
              Upload Image
            </label>
          )}
          <input
            className="hide"
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="textflex">
          <p>Story</p>
          <textarea
            id="large-textbox"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
          ></textarea>
        </div>

        <div className="locations-list">
          {locations.map((loc, index) => (
            <div key={index} className="location-item">
              <span className="location-text">{loc}</span>
              <button
                className="remove-location-btn"
                onClick={() => removeLocation(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="container">
          <input
            className="add-location-btn"
            type="text"
            value={location}
            placeholder="Add Location"
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="add-icon" onClick={addLocation}>
            +
          </button>
        </div>

        <button className="close-button" onClick={handleSubmit}>
          Post
        </button>
        <button className="close-button" type="button" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BlogModal;
