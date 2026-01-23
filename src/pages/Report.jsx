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
  FiRefreshCw,
  FiEdit2,
  FiEye,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { PanelRight, Menu } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { UpdateModal } from "./UpdateModal";
import { UpdateLandModal } from "./UpdateLandModal";
import { UpdatePhysicalVerificationModal } from "./UpdatePhysicalVerificationModal";
import { UpdatePosterModal } from "./UpdatePosterModal";
import { UpdateJobModal } from "./UpdateJobModal";
import { UpdateAdsModal } from "./UpdateAdsModal";
import { useNavigate } from "react-router-dom";

export const Report = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const navigate = useNavigate();

  // Filter states
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [walletTypeFilter, setWalletTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentWalletType, setCurrentWalletType] = useState("");

  // Track if data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

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
      idField: "travel_id",
    },
    land: {
      name: "Land Wallet",
      icon: FiHome,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      api: "/land/wallet",
      idField: "land_wallet_id",
    },
    land_month: {
      name: "Land Month Wallet",
      icon: FiCalendar,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      api: "/land/wallet/month",
      idField: "land_wallet_id",
    },
    physical: {
      name: "Physical Verification",
      icon: FiCheckCircle,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      api: "/physical/wallet",
      idField: "physical_verification_id",
    },
    poster: {
      name: "Poster Wallet",
      icon: FiImage,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      api: "/poster-wallet",
      idField: "poster_wallet_id",
    },
    job: {
      name: "Job Post Wallet",
      icon: FiBriefcase,
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      api: "/job-wallet",
      idField: "job_post_wallet_id",
    },
    ads: {
      name: "Ads Wallet",
      icon: FiTrendingUp,
      color: "from-cyan-500 to-teal-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      api: "/ads-wallet",
      idField: "ads_wallet_id",
    },
  };

  const handleUpdateClick = (row, walletType) => {
    setSelectedRow(row);
    setCurrentWalletType(walletType);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    fetchWalletData(); // Refresh the table data
    setShowUpdateModal(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedRow(null);
    setCurrentWalletType("");
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Determine which wallet types to fetch
      let walletsToFetch = [];

      if (walletTypeFilter === "all") {
        // Fetch all wallet types
        walletsToFetch = Object.entries(walletConfig);
      } else {
        // Fetch only selected wallet type
        const config = walletConfig[walletTypeFilter];
        if (config) {
          walletsToFetch = [[walletTypeFilter, config]];
        }
      }

      // Build query parameters for backend filtering
      const queryParams = new URLSearchParams();

      if (dateFilter.startDate) {
        queryParams.append("startDate", dateFilter.startDate);
      }
      if (dateFilter.endDate) {
        queryParams.append("endDate", dateFilter.endDate);
      }
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      const allPromises = walletsToFetch.map(async ([type, config]) => {
        try {
          // Add query parameters to API call for backend filtering
          const apiUrl = `${API_BASE}${config.api}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

          const res = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Add wallet type to each record
          return res.data.data.map((item) => ({
            ...item,
            wallet_type: type,
            wallet_name: config.name,
            wallet_icon: config.icon,
            wallet_color: config.color,
            wallet_bgColor: config.bgColor,
            wallet_textColor: config.textColor,
            id_field: config.idField,
          }));
        } catch (error) {
          console.error(`Error fetching ${config.name}:`, error);
          return [];
        }
      });

      const results = await Promise.all(allPromises);
      const combinedData = results.flat();
      setAllData(combinedData);
      setDataFetched(true);

      toast.success(`Loaded ${combinedData.length} records`);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on filters (frontend filtering for additional refinement)
  const getFilteredData = () => {
    let filtered = [...allData];

    // Apply frontend filters only if we have data
    if (!dataFetched) {
      return [];
    }

    // Date filter (additional frontend filtering)
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);

        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Status filter (additional frontend filtering)
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // Search filter (additional frontend filtering)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.phone?.toLowerCase().includes(term) ||
          item.role?.toLowerCase().includes(term) ||
          item.wallet_name?.toLowerCase().includes(term) ||
          (item.land_id && item.land_id.toLowerCase().includes(term)) ||
          (item.session_id && item.session_id.toLowerCase().includes(term)),
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleApplyFilters = () => {
    if (
      !dateFilter.startDate &&
      !dateFilter.endDate &&
      !statusFilter &&
      !walletTypeFilter &&
      !searchTerm
    ) {
      toast.error("Please set at least one filter before fetching data");
      return;
    }
    fetchWalletData();
  };

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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleResetFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
    setStatusFilter("all");
    setWalletTypeFilter("all");
    setSearchTerm("");
    setAllData([]);
    setDataFetched(false);
    setExpandedRows(new Set());
  };

  // Calculate stats
  const calculateStats = () => {
    if (!dataFetched) {
      return {
        totalAmount: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        uniqueUsers: 0,
        walletTypes: 0,
        totalRecords: 0,
      };
    }

    const totalAmount = filteredData.reduce(
      (sum, row) => sum + (parseFloat(row.amount) || 0),
      0,
    );
    const approvedCount = filteredData.filter(
      (row) => row.status?.toLowerCase() === "approved",
    ).length;
    const pendingCount = filteredData.filter(
      (row) => row.status?.toLowerCase() === "pending",
    ).length;
    const rejectedCount = filteredData.filter(
      (row) => row.status?.toLowerCase() === "rejected",
    ).length;
    const uniqueUsers = new Set(filteredData.map((row) => row.name)).size;
    const walletTypes = new Set(filteredData.map((row) => row.wallet_type))
      .size;

    return {
      totalAmount,
      approvedCount,
      pendingCount,
      rejectedCount,
      uniqueUsers,
      walletTypes,
      totalRecords: filteredData.length,
    };
  };

  const stats = calculateStats();

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
              <h1 className="text-lg font-semibold">Wallet Reports</h1>
              <p className="text-xs text-gray-500">
                Filter and view wallet transactions
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/land/report`);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
            title="View purchase requests"
          >
            <FiEye className="w-4 h-4" />
            Land Repot
          </button>
          {dataFetched && (
            <div className="text-sm text-gray-600">
              {allData.length} records
            </div>
          )}
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
            <p className="text-xs text-gray-500">
              Filter and fetch wallet transactions as needed
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/land/report`);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
          title="View purchase requests"
        >
          <FiEye className="w-4 h-4" />
          Land Report
        </button>
        <div className="flex items-center gap-4">
          {dataFetched && (
            <div className="text-sm text-gray-600">
              Total Records: <span className="font-bold">{allData.length}</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Wallet Reports
                </h1>
                <p className="text-gray-600">
                  Set filters and fetch specific wallet transaction data
                </p>
              </div>
              {dataFetched && (
                <div className="text-sm text-gray-600">
                  Data fetched: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiFilter className="text-blue-500" />
                    Set Filters & Fetch Data
                  </h2>
                  <div className="flex gap-2">
                    {dataFetched && (
                      <button
                        onClick={fetchWalletData}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                      >
                        <FiRefreshCw className="text-xs" />
                        Refresh
                      </button>
                    )}
                    <button
                      onClick={handleResetFilter}
                      className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 hover:bg-red-50 rounded-lg"
                    >
                      Reset All
                    </button>
                  </div>
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
                        onChange={(e) =>
                          setDateFilter((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <span className="flex items-center text-gray-400">
                        to
                      </span>
                      <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) =>
                          setDateFilter((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
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

                {/* Apply Filters Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleApplyFilters}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Fetching Data...
                      </>
                    ) : (
                      <>
                        <FiFilter />
                        Apply Filters & Fetch Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards - Only show when data is fetched */}
            {dataFetched && (
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
                      <FaRupeeSign className="text-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Display Section */}
            {dataFetched ? (
              <>
                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-gray-800">
                        Wallet Transactions
                      </h2>
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-bold">{filteredData.length}</span>{" "}
                        of <span className="font-bold">{allData.length}</span>{" "}
                        records
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600 text-sm font-medium">
                          <th className="py-3 px-4 border-b border-gray-100">
                            #
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            WALLET TYPE
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            DATE
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            USER
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            ROLE
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            PHONE
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            AMOUNT
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100">
                            STATUS
                          </th>
                          <th className="py-3 px-4 border-b border-gray-100 text-center">
                            ACTION
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="py-8 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                <FiCreditCard className="text-4xl mb-2" />
                                <p className="text-lg">No records found</p>
                                <p className="text-sm">
                                  Try adjusting your filters
                                </p>
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
                                    ${isExpanded ? "bg-blue-50" : "hover:bg-gray-50"}
                                    border-b border-gray-100
                                  `}
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div
                                        className={`w-2 h-2 rounded-full mr-3 ${isExpanded ? "bg-blue-500" : "bg-gray-300"}`}
                                      ></div>
                                      <span className="font-medium text-gray-700">
                                        {i + 1}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div
                                      className={`flex items-center gap-2 ${row.wallet_textColor}`}
                                    >
                                      <div
                                        className={`p-1.5 rounded-lg ${row.wallet_bgColor}`}
                                      >
                                        <Icon className="text-sm" />
                                      </div>
                                      <span className="text-sm font-medium">
                                        {row.wallet_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <FiCalendar className="mr-2 text-gray-400 text-sm" />
                                      <span className="text-sm text-gray-800">
                                        {row.date}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                        <FiUser className="text-blue-500 text-sm" />
                                      </div>
                                      <span className="text-sm font-medium text-gray-800">
                                        {row.name}
                                      </span>
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
                                      <span className="text-sm text-gray-800">
                                        {row.phone}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-sm font-bold text-gray-800">
                                      {formatAmount(row.amount)}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`
                                      text-xs px-2 py-1 rounded-full font-medium border
                                      ${getStatusColor(row.status)}
                                    `}
                                    >
                                      {row.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateClick(row, row.wallet_type);
                                      }}
                                      className="
                                        bg-gradient-to-r from-blue-500 to-blue-600 
                                        text-white px-3 py-1.5 rounded-lg text-sm
                                        hover:from-blue-600 hover:to-blue-700
                                        transition-all duration-200
                                        flex items-center justify-center mx-auto
                                        shadow-sm hover:shadow-md
                                        min-w-[80px]
                                      "
                                    >
                                      <FiEdit2 className="mr-1.5 text-xs" />
                                      Action
                                    </button>
                                  </td>
                                </tr>

                                {isExpanded && (
                                  <tr className="bg-blue-50/50">
                                    <td colSpan="9" className="p-0">
                                      <div className="px-4 py-3 border-t border-blue-100">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center text-blue-600 text-sm">
                                            <FiChevronUp className="mr-1" />
                                            <span className="font-medium">
                                              Transaction Details
                                            </span>
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
                                              <p className="text-gray-500 mb-1">
                                                Transaction ID
                                              </p>
                                              <p className="font-medium text-gray-800 font-mono">
                                                {uniqueId}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-gray-500 mb-1">
                                                Wallet Type
                                              </p>
                                              <p className="font-medium text-gray-800">
                                                {row.wallet_name}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-gray-500 mb-1">
                                                Date
                                              </p>
                                              <p className="font-medium text-gray-800">
                                                {row.date}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-gray-500 mb-1">
                                                Amount
                                              </p>
                                              <p className="font-medium text-gray-800">
                                                {formatAmount(row.amount)}
                                              </p>
                                            </div>
                                            {row.land_id && (
                                              <div>
                                                <p className="text-gray-500 mb-1">
                                                  Land ID
                                                </p>
                                                <p className="font-medium text-gray-800">
                                                  {row.land_id}
                                                </p>
                                              </div>
                                            )}
                                            {row.session_id && (
                                              <div>
                                                <p className="text-gray-500 mb-1">
                                                  Session ID
                                                </p>
                                                <p className="font-medium text-gray-800 font-mono">
                                                  {row.session_id}
                                                </p>
                                              </div>
                                            )}
                                            {row.state && (
                                              <div>
                                                <p className="text-gray-500 mb-1">
                                                  State
                                                </p>
                                                <p className="font-medium text-gray-800">
                                                  {row.state}
                                                </p>
                                              </div>
                                            )}
                                            {row.district && (
                                              <div>
                                                <p className="text-gray-500 mb-1">
                                                  District
                                                </p>
                                                <p className="font-medium text-gray-800">
                                                  {row.district}
                                                </p>
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
                        Displaying{" "}
                        <span className="font-bold">{filteredData.length}</span>{" "}
                        records
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
                              {Array.from(
                                new Set(
                                  filteredData.map((row) => row.wallet_type),
                                ),
                              )
                                .slice(0, 3)
                                .map((type) => {
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
                              {Array.from(
                                new Set(
                                  filteredData.map((row) => row.wallet_type),
                                ),
                              ).length > 3 && (
                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                  +
                                  {Array.from(
                                    new Set(
                                      filteredData.map(
                                        (row) => row.wallet_type,
                                      ),
                                    ),
                                  ).length - 3}{" "}
                                  more
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
                    Data fetched: {new Date().toLocaleString()} • Total wallet
                    types in filter: {Object.keys(walletConfig).length} • Use
                    "Refresh" to update with current filters
                  </p>
                </div>
              </>
            ) : (
              /* Empty State - Before data is fetched */
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFilter className="text-3xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Data Loaded Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Set your filters above and click "Apply Filters & Fetch
                    Data" to load specific wallet transaction data.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Filter by date range</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Select wallet type</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showUpdateModal && selectedRow && (
        <>
          {currentWalletType === "travel" && (
            <UpdateModal
              row={selectedRow}
              onClose={handleCloseModal}
              refreshTable={fetchWalletData}
            />
          )}

          {currentWalletType === "land" && (
            <UpdateLandModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
              isLandMonth={false}
            />
          )}

          {currentWalletType === "land_month" && (
            <UpdateLandModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
              isLandMonth={true}
            />
          )}

          {currentWalletType === "physical" && (
            <UpdatePhysicalVerificationModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
            />
          )}

          {currentWalletType === "poster" && (
            <UpdatePosterModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
            />
          )}

          {currentWalletType === "job" && (
            <UpdateJobModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
            />
          )}

          {currentWalletType === "ads" && (
            <UpdateAdsModal
              row={selectedRow}
              onClose={handleCloseModal}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};
