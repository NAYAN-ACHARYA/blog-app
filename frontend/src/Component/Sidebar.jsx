import React, { useState } from "react";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
function Sidebar({email}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const navigate=useNavigate();
  const home=()=>{
    navigate(`/HomePage?email=${encodeURIComponent(email)}`);
  }
  const myBlog=()=>{
    navigate(`/MyBlog?email=${encodeURIComponent(email)}`);
  }
  return (
    <div>
      {/* Button to toggle the sidebar */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "Close" : "Open"} Sidebar
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="button-group">
          <button className="sidebar-btn" onClick={home}>Explore</button>
          <button className="sidebar-btn" onClick={myBlog} >My Blogs</button>
          <button className="sidebar-btn">Contact Us</button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default Sidebar;
