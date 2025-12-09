import React, { useState } from "react";
import axios from "axios";
import { FiX, FiSend, FiDollarSign, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { getApiUrl } from "../config/api";

export const UpdateModal = ({ row, onClose, refreshTable }) => {
  const [amount, setAmount] = useState(row.amount);
  const [status, setStatus] = useState(row.status);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: FiLoader },
    { value: "approved", label: "Approved", color: "bg-green-100 text-green-800", icon: FiCheckCircle },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800", icon: FiAlertCircle },
  ];

  const handleSubmit = async () => {
    if (!amount || !status) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        getApiUrl(`/admin/travel/wallet/${row.travel_id}`),
        { amount, status, notes: notes || undefined },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Travel wallet updated successfully!");
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
          border-2 ${status === option.value ? 'border-blue-300 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}
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
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Update Travel Record</h3>
              <p className="text-sm text-gray-600 mt-1">Update amount and status for {row.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-gray-500 text-lg" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">User</p>
                  <p className="font-medium text-gray-800">{row.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Role</p>
                  <p className="font-medium text-gray-800">{row.role}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Session ID</p>
                  <p className="font-medium text-gray-800 font-mono text-xs">{row.session_id}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-800">{row.date}</p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiDollarSign className="mr-2 text-blue-500" />
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  placeholder="Enter amount"
                  min="0"
                  step="1"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  INR
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Update Status
              </label>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <StatusOption key={option.value} option={option} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  px-5 py-2.5 text-white font-medium rounded-lg transition-all
                  flex items-center justify-center min-w-[100px]
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
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
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};