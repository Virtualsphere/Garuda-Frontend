import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiEye, 
  FiEdit2, 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiHome,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { PanelRight } from "lucide-react";
import { UpdateLandPurchaseModal } from "./UpdateLandPurchaseModal";

export const LandPurchaseDetail = () => {
  const navigate = useNavigate();
  const { landId } = useParams(); // Get landId from URL params if available
  const [purchaseData, setPurchaseData] = useState([]);
  const [landDetails, setLandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [currentLandId, setCurrentLandId] = useState(landId || null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPurchaseDetails();
  }, []);

  useEffect(() => {
    if (currentLandId) {
      fetchLandDetails();
    }
  }, [currentLandId]);

  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://72.61.169.226/admin/purchase/land/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = res.data.data || [];
      setPurchaseData(data);
      
      // Extract landId from the first purchase if available
      if (data.length > 0 && data[0].land_id) {
        setCurrentLandId(data[0].land_id);
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandDetails = async () => {
    if (!currentLandId) return;
    
    try {
      const res = await axios.get(
        `http://72.61.169.226/admin/land/data?land_id=${currentLandId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLandDetails(res.data.data);
    } catch (error) {
      console.error("Error fetching land details:", error);
    }
  };

  const handleRowClick = (purchaseId) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(purchaseId)) {
      newExpanded.delete(purchaseId);
    } else {
      newExpanded.add(purchaseId);
    }
    setExpandedRows(newExpanded);
  };

  const handleUpdateClick = (purchase, e) => {
    e.stopPropagation();
    setSelectedPurchase(purchase);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "contacted":
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "contacted":
        return <FiCheckCircle className="mr-1" />;
      case "rejected":
        return <FiXCircle className="mr-1" />;
      case "pending":
        return <FiClock className="mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If no purchase data and no landId provided, show empty state
  if (purchaseData.length === 0 && !currentLandId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        <header className="h-14 items-center justify-between bg-white px-6 shadow-sm flex">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="text-gray-600" />
            </button>
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
              <PanelRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Land Purchase Details</h1>
            </div>
          </div>
        </header>
        <div className="p-6 flex items-center justify-center h-[calc(100vh-3.5rem)]">
          <div className="text-center">
            <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Purchase Requests Found</h2>
            <p className="text-gray-600">There are no purchase requests available for this land.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <header className="h-14 items-center justify-between bg-white px-6 shadow-sm flex">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-gray-600" />
          </button>
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Land Purchase Details</h1>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Land Summary Card */}
          {landDetails && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Land Summary</h2>
                  <p className="text-gray-600">Basic information about this land</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                  {purchaseData.length} Purchase Request{purchaseData.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {purchaseData.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Contacted</p>
                  <p className="text-2xl font-bold text-green-600">
                    {purchaseData.filter(p => p.status?.toLowerCase() === 'contacted').length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <FiCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {purchaseData.filter(p => p.status?.toLowerCase() === 'pending').length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <FiClock className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Buyers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(purchaseData.map(p => p.buyer?.name)).size}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <FiUser className="text-purple-500 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Requests Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Purchase Requests</h2>
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
                        <FiUser className="mr-2" />
                        BUYER
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center">
                        <FiPhone className="mr-2" />
                        CONTACT
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        REQUEST DATE
                      </div>
                    </th>
                    <th className="py-4 px-6 border-b border-gray-100">USER ID</th>
                    <th className="py-4 px-6 border-b border-gray-100">STATUS</th>
                    <th className="py-4 px-6 border-b border-gray-100 text-center">ACTION</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {purchaseData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiUser className="text-4xl mb-2" />
                          <p className="text-lg">No purchase requests found</p>
                          <p className="text-sm">for this land</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    purchaseData.map((purchase, i) => (
                      <React.Fragment key={purchase.purchase_id}>
                        <tr
                          onClick={() => handleRowClick(purchase.purchase_id)}
                          className={`
                            hover:bg-emerald-50 cursor-pointer transition-all duration-200
                            ${expandedRows.has(purchase.purchase_id) ? 'bg-emerald-50' : ''}
                            border-b border-gray-100
                          `}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${expandedRows.has(purchase.purchase_id) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                              <span className="font-medium text-gray-700">{i + 1}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                <FiUser className="text-emerald-500" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-800 block">
                                  {purchase.buyer?.name || "Unknown"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiPhone className="mr-2 text-gray-400" />
                              <span className="text-gray-800">{purchase.buyer?.phone || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiCalendar className="mr-2 text-gray-400" />
                              <span className="font-medium text-gray-800">
                                {formatDate(purchase.created_at)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                              {purchase.unique_id?.slice(0, 8)}...
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`
                              px-3 py-1 rounded-full text-sm font-medium border
                              flex items-center justify-center w-32
                              ${getStatusColor(purchase.status)}
                            `}>
                              {getStatusIcon(purchase.status)}
                              {purchase.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={(e) => handleUpdateClick(purchase, e)}
                              className="
                                bg-gradient-to-r from-emerald-500 to-emerald-600 
                                text-white px-4 py-2 rounded-lg
                                hover:from-emerald-600 hover:to-emerald-700
                                transition-all duration-200
                                flex items-center justify-center mx-auto
                                shadow-sm hover:shadow-md
                              "
                            >
                              <FiEdit2 className="mr-2" />
                              Update
                            </button>
                          </td>
                        </tr>

                        {expandedRows.has(purchase.purchase_id) && (
                          <tr className="bg-gradient-to-r from-emerald-50/50 to-white">
                            <td colSpan="7" className="p-0">
                              <div className="px-6 py-4 border-t border-emerald-100">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center text-emerald-600">
                                    <FiChevronUp className="mr-2" />
                                    <span className="font-medium">Purchase Details</span>
                                  </div>
                                  <button
                                    onClick={() => handleRowClick(purchase.purchase_id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <FiChevronUp />
                                  </button>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-semibold text-gray-700 mb-3">Buyer Information</h4>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-sm text-gray-500">Full Name</p>
                                          <p className="font-medium">{purchase.buyer?.name || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Phone Number</p>
                                          <p className="font-medium">{purchase.buyer?.phone || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">User ID</p>
                                          <p className="font-medium font-mono">{purchase.unique_id}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Description</p>
                                          <p className="font-medium font-mono">{purchase.description}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold text-gray-700 mb-3">Land Information</h4>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-sm text-gray-500">Land ID</p>
                                          <p className="font-medium font-mono">{purchase.land_id}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Location</p>
                                          <p className="font-medium">
                                            {purchase.land_location?.village}, {purchase.land_location?.mandal}
                                            <br />
                                            {purchase.land_location?.district}, {purchase.land_location?.state}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Requested On</p>
                                          <p className="font-medium">{formatDate(purchase.created_at)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
                  Showing <span className="font-bold">{purchaseData.length}</span> purchase requests
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Contacted</span>
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
      </div>

      {/* Update Modal */}
      {selectedPurchase && (
        <UpdateLandPurchaseModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
          refreshTable={fetchPurchaseDetails}
        />
      )}
    </div>
  );
};