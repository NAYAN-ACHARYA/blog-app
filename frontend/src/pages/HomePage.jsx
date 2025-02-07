import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";
import "../styles/BlogBox.css";
import Blog from '../Component/Blog';
import Header from "../Component/Header";
import BlogList from "../Component/BlogList";
import BlogModal from "../Component/BlogModal";
import SideBar from "../Component/Sidebar"
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [editOption, setEditOption] = useState(0);

  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const email = queryParams.get("email");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (activeBlog) {
      setEditOption(0); // Reset edit mode when a new blog is selected
    }
  }, [activeBlog]);

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setText("");
    setImage(null);
    setErrorMessage("");
    setImagePreview(null);
    setLocations([]);
    setDate("");
  };

  const signout = () => {
    navigate(`/`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setImage(file);
  };

  const addLocation = () => {
    if (location) {
      setLocations([...locations, location]);
      setLocation("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !text || !image || !date) {
      setErrorMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("date", date);
    formData.append("image", image);
    formData.append("locations", locations);
    formData.append("email", email);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data.message);
      closeModal();
      const updatedBlogs = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(updatedBlogs.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error uploading data";
      setErrorMessage(errorMessage);
      console.error("Error:", errorMessage);
    }
  };

  return (
    <>
      <div className="header-parent">
        <SideBar email={email} />
        <div className="header">All Blogs</div>
        <button className="amazon-logout-button" onClick={signout}>
          Sign Out
        </button>
      </div>

      <div className="boody">
        <button className="plus-button" onClick={() => setIsModalOpen(true)}>
          +
        </button>
        
        <BlogModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          text={text}
          setText={setText}
          locations={locations}
          location={location}
          setLocation={setLocation}
          addLocation={addLocation}
          errorMessage={errorMessage}
          setImagePreview={setImagePreview}
          setLocations={setLocations}
        />

        <BlogList blogs={blogs} setActiveBlog={setActiveBlog} />
      </div>

      {activeBlog && (
        <Blog
          activeBlog={activeBlog}
          setActiveBlog={setActiveBlog}
          editOption={editOption}
          setBlogs={setBlogs} // Ensure the blog list updates on edit
          blogs={blogs}
        />
      )}
    </>
  );
};

export default HomePage;
