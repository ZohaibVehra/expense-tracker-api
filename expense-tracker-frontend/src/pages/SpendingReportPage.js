import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#4ade80", "#facc15", "#6366f1", "#ec4899", "#a3a3a3"];

function SpendingReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      const tripRes = await axios.get(`/trips/${id}`);
      setTrip(tripRes.data);
      const expRes = await axios.get(`/expenses/trip/${id}`);
      setExpenses(expRes.data);
    };

    fetchData();
  }, [id, navigate]);

  const toggleExclude = (id) => {
    setExcludedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const visibleExpenses = expenses.filter(e => !excludedIds.includes(e.id));
  const totalSpent = visibleExpenses.reduce((acc, e) => acc + parseFloat(e.amount), 0).toFixed(2);

  const categoryData = Object.values(
    visibleExpenses.reduce((acc, e) => {
      const cat = e.category;
      acc[cat] = acc[cat] || { name: cat, value: 0 };
      acc[cat].value += parseFloat(e.amount);
      return acc;
    }, {})
  );

  const dailyData = Object.values(
    visibleExpenses.reduce((acc, e) => {
      const day = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[day] = acc[day] || { day, total: 0 };
      acc[day].total += parseFloat(e.amount);
      return acc;
    }, {})
  );

  const topExpenses = [...expenses]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#101120] text-white">
      <Sidebar showTopBar={true} />
      <main className="flex-1 p-6 max-w-5xl mx-auto space-y-8">
        {trip && (
          <>
            <div className="bg-[#16172A] p-6 rounded-lg shadow">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.name}</h1>
              <p className="text-lg text-white">Total Spent</p>
              <p className="text-3xl font-semibold" style={{ color: "#d5f566" }}>${totalSpent}</p>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#16172A] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Spending by category</h2>
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8 text-sm space-y-2">
                  {categoryData.map((item, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>{((item.value / totalSpent) * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-[#16172A] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Daily spending</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyData} barSize={32}>
                  <XAxis dataKey="day" stroke="#ccc" tickLine={false} axisLine={false} />
                  <YAxis stroke="#ccc" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Spent"]} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Expenses */}
            <div className="bg-[#16172A] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Top expenses</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2">Exclude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExpenses.map((e) => (
                      <tr key={e.id} className="border-b border-gray-800">
                        <td className="py-2 pr-4">{e.date}</td>
                        <td className="py-2 pr-4">{e.category}</td>
                        <td className="py-2 pr-4">{e.name}</td>
                        <td className="py-2 pr-4">${parseFloat(e.amount).toFixed(2)}</td>
                        <td className="py-2">
                          <input
                            type="checkbox"
                            checked={excludedIds.includes(e.id)}
                            onChange={() => toggleExclude(e.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SpendingReportPage;
