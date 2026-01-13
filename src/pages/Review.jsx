import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiStar, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiUser,
  FiMapPin,
  FiMessageSquare,
  FiCalendar,
  FiPlus,
  FiFilter,
  FiSearch,
  FiUpload,
  FiCheckCircle,
  FiXCircle,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiExternalLink,
  FiRefreshCw
} from "react-icons/fi";
import { PanelRight, Menu } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // New review form state
  const [newReview, setNewReview] = useState({
    name: "",
    description: "",
    location: "",
    image: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "http://72.61.169.226/admin";

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setNewReview(prev => ({ ...prev, image: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddReview = async () => {
    if (!newReview.name || !newReview.description || !newReview.location) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('name', newReview.name);
      formData.append('description', newReview.description);
      formData.append('location', newReview.location);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.post(`${API_BASE}/review`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(res.data.message || "Review added successfully");
      
      // Reset form
      setNewReview({
        name: "",
        description: "",
        location: "",
        image: null
      });
      setImageFile(null);
      setImagePreview(null);
      setShowAddModal(false);
      
      // Refresh reviews
      fetchReviews();
      
    } catch (error) {
      console.error("Add review error:", error);
      toast.error(error.response?.data?.error || "Failed to add review");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      const res = await axios.delete(`${API_BASE}/review/${selectedReview.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(res.data.message || "Review deleted successfully");
      
      // Update reviews list
      setReviews(reviews.filter(review => review.id !== selectedReview.id));
      setShowDeleteModal(false);
      setSelectedReview(null);
      
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.error || "Failed to delete review");
    }
  };

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique locations for filter
  const locations = [...new Set(reviews.map(review => review.location))];

  // Filter reviews based on filters
  const filteredReviews = reviews.filter(review => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!review.name?.toLowerCase().includes(term) &&
          !review.description?.toLowerCase().includes(term) &&
          !review.location?.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Location filter
    if (locationFilter !== "all" && review.location !== locationFilter) {
      return false;
    }

    return true;
  });

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
                Customer Reviews
              </h1>
              <p className="text-xs text-gray-500">Manage user reviews</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Customer Reviews</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Reviews: <span className="font-bold">{reviews.length}</span>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <FiRefreshCw />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:opacity-90 transition"
          >
            <FiPlus />
            Add Review
          </button>
        </div>
      </header>

      <div className="p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Customer Reviews
                </h1>
                <p className="text-gray-600">
                  Manage and showcase customer testimonials and reviews
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="hidden lg:flex items-center bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiFilter className="text-blue-500" />
                  Filter Reviews
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Reviews
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, description, location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filter */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("all");
                    }}
                    className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {reviews.length}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <FiStar className="text-amber-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Locations</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {locations.length}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <FiMapPin className="text-emerald-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">With Images</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reviews.filter(r => r.image).length}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FiImage className="text-blue-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Recent (7 days)</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {reviews.filter(review => {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return new Date(review.created_at) > sevenDaysAgo;
                      }).length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <FiCalendar className="text-purple-500 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Content */}
          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiMessageSquare className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No reviews found
                  </h3>
                  <p className="text-gray-500">
                    {reviews.length === 0 
                      ? "No reviews yet. Add your first review!" 
                      : "No reviews match your filters"}
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                    {/* Review Image */}
                    <div className="h-48 overflow-hidden bg-gray-100">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiUser className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{review.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <FiMapPin className="text-gray-400 text-sm" />
                            <span className="text-sm text-gray-600">{review.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => openDeleteModal(review)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* Review Description */}
                      <div className="mb-4">
                        <p className="text-gray-600 line-clamp-3">{review.description}</p>
                      </div>

                      {/* Review Footer */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiCalendar />
                            <span>{formatDate(review.created_at)}</span>
                          </div>
                          {review.image && (
                            <a
                              href={review.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <FiExternalLink />
                              View Image
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600 text-sm font-medium">
                      <th className="py-4 px-6 border-b border-gray-100">#</th>
                      <th className="py-4 px-6 border-b border-gray-100">USER</th>
                      <th className="py-4 px-6 border-b border-gray-100">LOCATION</th>
                      <th className="py-4 px-6 border-b border-gray-100">REVIEW</th>
                      <th className="py-4 px-6 border-b border-gray-100">DATE</th>
                      <th className="py-4 px-6 border-b border-gray-100">IMAGE</th>
                      <th className="py-4 px-6 border-b border-gray-100 text-center">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <FiMessageSquare className="text-4xl mb-2" />
                            <p className="text-lg">No reviews found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map((review, index) => (
                        <tr key={review.id} className="hover:bg-gray-50 transition">
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-700">{index + 1}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              {review.image ? (
                                <img
                                  src={review.image}
                                  alt={review.name}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                  <FiUser className="text-gray-400" />
                                </div>
                              )}
                              <span className="font-medium text-gray-800">{review.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center text-gray-600">
                              <FiMapPin className="mr-2 text-gray-400" />
                              {review.location}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-600 max-w-xs truncate">
                              {review.description}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center text-sm text-gray-600">
                              <FiCalendar className="mr-2 text-gray-400" />
                              {formatDate(review.created_at)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {review.image ? (
                              <a
                                href={review.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <FiEye />
                                View
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">No image</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => openDeleteModal(review)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              <FiTrash2 />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <FiStar className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Add New Review</h3>
                    <p className="text-sm text-gray-600 mt-1">Add a customer testimonial</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiXCircle className="text-gray-500 text-lg" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative max-w-xs mx-auto">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto rounded-lg shadow"
                          />
                          <button
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                              setNewReview(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            <FiXCircle />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                          <FiUpload className="text-2xl text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Upload customer image (Optional)
                          </p>
                          <label className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600 transition">
                            <FiUpload className="mr-2" />
                            Choose Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF • Max 5MB • Optional field
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                    placeholder="Enter customer name"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newReview.location}
                    onChange={(e) => setNewReview(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                    placeholder="Enter location (e.g., City, State)"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Review Description *
                  </label>
                  <textarea
                    value={newReview.description}
                    onChange={(e) => setNewReview(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all resize-none"
                    placeholder="Enter the customer review text..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  disabled={uploading || !newReview.name || !newReview.description || !newReview.location}
                  className={`
                    px-5 py-2.5 text-white font-medium rounded-lg transition-all
                    flex items-center justify-center min-w-[100px]
                    ${uploading || !newReview.name || !newReview.description || !newReview.location
                      ? 'bg-amber-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-lg'
                    }
                  `}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Add Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiTrash2 className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Delete Review</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete the review from <span className="font-semibold">{selectedReview.name}</span>?
                </p>
                {selectedReview.image && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Associated image will also be deleted</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedReview(null);
                  }}
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="px-5 py-2.5 text-white font-medium bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};