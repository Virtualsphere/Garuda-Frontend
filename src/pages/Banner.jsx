import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiImage, 
  FiUpload, 
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import { PanelRight, Menu } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "http://72.61.169.226/admin";

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/banner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanner(res.data.data);
    } catch (error) {
      console.error("Error fetching banner:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load banner");
      }
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
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await axios.post(`${API_BASE}/banner`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(res.data.message || "Banner uploaded successfully");
      
      // Reset states
      setImageFile(null);
      setImagePreview(null);
      
      // Refresh banner data
      fetchBanner();
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload banner");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveBanner = async () => {
    try {
      // Since your backend truncates the table on new upload,
      // we'll simulate removal by uploading an empty banner
      const formData = new FormData();
      
      const res = await axios.post(`${API_BASE}/banner`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Banner removed successfully");
      setBanner(null);
      setShowDeleteConfirm(false);
      
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove banner");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

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
                Banner Management
              </h1>
              <p className="text-xs text-gray-500">Manage app banner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Banner Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchBanner}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </header>

      <div className="p-6 pt-20 lg:pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Banner Management
                </h1>
                <p className="text-gray-600">
                  Upload and manage the main banner for your application
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-bold ${banner ? 'text-green-600' : 'text-yellow-600'}`}>
                    {banner ? 'Active' : 'No Banner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiUpload className="text-purple-500" />
                  Upload New Banner
                </h2>
                <div className="text-sm text-gray-500">
                  Replace existing banner
                </div>
              </div>

              <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative max-w-2xl mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto rounded-xl shadow-lg max-h-64 object-contain"
                        />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <FiXCircle />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Selected: {imageFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiImage className="text-3xl text-purple-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Supports JPG, PNG, GIF • Max 5MB
                        </p>
                        <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg cursor-pointer hover:opacity-90 transition">
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

                {/* Upload Info */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Important Note:</p>
                      <p>Uploading a new banner will automatically replace the existing banner. Only one banner can be active at a time.</p>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={!imageFile || uploading}
                    className={`
                      px-8 py-3 text-white font-medium rounded-lg transition-all
                      flex items-center gap-2
                      ${!imageFile || uploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-lg'
                      }
                    `}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload />
                        Upload Banner
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Banner Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiImage className="text-green-500" />
                  Current Active Banner
                </h2>
                {/**
                {banner && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <FiTrash2 />
                    Remove Banner
                  </button>
                )}
                */}
              </div>

              {banner ? (
                <div className="space-y-6">
                  {/* Banner Preview */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/3">
                        <div className="relative bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                          {banner.image ? (
                            <img
                              src={banner.image}
                              alt="Current Banner"
                              className="w-full h-auto object-cover"
                            />
                          ) : (
                            <div className="h-48 flex items-center justify-center bg-gray-100">
                              <FiImage className="text-4xl text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-sm mb-1">Banner ID</p>
                            <p className="font-medium text-gray-800">{banner.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm mb-1">Image URL</p>
                            <p className="font-medium text-gray-800 truncate">
                              {banner.image ? (
                                <a 
                                  href={banner.image} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Image
                                </a>
                              ) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm mb-1">Created At</p>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                              <FiCalendar className="text-gray-400" />
                              {formatDate(banner.created_at)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm mb-1">Status</p>
                            <p className="font-medium text-gray-800">
                              <span className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                Active
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Banner Preview URL */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 text-sm mb-2">Banner URL for Use:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 truncate">
                              {banner.image || 'No image URL available'}
                            </code>
                            {banner.image && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(banner.image);
                                  toast.success('URL copied to clipboard');
                                }}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Instructions */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-medium text-purple-800 mb-2">How to Use This Banner:</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• This banner will appear on the homepage of your application</li>
                      <li>• The banner automatically updates when you upload a new image</li>
                      <li>• Use the URL above to reference the banner in your frontend</li>
                      <li>• Only one banner can be active at any time</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiImage className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No Active Banner
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Upload a banner to start displaying it on your application
                  </p>
                  <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg cursor-pointer hover:opacity-90 transition">
                    <FiUpload className="mr-2" />
                    Upload Your First Banner
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiAlertCircle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Remove Banner</h3>
                  <p className="text-gray-600 text-sm">This will delete the current banner</p>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
                <p className="text-red-700 text-sm">
                  <span className="font-medium">Warning:</span> This action cannot be undone. 
                  The banner will be permanently removed from the system.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveBanner}
                  className="px-5 py-2.5 text-white font-medium bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all"
                >
                  Remove Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};