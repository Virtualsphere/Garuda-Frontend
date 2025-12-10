import React, { useState } from "react";
import { 
  FiMap, 
  FiUser, 
  FiDollarSign, 
  FiImage, 
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiMaximize2,
  FiNavigation,
  FiGlobe,
  FiHome,
  FiDroplet,
  FiShield,
  FiFileText,
  FiX,
  FiVideo
} from "react-icons/fi";

export const LandDetails = ({ data }) => {
  const [expandedImages, setExpandedImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `land-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full size land image"
              className="rounded-lg max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => downloadImage(selectedImage, `land-image-full-${Date.now()}.jpg`)}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiDownload className="text-gray-700" />
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <FiMap className="text-emerald-600 text-lg" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Land Details</h4>
                <p className="text-sm text-gray-600">Land ID: {data.land_id || "N/A"}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium flex items-center">
              <FiNavigation className="mr-2 text-emerald-500" />
              GPS Available
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Land Location Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Land Location */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiMap className="mr-2 text-emerald-500" />
                  Land Location
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">State</p>
                    <p className="font-medium text-gray-800">{data.land_location?.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">District</p>
                    <p className="font-medium text-gray-800">{data.land_location?.district || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Mandal</p>
                    <p className="font-medium text-gray-800">{data.land_location?.mandal || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Village</p>
                    <p className="font-medium text-gray-800">{data.land_location?.village || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Verification</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.land_location?.verification === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {data.land_location?.verification || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farmer Details */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiUser className="mr-2 text-blue-500" />
                  Farmer Details
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Age Group</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.age_group || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Literacy</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.literacy || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Land Ownership</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.land_ownership || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Nature</p>
                    <p className="font-medium text-gray-800">{data.farmer_details?.nature || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Land Details & GPS Section */}
            <div className="space-y-6">
              {/* Land Details */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiHome className="mr-2 text-orange-500" />
                  Land Details
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Land Area</p>
                    <p className="font-medium text-gray-800">{data.land_details?.land_area || "N/A"} acres</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Guntas</p>
                    <p className="font-medium text-gray-800">{data.land_details?.guntas || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Price per Acre</p>
                    <p className="font-medium text-gray-800">{formatPrice(data.land_details?.price_per_acre)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Total Price</p>
                    <p className="font-medium text-gray-800">{formatPrice(data.land_details?.total_land_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Land Type</p>
                    <p className="font-medium text-gray-800">{data.land_details?.land_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Water Source</p>
                    <p className="font-medium text-gray-800">{data.land_details?.water_source || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Garden</p>
                    <p className="font-medium text-gray-800">{data.land_details?.garden || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Fencing</p>
                    <p className="font-medium text-gray-800">{data.land_details?.fencing || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* GPS Tracking */}
              {data.gps_tracking && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <FiNavigation className="mr-2 text-purple-500" />
                    GPS Tracking
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Latitude</p>
                      <p className="font-medium text-gray-800 font-mono">{data.gps_tracking.latitude || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Longitude</p>
                      <p className="font-medium text-gray-800 font-mono">{data.gps_tracking.longitude || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Road Path</p>
                      <p className="font-medium text-gray-800">{data.gps_tracking.road_path || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dispute Details */}
            {data.dispute_details && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiShield className="mr-2 text-red-500" />
                  Dispute Details
                </h5>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Type:</span> <span className="font-medium">{data.dispute_details.dispute_type || "N/A"}</span></p>
                  <p><span className="text-gray-500">Siblings Involved:</span> <span className="font-medium">{data.dispute_details.siblings_involve_in_dispute || "N/A"}</span></p>
                </div>
              </div>
            )}

            {/* Land Features */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FiUser className="mr-2 text-green-500" />
                Features
              </h5>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Farm Pond:</span> <span className="font-medium">{data.land_details?.farm_pond || "No"}</span></p>
                <p><span className="text-gray-500">Residential:</span> <span className="font-medium">{data.land_details?.residental || "No"}</span></p>
                <p><span className="text-gray-500">Shed:</span> <span className="font-medium">{data.land_details?.shed_details || "No"}</span></p>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FiFileText className="mr-2 text-blue-500" />
                Documents
              </h5>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Passbook:</span> 
                  {data.land_details?.passbook_photo ? (
                    <a href={data.land_details.passbook_photo} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline ml-1">
                      View
                    </a>
                  ) : (
                    <span className="font-medium ml-1">N/A</span>
                  )}
                </p>
                <p><span className="text-gray-500">Land Border:</span> 
                  {data.gps_tracking?.land_border ? (
                    <a href={data.gps_tracking.land_border} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline ml-1">
                      View
                    </a>
                  ) : (
                    <span className="font-medium ml-1">N/A</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Land Images */}
          {data.document_media?.land_photo?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiImage className="mr-2 text-purple-500" />
                  <h5 className="font-semibold text-gray-700">Land Photos</h5>
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {data.document_media.land_photo.length} {data.document_media.land_photo.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedImages(!expandedImages)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                >
                  {expandedImages ? 'Show Less' : 'Show All'}
                  {expandedImages ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                </button>
              </div>

              <div className={`grid gap-4 ${expandedImages ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
                {data.document_media.land_photo.map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                      <img
                        src={img}
                        alt={`Land Photo ${i + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(img)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(img);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          >
                            <FiMaximize2 className="text-gray-700 text-sm" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(img, `land-photo-${i + 1}-${Date.now()}.jpg`);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          >
                            <FiDownload className="text-gray-700 text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Photo #{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Land Videos */}
          {data.document_media?.land_video?.length > 0 && (
            <div className="mt-6">
              <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FiVideo className="mr-2 text-red-500" />
                Land Videos ({data.document_media.land_video.length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.document_media.land_video.map((video, i) => (
                  <div key={i} className="relative">
                    <video
                      controls
                      className="w-full rounded-xl border border-gray-200"
                      src={video}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Video #{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};