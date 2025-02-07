import React ,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import axios from 'axios';
function Login() {
  const navigate = useNavigate();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[message,setMessage]=useState('');
  const goToSignUp = () => {
    navigate("/SignUp");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://blog-app-0459.onrender.com/api/login', {email, password });

      // Redirect to HomePage if login is successful
      setMessage(response.data.message);
      navigate(`/HomePage?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(`Invalid Credentials`);
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <input placeholder="Email..." type="text" onChange={(e)=>{setEmail(e.target.value)}}/>
        <input placeholder="Password..." type="password" onChange={(e)=>{setPassword(e.target.value)}} />
        <div className="error">{message}</div>
        <button className="btn btn-primary" type="submit">LOGIN</button>
        </form>
        <div className="or">Or</div>
        <button className="btn btn-secondary" onClick={goToSignUp}>
          CREATE ACCOUNT
        </button>
      </div>
    </div>
  );
}

export default Login;
