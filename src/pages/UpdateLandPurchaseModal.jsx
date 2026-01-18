import React, { useState } from "react";
import axios from "axios";
import { FiX, FiSend, FiCheckCircle, FiAlertCircle, FiLoader, FiChevronDown, FiChevronUp, FiUser, FiCalendar, FiCreditCard } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export const UpdateLandPurchaseModal = ({ purchase, onClose, refreshTable }) => {
  const [status, setStatus] = useState(purchase.status);
  const [loading, setLoading] = useState(false);
  const [expandedBuyerInfo, setExpandedBuyerInfo] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: FiLoader },
    { value: "approved", label: "Approved", color: "bg-green-100 text-green-800", icon: FiCheckCircle },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800", icon: FiAlertCircle },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800", icon: FiLoader },
    { value: "completed", label: "Completed", color: "bg-purple-100 text-purple-800", icon: FiCheckCircle },
  ];

  const handleSubmit = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://72.61.169.226/admin/purchase/land",
        { 
          land_id: purchase.land_id,
          unique_id: purchase.unique_id,
          status 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Purchase status updated successfully!");
      refreshTable();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatusOption = ({ option }) => {
    const Icon = option.icon;
    return (
      <div
        onClick={() => setStatus(option.value)}
        className={`
          flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
          border-2 ${status === option.value ? 'border-emerald-300 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}
          hover:shadow-sm
        `}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${option.color.split(' ')[0]} mr-3`}>
            <Icon className={`${option.color.split(' ')[1]}`} />
          </div>
          <span className="font-medium">{option.label}</span>
        </div>
        {status === option.value && (
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-fadeInUp my-4">
          {/* Header - Fixed */}
          <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <FiCreditCard className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Update Purchase Status</h3>
                  <p className="text-sm text-gray-600 mt-1">Land: {purchase.land_id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Collapsible Buyer Info */}
              <div className="bg-gray-50 rounded-xl border border-gray-200">
                <button
                  onClick={() => setExpandedBuyerInfo(!expandedBuyerInfo)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 rounded-t-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-200 rounded-lg mr-3">
                      <FiUser className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">Buyer Information</span>
                  </div>
                  {expandedBuyerInfo ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedBuyerInfo && (
                  <div className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Buyer Name</p>
                        <p className="font-medium text-gray-800">{purchase.buyer?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Phone</p>
                        <p className="font-medium text-gray-800">{purchase.buyer?.phone || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 mb-1">User ID</p>
                        <p className="font-medium text-gray-800 font-mono text-xs bg-gray-100 p-1 rounded">
                          {purchase.unique_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Land ID</p>
                        <p className="font-medium text-gray-800 font-mono text-xs bg-gray-100 p-1 rounded">
                          {purchase.land_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Request Date</p>
                        <p className="font-medium text-gray-800 flex items-center">
                          <FiCalendar className="mr-1 text-gray-400" />
                          {formatDate(purchase.created_at)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 mb-1">Current Status</p>
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium border
                          ${(() => {
                            switch (purchase.status?.toLowerCase()) {
                              case "approved": return "bg-green-100 text-green-800 border-green-200";
                              case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                              case "rejected": return "bg-red-100 text-red-800 border-red-200";
                              default: return "bg-gray-100 text-gray-800 border-gray-200";
                            }
                          })()}
                        `}>
                          {purchase.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Update Purchase Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <StatusOption key={option.value} option={option} />
                  ))}
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-gray-600">Approved</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-gray-600">Pending</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-gray-600">Rejected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-gray-600">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col space-y-3">
              <div className="text-xs text-gray-500 text-center">
                Updating purchase status for: <span className="font-mono font-medium">{purchase.land_id}</span>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1 md:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`
                    px-5 py-2.5 text-white font-medium rounded-lg transition-all
                    flex items-center justify-center min-w-[100px] flex-1 md:flex-none
                    ${loading 
                      ? 'bg-emerald-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};