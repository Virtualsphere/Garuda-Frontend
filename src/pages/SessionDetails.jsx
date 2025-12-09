import React, { useState } from "react";
import { 
  FiCalendar, 
  FiClock, 
  FiNavigation, 
  FiDollarSign, 
  FiImage, 
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiMaximize2
} from "react-icons/fi";

export const SessionDetails = ({ data }) => {
  const [expandedImages, setExpandedImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const calculateDistance = () => {
    if (data.starting_km && data.end_km) {
      return (parseFloat(data.end_km) - parseFloat(data.starting_km)).toFixed(1);
    }
    return "N/A";
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time.split(':').slice(0, 2).join(':');
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `ticket-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              alt="Full size ticket"
              className="rounded-lg max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => downloadImage(selectedImage, `ticket-full-${Date.now()}.jpg`)}
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
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FiCalendar className="text-blue-600 text-lg" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Session Details</h4>
                <p className="text-sm text-gray-600">ID: {data.session_id || "N/A"}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              Distance: {calculateDistance()} KM
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Section */}
            <div className="space-y-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiClock className="mr-2 text-blue-500" />
                  Timeline
                </h5>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-1 mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium text-gray-800">{formatTime(data.starting_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1 mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500">End Time</p>
                      <p className="font-medium text-gray-800">{formatTime(data.end_time)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kilometer Section */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiNavigation className="mr-2 text-blue-500" />
                  Kilometer Reading
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Start KM</p>
                    <p className="text-xl font-bold text-gray-800">{data.starting_km || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">End KM</p>
                    <p className="text-xl font-bold text-gray-800">{data.end_km || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charges Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-green-500" />
                  Charges
                </h5>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Transport Charges</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      ₹{data.transport_charges || "0"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Per KM Rate</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{(parseFloat(data.transport_charges || 0) / parseFloat(calculateDistance()) || 0).toFixed(2)}/km
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-700 mb-2">Additional Information</h5>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Date:</span> <span className="font-medium">{data.date || "N/A"}</span></p>
                  <p><span className="text-gray-500">Session Duration:</span> <span className="font-medium">Calculating...</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Images */}
          {data.ticket_image?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiImage className="mr-2 text-purple-500" />
                  <h5 className="font-semibold text-gray-700">Ticket Images</h5>
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {data.ticket_image.length} {data.ticket_image.length === 1 ? 'image' : 'images'}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedImages(!expandedImages)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  {expandedImages ? 'Show Less' : 'Show All'}
                  {expandedImages ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                </button>
              </div>

              <div className={`grid gap-4 ${expandedImages ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
                {data.ticket_image.map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                      <img
                        src={img}
                        alt={`Ticket ${i + 1}`}
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
                              downloadImage(img, `ticket-${i + 1}-${Date.now()}.jpg`);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          >
                            <FiDownload className="text-gray-700 text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Ticket #{i + 1}</p>
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