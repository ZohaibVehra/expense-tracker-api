import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye } from "lucide-react";
import logo from "../images/logo.png";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const registerButtonRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      registerButtonRef.current.click();
    }
  };

  const handleRegister = async () => {
    setMessage("");

    if (!username || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users", {
        username,
        password,
      });

      setSuccess(true);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("Username already exists.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#16172A] p-10 rounded-xl shadow-md w-full max-w-md space-y-6 text-white border border-[#2b2c3d]">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Logo" className="mx-auto h-24 mb-4" />
          <h1 className="text-2xl font-bold text-white">Register</h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-2 text-sm rounded border ${
              success
                ? "bg-green-100 text-green-700 border-green-400"
                : "bg-red-100 text-red-700 border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-[#2f3146] rounded bg-[#1b1c2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7df9ff]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Password */}
        <div className="relative">
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

        {/* Confirm Password */}
        <div className="relative mt-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Retype Password"
            className="w-full px-4 py-2 border border-[#2f3146] rounded bg-[#1b1c2e] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7df9ff]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
          <button
            ref={registerButtonRef}
            onClick={handleRegister}
            className="bg-[#D5F942] text-black font-semibold py-2 rounded hover:bg-[#cbe93a] transition-all"
          >
            Register
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#1c1e3b] text-white font-semibold py-2 rounded hover:bg-[#1c1e3b] transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
