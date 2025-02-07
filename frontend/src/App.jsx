
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import MyBlog from "./pages/MyBlog";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/MyBlog" element={<MyBlog/>}/>
    </Routes>
  );
}

export default App;
