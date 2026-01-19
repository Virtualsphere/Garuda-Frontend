import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ArrowLeft, 
  MapPin, 
  Target, 
  Calendar, 
  Phone, 
  User, 
  Droplets,
  TreePine,
  Home,
  Fence,
  Map,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  Heart,
  ExternalLink,
  Building,
  Landmark,
  Users,
  Wallet,
  Clock,
  Star
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const WishlistView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { land: wishlistLand } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [landData, setLandData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch land data based on wishlist
  useEffect(() => {
    if (wishlistLand?.land_id) {
      fetchLandData();
    }
  }, [wishlistLand]);

  const fetchLandData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://72.61.169.226/admin/land/data", {
        params: {
          land_id: wishlistLand.land_id
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      });
      
      if (response.data.data && response.data.data.length > 0) {
        setLandData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching land data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!wishlistLand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Wishlist Data</h2>
          <p className="text-gray-600 mb-6">Please select a wishlist item from the buyers page.</p>
          <button
            onClick={() => navigate("/buyers")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Buyers
          </button>
        </div>
      </div>
    );
  }

  // Calculate match percentage (simplified)
  const calculateMatchPercentage = () => {
    if (!landData || !wishlistLand.buyer_details) return 0;
    
    const buyer = wishlistLand.buyer_details;
    const land = landData;
    
    let score = 0;
    const totalPoints = 5;
    
    // District match
    if (land.land_location?.district?.toLowerCase().includes(buyer.district?.toLowerCase() || '')) {
      score++;
    }
    
    // Budget match (within 10%)
    if (land.land_details?.total_land_price && buyer.total_budget) {
      const budgetDiff = Math.abs(land.land_details.total_land_price - buyer.total_budget) / buyer.total_budget;
      if (budgetDiff <= 0.1) score++;
    }
    
    // Land area match (within 20%)
    if (land.land_details?.land_area && buyer.acres) {
      const areaDiff = Math.abs(land.land_details.land_area - buyer.acres) / buyer.acres;
      if (areaDiff <= 0.2) score++;
    }
    
    // Price per acre match (within 15%)
    if (land.land_details?.price_per_acre && buyer.price_per_acres) {
      const priceDiff = Math.abs(land.land_details.price_per_acre - buyer.price_per_acres) / buyer.price_per_acres;
      if (priceDiff <= 0.15) score++;
    }
    
    // State match
    if (land.land_location?.state?.toLowerCase().includes(buyer.state?.toLowerCase() || '')) {
      score++;
    }
    
    return Math.round((score / totalPoints) * 100);
  };

  const matchPercentage = calculateMatchPercentage();

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (percentage >= 60) return "bg-gradient-to-r from-yellow-500 to-amber-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/buyers")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Wishlist Details</h1>
                <p className="text-gray-600 text-sm">View saved land and buyer requirements</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Buyer Requirements */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              {/* Buyer Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Buyer Requirements</h3>
                      <p className="text-blue-100 text-sm">Saved by {wishlistLand.buyer_details?.name || 'Buyer'}</p>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-white fill-current" />
                </div>
              </div>

              {/* Buyer Details */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {wishlistLand.buyer_details?.name || 'Not specified'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{wishlistLand.buyer_details?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Priority</div>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-sm font-medium">
                        <Clock className="h-3 w-3" />
                        High
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Land Area</span>
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {wishlistLand.buyer_details?.acres || 'N/A'} acres
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Total Budget</span>
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        ₹{(wishlistLand.buyer_details?.total_budget || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Location Requirements */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Location Requirements
                    </h5>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">State</span>
                        <span className="font-medium">{wishlistLand.buyer_details?.state || 'Any'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">District</span>
                        <span className="font-medium">{wishlistLand.buyer_details?.district || 'Any'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Near Towns</span>
                        <span className="font-medium text-right">
                          {wishlistLand.buyer_details?.near_town_1 || 'N/A'}, {wishlistLand.buyer_details?.near_town_2 || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mandal Requirements */}
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      Mandal Preference
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(wishlistLand.buyer_details?.mandal || 'Not specified')
                        .split(',')
                        .map((mandal, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {mandal.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Price per Acre */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Price per Acre</div>
                        <div className="text-xl font-bold text-gray-800">
                          ₹{(wishlistLand.buyer_details?.price_per_acres || 0).toLocaleString()}
                        </div>
                      </div>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Land Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Land Header with Tabs */}
              <div className="border-b border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {landData?.land_location?.state || 'Land Property'}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {landData?.land_location?.village}, {landData?.land_location?.mandal}, {landData?.land_location?.district}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          ₹{(landData?.land_details?.total_land_price || 0).toLocaleString()}
                        </div>
                        <div className="text-gray-600 text-sm">
                          ₹{(landData?.land_details?.price_per_acre || 0).toLocaleString()} per acre
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {['overview', 'details', 'farmer', 'documents', 'location'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                          activeTab === tab
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                  </div>
                ) : !landData ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Land data not found</h3>
                    <p className="text-gray-500">Unable to fetch land details for this wishlist item.</p>
                  </div>
                ) : (
                  <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Land Images */}
                        {landData.document_media?.land_photo?.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Property Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {landData.document_media.land_photo.slice(0, 6).map((photo, idx) => (
                                <div
                                  key={idx}
                                  className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => {
                                    setSelectedImage(photo);
                                    setShowImageModal(true);
                                  }}
                                >
                                  <img
                                    src={photo}
                                    alt={`Land view ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Features */}
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-3">Key Features</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="h-5 w-5 text-emerald-600" />
                                <span className="font-medium">Land Area</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-800">
                                {landData.land_details?.land_area || 'N/A'} acres
                              </div>
                              <div className="text-sm text-gray-500">
                                {landData.land_details?.guntas || 0} guntas
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Droplets className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">Water Source</span>
                              </div>
                              <div className="text-lg font-semibold text-gray-800 capitalize">
                                {landData.land_details?.water_source || 'Not specified'}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <TreePine className="h-5 w-5 text-green-600" />
                                <span className="font-medium">Garden</span>
                              </div>
                              <div className="text-lg font-semibold text-gray-800">
                                {landData.land_details?.garden || 'No'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className={`p-3 rounded-lg ${landData.land_details?.fencing ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <Fence className="h-4 w-4" />
                              <span className="font-medium">Fencing</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${landData.land_details?.farm_pond ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4" />
                              <span className="font-medium">Farm Pond</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${landData.land_details?.residental ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              <span className="font-medium">Residential</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${landData.land_details?.shed_details ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span className="font-medium">Shed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Land Information</h4>
                            <div className="space-y-3">
                              {[
                                { label: 'Land Type', value: landData.land_details?.land_type },
                                { label: 'Water Source', value: landData.land_details?.water_source },
                                { label: 'Fencing', value: landData.land_details?.fencing ? 'Yes' : 'No' },
                                { label: 'Farm Pond', value: landData.land_details?.farm_pond ? 'Yes' : 'No' },
                                { label: 'Residential', value: landData.land_details?.residental ? 'Yes' : 'No' },
                                { label: 'Shed Details', value: landData.land_details?.shed_details || 'None' },
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                                  <span className="text-gray-600">{item.label}</span>
                                  <span className="font-medium text-gray-800 capitalize">{item.value || 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Pricing Details</h4>
                            <div className="space-y-3">
                              {[
                                { label: 'Price per Acre', value: `₹${(landData.land_details?.price_per_acre || 0).toLocaleString()}` },
                                { label: 'Total Land Price', value: `₹${(landData.land_details?.total_land_price || 0).toLocaleString()}` },
                                { label: 'Land Area', value: `${landData.land_details?.land_area || 0} acres` },
                                { label: 'Guntas', value: landData.land_details?.guntas || 0 },
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                                  <span className="text-gray-600">{item.label}</span>
                                  <span className="font-medium text-gray-800">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Farmer Tab */}
                    {activeTab === 'farmer' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                              <User className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {landData.farmer_details?.name || 'Not specified'}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{landData.farmer_details?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{landData.farmer_details?.whatsapp_number || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Literacy</div>
                              <div className="font-medium text-gray-800 capitalize">
                                {landData.farmer_details?.literacy || 'Not specified'}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Age Group</div>
                              <div className="font-medium text-gray-800">
                                {landData.farmer_details?.age_group || 'Not specified'}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Nature</div>
                              <div className="font-medium text-gray-800 capitalize">
                                {landData.farmer_details?.nature || 'Not specified'}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Ownership</div>
                              <div className="font-medium text-gray-800 capitalize">
                                {landData.farmer_details?.land_ownership || 'Not specified'}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Mortgage</div>
                              <div className={`font-medium ${landData.farmer_details?.mortgage ? 'text-red-600' : 'text-green-600'}`}>
                                {landData.farmer_details?.mortgage ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dispute Details */}
                        {landData.dispute_details?.dispute_type && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              <h4 className="font-semibold text-red-700">Dispute Information</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-red-600">Dispute Type</span>
                                <span className="font-medium text-red-700">{landData.dispute_details.dispute_type}</span>
                              </div>
                              {landData.dispute_details.siblings_involve_in_dispute && (
                                <div className="text-red-600">
                                  Siblings involved in dispute
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Documents & Media</h4>
                          
                          {/* Passbook Photo */}
                          {landData.land_details?.passbook_photo && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">Passbook Photo</span>
                              </div>
                              <div className="max-w-md">
                                <img
                                  src={landData.land_details.passbook_photo}
                                  alt="Passbook"
                                  className="rounded-lg border border-gray-200 w-full"
                                />
                              </div>
                            </div>
                          )}

                          {/* Land Videos */}
                          {landData.document_media?.land_video?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">Property Videos ({landData.document_media.land_video.length})</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {landData.document_media.land_video.map((video, idx) => (
                                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-gray-700">Video {idx + 1}</span>
                                      <a
                                        href={video}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                      >
                                        View Full Video
                                      </a>
                                    </div>
                                    <video
                                      src={video}
                                      controls
                                      className="w-full rounded-lg"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Location Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              {[
                                { icon: Building, label: 'State', value: landData.land_location?.state },
                                { icon: Landmark, label: 'District', value: landData.land_location?.district },
                                { icon: MapPin, label: 'Mandal', value: landData.land_location?.mandal },
                                { icon: MapPin, label: 'Village', value: landData.land_location?.village },
                                { icon: Map, label: 'Location', value: landData.land_location?.location },
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <item.icon className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">{item.label}</div>
                                    <div className="font-medium text-gray-800">{item.value || 'Not specified'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-4">
                              {landData.gps_tracking?.latitude && (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Map className="h-5 w-5 text-gray-500" />
                                    <span className="font-medium">GPS Coordinates</span>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <div className="text-sm text-gray-600">Latitude</div>
                                        <div className="font-medium text-gray-800">{landData.gps_tracking.latitude}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-600">Longitude</div>
                                        <div className="font-medium text-gray-800">{landData.gps_tracking.longitude}</div>
                                      </div>
                                    </div>
                                    <a
                                      href={`https://www.google.com/maps?q=${landData.gps_tracking.latitude},${landData.gps_tracking.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Open in Google Maps
                                    </a>
                                  </div>
                                </div>
                              )}

                              {landData.gps_tracking?.road_path && (
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">Road Access</div>
                                  <div className="font-medium text-gray-800">{landData.gps_tracking.road_path}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {landData.gps_tracking?.land_border && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Map className="h-5 w-5 text-gray-500" />
                              <span className="font-medium">Land Border Map</span>
                            </div>
                            <img
                              src={landData.gps_tracking.land_border}
                              alt="Land border map"
                              className="rounded-lg border border-gray-200 w-full max-w-2xl"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <XCircle className="h-8 w-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};