import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";
import { Eye } from 'lucide-react';
import logo from '../images/logo.png';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  const loginButtonRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loginButtonRef.current.click(); // Simulate login button click
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://expensetrackerfinal-env.eba-gmy2c8ig.ca-central-1.elasticbeanstalk.com/auth/login', {
        username,
        password,
      });

      const token = response.data.token;
      console.log(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid username or password");
        setUsername("");
        setPassword("");
      } else {
        setErrorMessage("Something went wrong. Try again later.");
      }
    }
  };

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        navigate("/dashboard");
    }
    }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#16172A] p-10 rounded-xl shadow-md w-full max-w-md space-y-6 text-white border border-[#2b2c3d]">
        {/* Logo */}
        <div className="text-center">
            <img src={logo} alt="Logo" className="mx-auto h-24 mb-4" />
            <h1 className="text-2xl font-bold text-white">Login</h1>
        </div>

        {/* Error message */}
        {errorMessage && (
            <div className="bg-red-100 text-red-700 border border-red-400 rounded px-4 py-2 text-sm mb-2">
            {errorMessage}
            </div>
        )}

        {/* Username Input */}
        <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border border-[#2f3146] rounded bg-[#1b1c2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7df9ff]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
        />

        {/* Password Input + Eye */}
        <div className="relative mt-4">
            <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border border-[#2f3146] rounded bg-[#1b1c2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7df9ff]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            >
            <Eye className="w-5 h-5" />
            </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
        <button
            ref={loginButtonRef}
            onClick={handleLogin}
            className="bg-[#D5F942] text-black font-semibold py-2 rounded hover:bg-[#cbe93a] transition-all"
        >
            Login
        </button>
        <button
            onClick={() => navigate("/register")}
            className="bg-[#1c1e3b] text-white font-semibold py-2 rounded hover:bg-[#1c1e3b] transition-all"
        >
            Register
        </button>
        </div>
        </div>
    </div>
  );
}

export default LoginPage;
