import React, { useEffect, useState } from "react";
import axios from "axios";
import { SessionDetails } from "./SessionDetails";
import { UpdateModal } from "./UpdateModal";
import { getApiUrl } from "../config/api";
import { 
  FiArrowDown, 
  FiArrowUp, 
  FiEdit2, 
  FiEye, 
  FiChevronRight,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiCalendar,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { PanelRight } from "lucide-react";

export const TravelWallet = () => {
  const [travelData, setTravelData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchTravelWallet();
  }, []);

  const token = localStorage.getItem("token");

  const fetchTravelWallet = async () => {
    try {
      setLoading(true);
      const res = await axios.get(getApiUrl(`/admin/travel/wallet`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTravelData(res.data.data);
    } catch (error) {
      console.error("Error fetching travel data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (row, e) => {
    e.stopPropagation();
    setSelectedRow(row);
  };

  const handleRowClick = async (sessionId, rowIndex) => {
    if (expandedRows.has(sessionId)) {
      const newExpanded = new Set(expandedRows);
      newExpanded.delete(sessionId);
      setExpandedRows(newExpanded);
      setSessionData(null);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        getApiUrl(`/admin/session/${sessionId}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newExpanded = new Set(expandedRows);
      newExpanded.add(sessionId);
      setExpandedRows(newExpanded);

      setSessionData({
        id: sessionId,
        ...res.data.data,
      });
    } catch (error) {
      console.error("Error fetching session details:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                    <PanelRight className="h-5 w-5 text-white" />
                    </div>
          <h1 className="text-xl font-semibold">Travel Wallet</h1>
        </div>
      </header>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Travel Wallet
            </h1>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-600">Total Records:</span>
              <span className="font-bold text-gray-800">{travelData.length}</span>
            </div>
          </div>
          <p className="text-gray-600">
            Manage and monitor travel expense records and transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatAmount(travelData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {travelData.filter(row => row.status?.toLowerCase() === 'approved').length}
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
                  {travelData.filter(row => row.status?.toLowerCase() === 'pending').length}
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
                <p className="text-gray-500 text-sm">Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(travelData.map(row => row.name)).size}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <FiUser className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Travel Records</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Click on rows to expand details</span>
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
                  <th className="py-4 px-6 border-b border-gray-100">AMOUNT</th>
                  <th className="py-4 px-6 border-b border-gray-100">STATUS</th>
                  <th className="py-4 px-6 border-b border-gray-100 text-center">ACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {travelData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FiUser className="text-4xl mb-2" />
                        <p className="text-lg">No travel records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  travelData.map((row, i) => (
                    <React.Fragment key={i}>
                      <tr
                        onClick={() => handleRowClick(row.session_id, i)}
                        className={`
                          hover:bg-blue-50 cursor-pointer transition-all duration-200
                          ${expandedRows.has(row.session_id) ? 'bg-blue-50' : ''}
                          border-b border-gray-100
                        `}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${expandedRows.has(row.session_id) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
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
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <FiUser className="text-blue-500" />
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
                              bg-gradient-to-r from-blue-500 to-blue-600 
                              text-white px-4 py-2 rounded-lg
                              hover:from-blue-600 hover:to-blue-700
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

                      {expandedRows.has(row.session_id) && sessionData && sessionData.id === row.session_id && (
                        <tr className="bg-gradient-to-r from-blue-50/50 to-white">
                          <td colSpan="8" className="p-0">
                            <div className="px-6 py-4 border-t border-blue-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-blue-600">
                                  <FiChevronUp className="mr-2" />
                                  <span className="font-medium">Session Details</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedRows);
                                    newExpanded.delete(row.session_id);
                                    setExpandedRows(newExpanded);
                                    setSessionData(null);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <FiChevronUp />
                                </button>
                              </div>
                              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                <SessionDetails data={sessionData} />
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
                Showing <span className="font-bold">{travelData.length}</span> records
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
        <UpdateModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          refreshTable={fetchTravelWallet}
        />
      )}
      </div>
    </div>
  );
};