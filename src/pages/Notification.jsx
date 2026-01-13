import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiBell, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiFilter,
  FiRefreshCw,
  FiMoreVertical,
  FiSearch,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiCheckSquare,
  FiAlertCircle
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, complete
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://72.61.169.226/admin/notification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      const res = await axios.put(
        `http://72.61.169.226/admin/notification/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, status: newStatus, updated_at: new Date().toISOString() }
            : notification
        )
      );

      toast.success(res.data.message || "Notification updated");
      
      // Collapse if was expanded
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error(error.response?.data?.error || "Failed to update notification");
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsComplete = async () => {
    try {
      const pendingNotifications = notifications.filter(n => n.status === "pending");
      
      // Update each pending notification
      const updatePromises = pendingNotifications.map(notification =>
        updateNotificationStatus(notification.id, "complete")
      );

      await Promise.all(updatePromises);
      toast.success("All notifications marked as complete");
    } catch (error) {
      console.error("Error marking all as complete:", error);
      toast.error("Failed to mark all as complete");
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://72.61.169.226/admin/notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
      
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return <FiCheckCircle className="text-green-500" />;
      case "pending":
        return <FiClock className="text-yellow-500 animate-pulse" />;
      default:
        return <FiAlertCircle className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  // Filter and search notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Apply status filter
      if (filter !== "all" && notification.status !== filter) return false;
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          notification.title?.toLowerCase().includes(searchLower) ||
          notification.message?.toLowerCase().includes(searchLower) ||
          notification.type?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by latest first

  const pendingCount = notifications.filter(n => n.status === "pending").length;
  const completeCount = notifications.filter(n => n.status === "complete").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-3">
                  <FiBell className="text-white text-xl" />
                </div>
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all system notifications
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
              
              {pendingCount > 0 && (
                <button
                  onClick={markAllAsComplete}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center shadow-sm"
                >
                  <FiCheckSquare className="mr-2" />
                  Mark All as Complete
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiBell className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <FiClock className="text-yellow-500 text-xl animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Complete</p>
                  <p className="text-2xl font-bold text-green-600">{completeCount}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Last Updated</p>
                  <p className="text-sm font-medium text-gray-800">
                    {notifications.length > 0 
                      ? getRelativeTime(notifications[0].created_at)
                      : "No notifications"
                    }
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-gray-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FiFilter className="text-gray-400 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                >
                  <option value="all">All Notifications</option>
                  <option value="pending">Pending Only</option>
                  <option value="complete">Complete Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Notification Center ({filteredNotifications.length})
              </h2>
              <div className="text-sm text-gray-600">
                Click to expand details
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBell className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-500 text-lg">No notifications found</p>
                <p className="text-gray-400 mt-1">
                  {search ? "Try a different search term" : "All notifications are complete!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 transition-all duration-200
                    ${expandedId === notification.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    ${notification.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}
                  `}
                >
                  {/* Notification Header */}
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedId(expandedId === notification.id ? null : notification.id)}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">
                            {notification.title || "Untitled Notification"}
                          </h3>
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-medium border
                            ${getStatusColor(notification.status)}
                          `}>
                            {notification.status || "unknown"}
                          </span>
                          {notification.type && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {notification.type}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {notification.message || "No message provided"}
                        </p>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <FiCalendar className="mr-1" />
                          {getRelativeTime(notification.created_at)}
                          {notification.updated_at && notification.updated_at !== notification.created_at && (
                            <span className="ml-3">
                              Updated: {getRelativeTime(notification.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expandedId === notification.id ? null : notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedId === notification.id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <FiMoreVertical className="text-gray-500" />
                        </button>
                        
                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden group-hover:block">
                          <div className="py-1">
                            {notification.status === "pending" ? (
                              <button
                                onClick={() => updateNotificationStatus(notification.id, "complete")}
                                disabled={updatingId === notification.id}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiCheckCircle className="mr-2 text-green-500" />
                                Mark as Complete
                              </button>
                            ) : (
                              <button
                                onClick={() => updateNotificationStatus(notification.id, "pending")}
                                disabled={updatingId === notification.id}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FiClock className="mr-2 text-yellow-500" />
                                Mark as Pending
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            >
                              <FiXCircle className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === notification.id && (
                    <div className="mt-4 pl-10">
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Full Message</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {notification.message || "No detailed message available"}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500">Notification ID</p>
                              <p className="text-sm font-mono font-medium">{notification.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Type</p>
                              <p className="text-sm font-medium">{notification.type || "General"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Created</p>
                              <p className="text-sm font-medium">{formatDate(notification.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <div className="flex items-center">
                                <span className={`
                                  px-2 py-1 rounded text-xs font-medium
                                  ${getStatusColor(notification.status)}
                                `}>
                                  {notification.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-3 pt-4 border-t border-gray-100">
                            {notification.status === "pending" ? (
                              <button
                                onClick={() => updateNotificationStatus(notification.id, "complete")}
                                disabled={updatingId === notification.id}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center disabled:opacity-50"
                              >
                                {updatingId === notification.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <FiCheckCircle className="mr-2" />
                                    Mark as Complete
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => updateNotificationStatus(notification.id, "pending")}
                                disabled={updatingId === notification.id}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center disabled:opacity-50"
                              >
                                <FiClock className="mr-2" />
                                Mark as Pending
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                            >
                              <FiXCircle className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing <span className="font-bold">{filteredNotifications.length}</span> of{" "}
                <span className="font-bold">{notifications.length}</span> notifications
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};