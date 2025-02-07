import React,{useState}from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import axios from 'axios';
function SignUp() {
  const navigate = useNavigate();
  const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[email,setEmail]=useState('');
    const[message,setMessage]=useState('');
  const goToLogin = () => {
    navigate("/");
  };
  const handleSubmit= async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/signup', { username,email,password });

      // Redirect to HomePage if login is successful
      alert(response.data.message);
      navigate(`/HomePage?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(`Email already exists`);
    }
  };
  return (
    <div className="container">
      <div className="left">
        <img
          alt="A scenic view of an island"
          height="600"
          src="https://storage.googleapis.com/a1aa/image/IczvP6jeT00tWqxm9cr2lExynv2vIepCIl8X1EvYkmEDIsCUA.jpg"
          width="450"
        />
        <div className="text">
          <h1>Join the Adventure</h1>
          <p>Create an account to start documenting your travels.</p>
        </div>
      </div>
      <div className="right">
        <h2>SignUp</h2>
        <form onSubmit={handleSubmit}>
        <input placeholder="Username" type="text" required onChange={(e)=>{setUsername(e.target.value)}}/>
        <input placeholder="Email" type="email" required onChange={(e)=>{setEmail(e.target.value)}} />
        <input placeholder="Password" type="password" required onChange={(e)=>{setPassword(e.target.value)}}/>
        <div className="error">{message}</div>
        <button className="btn btn-primary" type="submit">CREATE ACCOUNT</button>
        </form>
        <div className="or">Or</div>
        <button className="btn btn-secondary" onClick={goToLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
}

export default SignUp;
