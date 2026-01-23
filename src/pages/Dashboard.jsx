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
import { PanelRight, LogOut, TrendingUp, Users, TrendingUpIcon, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalBudget: 0,
    activeBuyers: 0,
    fieldProductivity: 0,
    isLoading: true,
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getHeaders = () => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // API base URL
  const API_BASE_URL = "http://72.61.169.226/admin";

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      if (!stats.isLoading) {
        setStats(prev => ({ ...prev, isLoading: true }));
      }

      // Fetch all stats in parallel
      const [budgetRes, activeUsersRes, productivityRes, monthlyBudgetRes] = await Promise.all([
        fetch(`${API_BASE_URL}/budget`, {
          headers: getHeaders()
        }),
        fetch(`${API_BASE_URL}/active-user`, {
          headers: getHeaders()
        }),
        fetch(`${API_BASE_URL}/field-productivity`, {
          headers: getHeaders()
        }),
        fetch(`${API_BASE_URL}/montly/budget?year=${selectedYear}`, {
          headers: getHeaders()
        }),
      ]);

      // Parse responses
      const budgetData = await budgetRes.json();
      const activeUsersData = await activeUsersRes.json();
      const productivityData = await productivityRes.json();
      const monthlyBudgetData = await monthlyBudgetRes.json();

      // Update stats
      setStats({
        totalBudget: budgetData.success ? budgetData.total_budget : 0,
        activeBuyers: activeUsersData.active_users || 0,
        fieldProductivity: productivityData.success 
          ? productivityData.field_productivity.length 
          : 0,
        isLoading: false,
      });

      // Process monthly budget data for chart
      if (monthlyBudgetData.success && monthlyBudgetData.monthly_budget) {
        processMonthlyData(monthlyBudgetData.monthly_budget);
      } else {
        // If no data for selected year, show empty chart
        setData([]);
      }

      // Extract available years from monthly data if available
      if (monthlyBudgetData.available_years) {
        setAvailableYears(monthlyBudgetData.available_years);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats(prev => ({ ...prev, isLoading: false }));
      setData([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Process monthly budget data for chart
  const processMonthlyData = (monthlyData) => {
    // Create a map for all months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const dataMap = monthlyData.reduce((acc, item) => {
      acc[item.month_name] = item.total_budget;
      return acc;
    }, {});

    // Create chart data with all months
    const chartData = monthNames.map((month, index) => ({
      name: month,
      total: dataMap[month] || 0,
      monthNumber: index + 1
    }));

    setData(chartData);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Handle year change
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    if (year > 1900 && year <= new Date().getFullYear() + 5) {
      setSelectedYear(year);
    }
  };

  // Generate year options (last 10 years + next 5 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Add available years from API if present
    if (availableYears.length > 0) {
      return availableYears.sort((a, b) => b - a);
    }
    
    // Fallback: generate last 10 years and next 5 years
    for (let i = currentYear + 5; i >= currentYear - 10; i--) {
      years.push(i);
    }
    return years;
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Optional: Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedYear]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    sessionStorage.clear();
    
    // Redirect to signin page
    navigate("/");
  };

  // Loading state
  if (stats.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
          <div className="flex items-center gap-2">
            <PanelRight />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <PanelRight />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-4 space-y-6">

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Budget Card */}
          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                Budget
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Budget</p>
            <h2 className="text-2xl font-bold mb-2">
              {formatCurrency(stats.totalBudget)}
            </h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUpIcon size={12} />
              All verified lands
            </p>
          </div>

          {/* Active Buyers Card */}
          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                Users
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Active Buyers</p>
            <h2 className="text-2xl font-bold mb-2">
              {formatNumber(stats.activeBuyers)}
            </h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUpIcon size={12} />
              Registered buyers
            </p>
          </div>

          {/* Field Productivity Card */}
          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                Performance
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Field Productivity</p>
            <h2 className="text-2xl font-bold mb-2">
              {formatNumber(stats.fieldProductivity)}
            </h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUpIcon size={12} />
              Active executives
            </p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Monthly Budget Overview</h2>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <div className="relative">
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={handleYearChange}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Select year"
                  />
                  {availableYears.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {generateYearOptions().map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                            year === selectedYear ? 'bg-green-50 text-green-700' : ''
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchDashboardData}
                disabled={isRefreshing}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isRefreshing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
                }`}
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    Refreshing...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>
          </div>

          {data.length > 0 ? (
            <>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />

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
                      tickFormatter={(value) => `₹${formatNumber(value)}`}
                    />

                    <Tooltip
                      cursor={{ fill: "#f0fdf4", opacity: 0.3 }}
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        color: "#111827",
                        borderRadius: "10px",
                        padding: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value) => [`₹${formatNumber(value)}`, "Budget"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />

                    <Bar 
                      dataKey="total" 
                      fill="#06a714" 
                      radius={[5, 5, 0, 0]}
                      name="Monthly Budget"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Showing monthly budget distribution for {selectedYear}
              </div>
            </>
          ) : (
            <div className="w-full h-[320px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-2">
                <Calendar size={48} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Data Available</h3>
              <p className="text-gray-500 text-sm">
                No budget data found for {selectedYear}
              </p>
              <button
                onClick={() => setSelectedYear(new Date().getFullYear())}
                className="mt-4 text-green-600 hover:text-green-800 font-medium"
              >
                View current year
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}