import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUser,
  FiPhone,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiHome,
  FiBriefcase,
  FiImage,
  FiNavigation,
  FiCheckCircle,
  FiTrendingUp,
  FiCreditCard,
  FiArrowUp,
  FiSearch,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { PanelRight, Menu } from "lucide-react";
import { Toaster } from "react-hot-toast";

export const Report = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Filter states
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [walletTypeFilter, setWalletTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE = "http://72.61.169.226/admin";

  const walletConfig = {
    travel: {
      name: "Travel Wallet",
      icon: FiNavigation,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      api: "/travel/wallet",
      idField: "travel_id"
    },
    land: {
      name: "Land Wallet",
      icon: FiHome,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      api: "/land/wallet",
      idField: "land_wallet_id"
    },
    land_month: {
      name: "Land Month Wallet",
      icon: FiCalendar,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      api: "/land/wallet/month",
      idField: "land_wallet_id"
    },
    physical: {
      name: "Physical Verification",
      icon: FiCheckCircle,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      api: "/physical/wallet",
      idField: "physical_verification_id"
    },
    poster: {
      name: "Poster Wallet",
      icon: FiImage,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      api: "/poster-wallet",
      idField: "poster_wallet_id"
    },
    job: {
      name: "Job Post Wallet",
      icon: FiBriefcase,
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      api: "/job-wallet",
      idField: "job_post_wallet_id"
    },
    ads: {
      name: "Ads Wallet",
      icon: FiTrendingUp,
      color: "from-cyan-500 to-teal-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      api: "/ads-wallet",
      idField: "ads_wallet_id"
    }
  };

  useEffect(() => {
    fetchAllWalletData();
  }, []);

  const fetchAllWalletData = async () => {
    try {
      setLoading(true);
      const allPromises = Object.entries(walletConfig).map(async ([type, config]) => {
        try {
          const res = await axios.get(`${API_BASE}${config.api}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Add wallet type to each record
          return res.data.data.map(item => ({
            ...item,
            wallet_type: type,
            wallet_name: config.name,
            wallet_icon: config.icon,
            wallet_color: config.color,
            wallet_bgColor: config.bgColor,
            wallet_textColor: config.textColor,
            id_field: config.idField
          }));
        } catch (error) {
          console.error(`Error fetching ${config.name}:`, error);
          return [];
        }
      });

      const results = await Promise.all(allPromises);
      const combinedData = results.flat();
      setAllData(combinedData);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on filters
  const getFilteredData = () => {
    let filtered = [...allData];

    // Date filter (frontend filtering)
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => 
        item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Wallet type filter
    if (walletTypeFilter !== "all") {
      filtered = filtered.filter(item => 
        item.wallet_type === walletTypeFilter
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term) ||
        item.role?.toLowerCase().includes(term) ||
        item.wallet_name?.toLowerCase().includes(term) ||
        (item.land_id && item.land_id.toLowerCase().includes(term)) ||
        (item.session_id && item.session_id.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleRowClick = (row) => {
    const uniqueId = row[row.id_field] || row.id;
    const newExpanded = new Set(expandedRows);
    
    if (newExpanded.has(uniqueId)) {
      newExpanded.delete(uniqueId);
    } else {
      newExpanded.add(uniqueId);
    }
    
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getWalletBadge = (type) => {
    const config = walletConfig[type];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <div className={`flex items-center gap-2 ${config.wallet_textColor}`}>
        <div className={`p-1.5 rounded-lg ${config.wallet_bgColor}`}>
          <Icon className="text-sm" />
        </div>
        <span className="text-sm font-medium">{config.name}</span>
      </div>
    );
  };

  const handleResetFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
    setStatusFilter("all");
    setWalletTypeFilter("all");
    setSearchTerm("");
  };

  // Calculate stats
  const calculateStats = () => {
    const totalAmount = filteredData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const approvedCount = filteredData.filter(row => row.status?.toLowerCase() === 'approved').length;
    const pendingCount = filteredData.filter(row => row.status?.toLowerCase() === 'pending').length;
    const rejectedCount = filteredData.filter(row => row.status?.toLowerCase() === 'rejected').length;
    const uniqueUsers = new Set(filteredData.map(row => row.name)).size;
    const walletTypes = new Set(filteredData.map(row => row.wallet_type)).size;

    return {
      totalAmount,
      approvedCount,
      pendingCount,
      rejectedCount,
      uniqueUsers,
      walletTypes,
      totalRecords: filteredData.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg font-semibold">
                Wallet Reports
              </h1>
              <p className="text-xs text-gray-500">All wallet transactions</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {allData.length} records
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Wallet Reports Dashboard</h1>
            <p className="text-xs text-gray-500">View all wallet transactions in one place</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Records: <span className="font-bold">{allData.length}</span>
          </div>
        </div>
      </header>

      <div className="p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  All Wallet Reports
                </h1>
                <p className="text-gray-600">
                  Comprehensive view of all wallet transactions across all types
                </p>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiFilter className="text-blue-500" />
                    Filter Records
                  </h2>
                  <button
                    onClick={handleResetFilter}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded-lg"
                  >
                    Reset All Filters
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone, role, ID..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-1" /> Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <span className="flex items-center text-gray-400">to</span>
                      <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Filter
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved Only</option>
                      <option value="pending">Pending Only</option>
                      <option value="rejected">Rejected Only</option>
                    </select>
                  </div>

                  {/* Wallet Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet Type
                    </label>
                    <select
                      value={walletTypeFilter}
                      onChange={(e) => setWalletTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Wallet Types</option>
                      {Object.entries(walletConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Total Records</p>
                    <p className="text-lg font-bold text-gray-800">
                      {stats.totalRecords}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FiCreditCard className="text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Total Amount</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatAmount(stats.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FiArrowUp className="text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Approved</p>
                    <p className="text-lg font-bold text-green-600">
                      {stats.approvedCount}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FiCheckCircle className="text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Pending</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {stats.pendingCount}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <FiCalendar className="text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Unique Users</p>
                    <p className="text-lg font-bold text-purple-600">
                      {stats.uniqueUsers}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <FiUser className="text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Wallet Types</p>
                    <p className="text-lg font-bold text-cyan-600">
                      {stats.walletTypes}
                    </p>
                  </div>
                  <div className="bg-cyan-50 p-2 rounded-lg">
                    <FaRupeeSign  className="text-cyan-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-gray-800">Wallet Transactions</h2>
                <div className="text-sm text-gray-600">
                  Showing <span className="font-bold">{filteredData.length}</span> of{" "}
                  <span className="font-bold">{allData.length}</span> records
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm font-medium">
                    <th className="py-3 px-4 border-b border-gray-100">#</th>
                    <th className="py-3 px-4 border-b border-gray-100">WALLET TYPE</th>
                    <th className="py-3 px-4 border-b border-gray-100">DATE</th>
                    <th className="py-3 px-4 border-b border-gray-100">USER</th>
                    <th className="py-3 px-4 border-b border-gray-100">ROLE</th>
                    <th className="py-3 px-4 border-b border-gray-100">PHONE</th>
                    <th className="py-3 px-4 border-b border-gray-100">AMOUNT</th>
                    <th className="py-3 px-4 border-b border-gray-100">STATUS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiCreditCard className="text-4xl mb-2" />
                          <p className="text-lg">No records found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, i) => {
                      const uniqueId = row[row.id_field] || row.id;
                      const isExpanded = expandedRows.has(uniqueId);
                      const Icon = row.wallet_icon;
                      
                      return (
                        <React.Fragment key={`${row.wallet_type}-${i}`}>
                          <tr
                            onClick={() => handleRowClick(row)}
                            className={`
                              cursor-pointer transition-all duration-150
                              ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}
                              border-b border-gray-100
                            `}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-3 ${isExpanded ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <span className="font-medium text-gray-700">{i + 1}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className={`flex items-center gap-2 ${row.wallet_textColor}`}>
                                <div className={`p-1.5 rounded-lg ${row.wallet_bgColor}`}>
                                  <Icon className="text-sm" />
                                </div>
                                <span className="text-sm font-medium">{row.wallet_name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FiCalendar className="mr-2 text-gray-400 text-sm" />
                                <span className="text-sm text-gray-800">{row.date}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                  <FiUser className="text-blue-500 text-sm" />
                                </div>
                                <span className="text-sm font-medium text-gray-800">{row.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {row.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FiPhone className="mr-2 text-gray-400 text-sm" />
                                <span className="text-sm text-gray-800">{row.phone}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm font-bold text-gray-800">
                                {formatAmount(row.amount)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`
                                text-xs px-2 py-1 rounded-full font-medium border
                                ${getStatusColor(row.status)}
                              `}>
                                {row.status}
                              </span>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-blue-50/50">
                              <td colSpan="8" className="p-0">
                                <div className="px-4 py-3 border-t border-blue-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center text-blue-600 text-sm">
                                      <FiChevronUp className="mr-1" />
                                      <span className="font-medium">Transaction Details</span>
                                    </div>
                                    <button
                                      onClick={() => handleRowClick(row)}
                                      className="text-gray-400 hover:text-gray-600 text-sm"
                                    >
                                      <FiChevronUp />
                                    </button>
                                  </div>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                      <div>
                                        <p className="text-gray-500 mb-1">Transaction ID</p>
                                        <p className="font-medium text-gray-800 font-mono">
                                          {uniqueId}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 mb-1">Wallet Type</p>
                                        <p className="font-medium text-gray-800">{row.wallet_name}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 mb-1">Date</p>
                                        <p className="font-medium text-gray-800">{row.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 mb-1">Amount</p>
                                        <p className="font-medium text-gray-800">{formatAmount(row.amount)}</p>
                                      </div>
                                      {row.land_id && (
                                        <div>
                                          <p className="text-gray-500 mb-1">Land ID</p>
                                          <p className="font-medium text-gray-800">{row.land_id}</p>
                                        </div>
                                      )}
                                      {row.session_id && (
                                        <div>
                                          <p className="text-gray-500 mb-1">Session ID</p>
                                          <p className="font-medium text-gray-800 font-mono">{row.session_id}</p>
                                        </div>
                                      )}
                                      {row.state && (
                                        <div>
                                          <p className="text-gray-500 mb-1">State</p>
                                          <p className="font-medium text-gray-800">{row.state}</p>
                                        </div>
                                      )}
                                      {row.district && (
                                        <div>
                                          <p className="text-gray-500 mb-1">District</p>
                                          <p className="font-medium text-gray-800">{row.district}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-gray-600">
                <div>
                  Displaying <span className="font-bold">{filteredData.length}</span> records
                </div>
                <div className="flex items-center flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs">Approved</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-xs">Pending</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-xs">Rejected</span>
                    </div>
                  </div>
                  {walletTypeFilter === "all" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Active wallets:</span>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(filteredData.map(row => row.wallet_type))).slice(0, 3).map(type => {
                          const config = walletConfig[type];
                          if (!config) return null;
                          return (
                            <span 
                              key={type} 
                              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                            >
                              {config.name}
                            </span>
                          );
                        })}
                        {Array.from(new Set(filteredData.map(row => row.wallet_type))).length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            +{Array.from(new Set(filteredData.map(row => row.wallet_type))).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Data last fetched: {new Date().toLocaleString()} • 
              Total wallet types: {Object.keys(walletConfig).length} • 
              Use filters to find specific records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};