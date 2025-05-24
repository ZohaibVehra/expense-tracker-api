import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";
import { Eye } from 'lucide-react';

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
      const response = await axios.post('http://localhost:8080/auth/login', {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto h-16 mb-4" />
          <h1 className="text-2xl font-bold">Login</h1>
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
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Password Input + Eye */}
        <div className="relative mt-4">
        <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
