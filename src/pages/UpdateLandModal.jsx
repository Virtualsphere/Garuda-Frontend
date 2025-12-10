import React, { useState } from "react";
import axios from "axios";
import { FiX, FiSend, FiDollarSign, FiCheckCircle, FiAlertCircle, FiLoader, FiClock, FiCalendar, FiBriefcase, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export const UpdateLandModal = ({ row, onClose, onSuccess, isLandMonth }) => {
  const [amount, setAmount] = useState(row.amount);
  const [status, setStatus] = useState(row.status);
  const [loading, setLoading] = useState(false);
  const [expandedUserInfo, setExpandedUserInfo] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: FiLoader },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800", icon: FiClock },
    { value: "approved", label: "Approved", color: "bg-green-100 text-green-800", icon: FiCheckCircle },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800", icon: FiAlertCircle },
    { value: "completed", label: "Completed", color: "bg-purple-100 text-purple-800", icon: FiCheckCircle },
  ];

  const handleSubmit = async () => {
    if (!amount || !status) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const updateData = { 
        status 
      };
      
      if (isLandMonth) {
        updateData.month_end_amount = parseFloat(amount);
      } else {
        updateData.work_amount = parseFloat(amount);
      }

      const endpoint = isLandMonth 
        ? `http://72.61.169.226/admin/land/month/wallet/${row.id || row.land_wallet_id}`
        : `http://72.61.169.226/admin/land/wallet/${row.id || row.land_wallet_id}`;
      
      await axios.put(
        endpoint,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${isLandMonth ? "Land Month Wallet" : "Land Wallet"} updated successfully!`);
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update record");
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
                  {isLandMonth ? <FiCalendar className="text-emerald-600 text-lg" /> : <FiBriefcase className="text-emerald-600 text-lg" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Update {isLandMonth ? "Land Month Wallet" : "Land Wallet"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isLandMonth ? "Month End" : "Work"} Amount for {row.name}
                  </p>
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
              {/* Collapsible User Info */}
              <div className="bg-gray-50 rounded-xl border border-gray-200">
                <button
                  onClick={() => setExpandedUserInfo(!expandedUserInfo)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 rounded-t-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-200 rounded-lg mr-3">
                      <FiBriefcase className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">User Information</span>
                  </div>
                  {expandedUserInfo ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedUserInfo && (
                  <div className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">User</p>
                        <p className="font-medium text-gray-800">{row.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Role</p>
                        <p className="font-medium text-gray-800">{row.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Land ID</p>
                        <p className="font-medium text-gray-800 font-mono text-xs bg-gray-100 p-1 rounded">{row.land_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Date</p>
                        <p className="font-medium text-gray-800">{row.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <FiDollarSign className="mr-2 text-emerald-500" />
                  {isLandMonth ? "Month End Amount (₹)" : "Work Amount (₹)"}
                  <span className="ml-2 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {isLandMonth ? "Monthly" : "Per Work"}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                    placeholder={isLandMonth ? "Enter month end amount" : "Enter work amount"}
                    min="0"
                    step="1"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    INR
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {isLandMonth 
                    ? "This amount will be sent as month_end_amount field"
                    : "This amount will be sent as work_amount field"}
                </p>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Update Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <StatusOption key={option.value} option={option} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col space-y-3">
              <div className="text-xs text-gray-500 text-center">
                Updating: <span className="font-mono font-medium">{isLandMonth ? "month_end_amount" : "work_amount"}</span> field
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
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg'
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
                      {isLandMonth ? "Update Month" : "Update Work"}
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