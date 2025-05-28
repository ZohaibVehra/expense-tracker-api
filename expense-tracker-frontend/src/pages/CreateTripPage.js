import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import logo from "../images/logo.png";

function CreateTripPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/trips", { name, startDate, endDate });
      navigate(`/trip/${response.data.id}`);
    } catch (err) {
      console.error("Failed to save trip", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#101120] text-white">
      <Sidebar showTopBar={true} />

      <main className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-[#16172A] p-6 rounded-lg shadow-md w-full max-w-md space-y-4 text-center"
        >
          <img src={logo} alt="Logo" className="mx-auto h-20 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Create New Trip</h2>

          <div className="text-left">
            <label className="block mb-1">Trip Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
            />
          </div>

          <div className="text-left">
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
            />
          </div>

          <div className="text-left">
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            Create Trip
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateTripPage;
