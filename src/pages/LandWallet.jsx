import React, { useEffect, useState } from "react";
import axios from "axios";
import { LandDetails } from "./LandDetails";
import { UpdateLandModal } from "./UpdateLandModal";
import { 
  FiArrowDown, 
  FiArrowUp, 
  FiEdit2, 
  FiUser,
  FiPhone,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiMap,
  FiPackage,
  FiDollarSign
} from "react-icons/fi";
import { PanelRight, Menu } from "lucide-react";

export const LandWallet = () => {
  const [landData, setLandData] = useState([]);
  const [landMonthData, setLandMonthData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [landDetails, setLandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeTab, setActiveTab] = useState("landWallet");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "landWallet") {
      fetchLandWallet();
    } else {
      fetchLandMonthWallet();
    }
  }, [activeTab]);

  const token = localStorage.getItem("token");

  const fetchLandWallet = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://72.61.169.226/admin/land/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLandData(res.data.data);
    } catch (error) {
      console.error("Error fetching land wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandMonthWallet = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://72.61.169.226/admin/land/wallet/month", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLandMonthData(res.data.data);
    } catch (error) {
      console.error("Error fetching land month wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandDetails = async (landId) => {
    try {
      const res = await axios.get(
        `http://72.61.169.226/admin/land/data?land_id=${landId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data[0];
    } catch (error) {
      console.error("Error fetching land details:", error);
      return null;
    }
  };

  const handleUpdateClick = (row, e) => {
    e.stopPropagation();
    setSelectedRow(row);
  };

  const handleRowClick = async (landId, rowIndex) => {
    if (expandedRows.has(landId)) {
      const newExpanded = new Set(expandedRows);
      newExpanded.delete(landId);
      setExpandedRows(newExpanded);
      setLandDetails(null);
      return;
    }

    try {
      const details = await fetchLandDetails(landId);

      const newExpanded = new Set(expandedRows);
      newExpanded.add(landId);
      setExpandedRows(newExpanded);

      setLandDetails({
        land_id: landId,
        ...details,
      });
    } catch (error) {
      console.error("Error fetching land details:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
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

  const handleUpdateSuccess = () => {
    if (activeTab === "landWallet") {
      fetchLandWallet();
    } else {
      fetchLandMonthWallet();
    }
    setSelectedRow(null);
  };

  const getCurrentData = () => {
    return activeTab === "landWallet" ? landData : landMonthData;
  };

  if (loading && getCurrentData().length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
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
                Land Wallet
              </h1>
            </div>
          </div>
        </div>
      </div>
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Land Wallet</h1>
        </div>
      </header>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Land Wallet
              </h1>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-gray-600">Total Records:</span>
                <span className="font-bold text-gray-800">{getCurrentData().length}</span>
              </div>
            </div>
            <p className="text-gray-600">
              Manage and monitor land transaction records and wallet balances
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("landWallet")}
                className={`
                  px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
                  ${activeTab === "landWallet" 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                `}
              >
                <div className="flex items-center">
                  <FiPackage className="mr-2" />
                  Land Wallet
                  {activeTab === "landWallet" && (
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {landData.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("landMonthWallet")}
                className={`
                  px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
                  ${activeTab === "landMonthWallet" 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                `}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  Land Month Wallet
                  {activeTab === "landMonthWallet" && (
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {landMonthData.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatAmount(getCurrentData().reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0))}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <FiDollarSign className="text-emerald-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getCurrentData().filter(row => row.status?.toLowerCase() === 'approved').length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <FiArrowUp className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {getCurrentData().filter(row => row.status?.toLowerCase() === 'pending').length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <FiCalendar className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Unique Lands</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(getCurrentData().map(row => row.land_id)).size}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <FiMap className="text-purple-500 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeTab === "landWallet" ? "Land Wallet Records" : "Land Month Wallet Records"}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Click on rows to expand land details</span>
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm font-medium">
                    <th className="py-4 px-6 border-b border-gray-100">SL NO</th>
                    <th className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        DATE
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        NAME
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">ROLE</th>
                    <th className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center">
                        <FiPhone className="mr-2" />
                        MOBILE
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">LAND ID</th>
                    <th className="py-4 px-6 border-b border-gray-100">AMOUNT</th>
                    <th className="py-4 px-6 border-b border-gray-100">STATUS</th>
                    <th className="py-4 px-6 border-b border-gray-100 text-center">ACTION</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {getCurrentData().length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiMap className="text-4xl mb-2" />
                          <p className="text-lg">No {activeTab === "landWallet" ? "land wallet" : "land month wallet"} records found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    getCurrentData().map((row, i) => (
                      <React.Fragment key={i}>
                        <tr
                          onClick={() => handleRowClick(row.land_id, i)}
                          className={`
                            hover:bg-emerald-50 cursor-pointer transition-all duration-200
                            ${expandedRows.has(row.land_id) ? 'bg-emerald-50' : ''}
                            border-b border-gray-100
                          `}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${expandedRows.has(row.land_id) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span className="font-medium text-gray-700">{i + 1}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiCalendar className="mr-2 text-gray-400" />
                              <span className="font-medium text-gray-800">{row.date}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                <FiUser className="text-emerald-500" />
                              </div>
                              <span className="font-medium text-gray-800">{row.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {row.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiPhone className="mr-2 text-gray-400" />
                              <span className="text-gray-800">{row.phone}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiMap className="mr-2 text-gray-400" />
                              <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                {row.land_id}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center font-bold text-gray-800">
                              {formatAmount(row.amount)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`
                              px-3 py-1 rounded-full text-sm font-medium border
                              ${getStatusColor(row.status)}
                            `}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={(e) => handleUpdateClick(row, e)}
                              className="
                                bg-gradient-to-r from-emerald-500 to-green-600 
                                text-white px-4 py-2 rounded-lg
                                hover:from-emerald-600 hover:to-green-700
                                transition-all duration-200
                                flex items-center justify-center mx-auto
                                shadow-sm hover:shadow-md
                              "
                            >
                              <FiEdit2 className="mr-2" />
                              Action
                            </button>
                          </td>
                        </tr>

                        {expandedRows.has(row.land_id) && landDetails && landDetails.land_id === row.land_id && (
                          <tr className="bg-gradient-to-r from-emerald-50/50 to-white">
                            <td colSpan="9" className="p-0">
                              <div className="px-6 py-4 border-t border-emerald-100">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center text-emerald-600">
                                    <FiChevronUp className="mr-2" />
                                    <span className="font-medium">Land Details - ID: {row.land_id}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedRows);
                                      newExpanded.delete(row.land_id);
                                      setExpandedRows(newExpanded);
                                      setLandDetails(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <FiChevronUp />
                                  </button>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                  <LandDetails data={landDetails} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing <span className="font-bold">{getCurrentData().length}</span> records
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Modal */}
        {selectedRow && (
          <UpdateLandModal
            row={selectedRow}
            onClose={() => setSelectedRow(null)}
            onSuccess={handleUpdateSuccess}
            isLandMonth={activeTab === "landMonthWallet"}
          />
        )}
      </div>
    </div>
  );
};