import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PanelRight, LogOut } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const generateData = () => [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export default function Dashboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setData(generateData());
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    sessionStorage.clear();
    
    // Redirect to signin page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER (stuck to top, no padding above or around) */}
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <PanelRight />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-4 space-y-6">

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Total Budget</p>
            <h2 className="text-2xl font-bold">₹45,23,189</h2>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Active Buyers</p>
            <h2 className="text-2xl font-bold">+2350</h2>
            <p className="text-xs text-green-600">+180.1% from last month</p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Garuda Points Issued</p>
            <h2 className="text-2xl font-bold">+12,234</h2>
            <p className="text-xs text-green-600">+19% from last month</p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Field Productivity</p>
            <h2 className="text-2xl font-bold">+573</h2>
            <p className="text-xs text-green-600">+201 since last hour</p>
          </div>
        </div>

        {/* SECTION TITLE */}
        <h2 className="text-xl font-semibold">Operational Overview</h2>

        {/* CHART CARD */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-4">
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />

                <Tooltip
                  cursor={{ fill: "#ddd", opacity: 0.3 }}
                  contentStyle={{
                    background: "white",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    borderRadius: "10px",
                  }}
                />

                <Bar dataKey="total" fill="#06a714bb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
