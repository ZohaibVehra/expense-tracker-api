import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import TripCard from "../components/TripCard";
import searchIcon from "../images/search_button.png";

function DashboardPage() {
  const searchInputRef = useRef();
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [username, setUsername] = useState("");
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowTopBar(currentY <= 10 || currentY < lastScrollY);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/trips/user/trips");
      setTrips(response.data.reverse());
    } catch (err) {
      console.error("Failed to fetch trips", err);
    }
  };

  const fetchFavoriteTrips = async () => {
    try {
      const response = await axios.get("/trips/user/favorites");
      setTrips(response.data.reverse());
    } catch (err) {
      console.error("Failed to fetch favorite trips", err);
    }
  };

  const fetchFutureTrips = async () => {
    try {
        const response = await axios.get("/trips/user/future");
        setTrips(response.data.reverse());
    } catch (err) {
        console.error("Failed to fetch future trips", err);
    }
  };

  const handleShowAllTrips = async () => {
    try {
        const response = await axios.get("/trips/user/trips");
        setTrips(response.data.reverse());
    } catch (err) {
        console.error("Failed to fetch all trips", err);
    }
  };

  const handleSearch = async () => {
    const query = searchInputRef.current?.value.trim();

    if (!query) {
      await fetchTrips(); // If input is empty, reset to all trips
      return;
    }

    try {
      const response = await axios.get(`/trips/user/search?query=${encodeURIComponent(query)}`);
      setTrips(response.data.reverse());
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get("/users/me");
            setUsername(response.data.username);
        } catch (err) {
            console.error("Failed to fetch user info", err);
            navigate("/login"); // Redirect to login if not authenticated
        }
    };

    fetchUser();
    fetchTrips();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        showTopBar={showTopBar}
        onFavoritesClick={fetchFavoriteTrips}
        onAllTripsClick={handleShowAllTrips}
        onFutureTripsClick={fetchFutureTrips}
        />

      <main className="flex-1 bg-[#101120] text-white p-6 pt-[5rem] md:pt-6">
        <div className="mb-8 space-y-6">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search your trips"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full sm:w-1/2 px-4 py-4 text-xl rounded bg-[#1b1c2e] text-white border border-[#2f3146] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D5F942]"
            />
            <img
              src={searchIcon}
              alt="Search"
              onClick={handleSearch}
              className="h-[64px] w-auto mt-4 sm:mt-0 sm:ml-2 object-contain cursor-pointer"
            />
          </div>

          {/* Welcome + Create Button inline */}
          <div className="flex items-center gap-28 flex-wrap sm:ml-[28px]">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {username}
              </h1>
              <p className="text-base text-gray-400 mt-1">
                Explore on a budget
              </p>
            </div>
            <button
                className="font-eras bg-[#D5F566] text-black font-semibold text-lg px-8 py-4 rounded-lg hover:bg-[#cbe93a] mt-2 md:mt-0"
                onClick={() => navigate("/create")}
                >
                Create New Trip
            </button>
          </div>
        </div>

        {/* Trip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trip/${trip.id}`)} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
