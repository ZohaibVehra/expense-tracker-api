import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import logo from "../images/logo.png";
import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';

function TripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [filterOption, setFilterOption] = useState("ALL");

  const today = new Date().toISOString().split("T")[0];
  const [expenseDate, setExpenseDate] = useState(today);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [showCoverModal, setShowCoverModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchTripAndExpenses = async () => {
      try {
        const tripResponse = await axios.get(`/trips/${id}`);
        setTrip(tripResponse.data);
        setName(tripResponse.data.name);
        setStartDate(tripResponse.data.startDate);
        setEndDate(tripResponse.data.endDate);

        const expenseResponse = await axios.get(`/expenses/trip/${id}`);
        setExpenses(expenseResponse.data);
      } catch (err) {
        console.error("Failed to load trip or expenses", err);
      }
    };

    fetchTripAndExpenses();
  }, [id, navigate]);

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setExpenses(expenses.filter((e) => e.id !== expenseId));
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseAmount || !expenseCategory || !expenseDate) return;

    try {
      const response = await axios.post(`/expenses`, {
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
        name: expenseName,
        trip: { id: Number(id) }
      });

      setExpenses([...expenses, response.data]);
      setExpenseAmount("");
      setExpenseCategory("");
      setExpenseDate(today);
      setExpenseName("");
    } catch (err) {
      console.error("Failed to add expense", err);
    }
  };

  const handleCoverSelect = async (imageId) => {
    try {
        await axios.put(`/trips/${id}/cover`, imageId, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        headers: { 'Content-Type': 'application/json' }
        });
        setTrip((prev) => ({ ...prev, coverImage: imageId }));
        setShowCoverModal(false);
    } catch (err) {
        console.error("Failed to update cover image", err);
    }
  };

  const handleSave = async () => {
    const payload = {};
    if (name.trim()) payload.name = name;
    if (startDate) payload.startDate = startDate;
    if (endDate) payload.endDate = endDate;

    try {
      await axios.put(`/trips/${id}`, payload);
    } catch (err) {
      console.error("Failed to update trip", err);
    }
  };

  const filteredExpenses = expenses.filter((e) =>
    filterOption === "ALL" ? true : e.category === filterOption
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOption === "date") return new Date(b.date) - new Date(a.date);
    if (sortOption === "price") return b.amount - a.amount;
    if (sortOption === "category") {
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;
        return new Date(b.date) - new Date(a.date); 
    }
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-[#101120] text-white">
      <Sidebar showTopBar={true} />
      <main className="flex-1 p-6 flex flex-col gap-6 items-center">
        {trip && (
          <>
            <div className="w-full max-w-2xl relative rounded-md overflow-hidden">
                <img
                    src={`/covers/${trip.coverImage}.jpg`}
                    alt={trip.name}
                    className="w-full h-48 object-cover rounded"
                />
                <button
                    onClick={() => setShowCoverModal(true)}
                    className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition"
                    >
                    <Pencil size={14} />
                    <span className="text-sm">Edit</span>
                </button>
            </div>

            {/* Edit Trip Form */}
            <div className="bg-[#16172A] p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4">
              <h2 className="text-2xl font-bold">Edit Trip</h2>
              <div>
                <label className="block mb-1">Trip Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded bg-[#1E1F34] text-white focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
              >
                Save Changes
              </button>
            </div>

            {/* Add Expense Form */}
            <div className="bg-[#16172A] p-4 rounded-lg shadow-md w-full max-w-2xl space-y-4">
              <h3 className="text-xl font-bold">Add Expense</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="flex-1 p-2 rounded bg-[#1E1F34] text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="FOOD">Food</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="ACTIVITY">Activity</option>
                    <option value="EVENT">Event</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseAmount}
                    placeholder="Amount"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value === "" ||
                        (Number(value) >= 0 && /^\d*\.?\d{0,2}$/.test(value))
                      ) {
                        setExpenseAmount(value);
                      }
                    }}
                    className="flex-1 p-2 rounded bg-[#1E1F34] text-white"
                  />
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="flex-1 p-2 rounded bg-[#1E1F34] text-white"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value.slice(0, 30))}
                    placeholder="Name (e.g. Disneyland)"
                    className="flex-1 p-2 rounded bg-[#1E1F34] text-white"
                  />
                  <button
                    onClick={handleAddExpense}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-[#16172A] p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Expenses</h3>
                <div className="flex gap-4 justify-end items-center mb-2">
                  <select
                    className="bg-[#16172A] text-white p-2 rounded"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="price">Sort by Price</option>
                    <option value="category">Sort by Category</option>
                  </select>
                  <select
                    className="bg-[#16172A] text-white p-2 rounded"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="FOOD">FOOD</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="ACTIVITY">ACTIVITY</option>
                    <option value="EVENT">EVENT</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              {sortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center border-b border-gray-700 py-2"
                >
                  <div className="flex gap-2">
                    <span className="w-40 font-bold">{expense.category}:</span>
                    <span>{expense.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">${expense.amount.toFixed(2)}</span>
                    <Trash2
                      size={16}
                      className="text-white-500 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleDeleteExpense(expense.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center">
            <div className="bg-[#16172A] p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-xl relative">
            <button
                onClick={() => setShowCoverModal(false)}
                className="absolute top-2 right-3 text-white text-xl"
            >
                &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Cover Image</h2>
            <div className="grid grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => {
                const index = i + 1;
                return (
                    <img
                    key={index}
                    src={`/covers/${index}.jpg`}
                    alt={`Cover ${index}`}
                    onClick={() => handleCoverSelect(index)}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:scale-105 transition"
                    />
                );
                })}
            </div>
            </div>
        </div>
        )}
      </main>
    </div>
  );
}

export default TripPage;
