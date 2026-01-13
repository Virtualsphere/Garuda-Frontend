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
  FiMaximize2,
  FiX
} from "react-icons/fi";

export const SessionDetails = ({ data }) => {
  const [expandedImages, setExpandedImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedEndSessions, setExpandedEndSessions] = useState(false);

  // Calculate total transport charges from all end sessions
  const calculateTotalCharges = () => {
    if (data.end_sessions && data.end_sessions.length > 0) {
      return data.end_sessions.reduce((total, session) => 
        total + (parseFloat(session.transport_charges) || 0), 0);
    }
    return data.transport_charges || 0;
  };

  // Calculate total distance for all end sessions
  const calculateTotalDistance = () => {
    if (!data.starting_km || !data.end_sessions || data.end_sessions.length === 0) {
      return "N/A";
    }
    
    // For multiple end sessions, you might want to show total distance
    // or handle it differently based on your business logic
    return `${data.starting_km} - ${data.end_sessions.map(es => es.end_km).join(", ")}`;
  };

  // Get all ticket images from all end sessions
  const getAllTicketImages = () => {
    if (!data.end_sessions || data.end_sessions.length === 0) {
      return data.ticket_image || [];
    }
    
    return data.end_sessions.flatMap(session => 
      session.ticket_image || []
    );
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

  const totalCharges = calculateTotalCharges();
  const allTicketImages = getAllTicketImages();

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
                <p className="text-sm text-gray-600">Session ID: {data.session_id || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {data.end_sessions && data.end_sessions.length > 0 && (
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {data.end_sessions.length} End Session{data.end_sessions.length > 1 ? 's' : ''}
                </div>
              )}
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                Distance: {calculateTotalDistance()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Starting Session Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-5 border border-green-100">
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiClock className="mr-2 text-green-500" />
                  Starting Session
                </h5>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{data.date || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Starting Time</p>
                      <p className="font-medium">{formatTime(data.starting_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Starting KM</p>
                      <p className="text-xl font-bold text-gray-800">{data.starting_km || "N/A"}</p>
                    </div>
                  </div>
                  
                  {data.starting_image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Starting Image</p>
                      <img 
                        src={data.starting_image} 
                        alt="Starting"
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Charges Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-green-500" />
                  Total Charges
                </h5>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Transport Charges</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      ₹{totalCharges}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">From {data.end_sessions?.length || 0} end session(s)</p>
                  </div>
                </div>
              </div>

              {/* End Sessions Summary */}
              {data.end_sessions && data.end_sessions.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-700">End Sessions</h5>
                    <button
                      onClick={() => setExpandedEndSessions(!expandedEndSessions)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      {expandedEndSessions ? 'Show Less' : 'Show All'}
                      {expandedEndSessions ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                    </button>
                  </div>
                  
                  {!expandedEndSessions ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Last End Time</p>
                        <p className="font-medium">{formatTime(data.end_sessions[data.end_sessions.length - 1].end_time)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last End KM</p>
                        <p className="font-medium">{data.end_sessions[data.end_sessions.length - 1].end_km}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.end_sessions.map((session, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">End Session #{index + 1}</span>
                            <span className="text-sm text-gray-500">{formatTime(session.end_time)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">End KM</p>
                              <p className="font-medium">{session.end_km}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Charges</p>
                              <p className="font-medium">₹{session.transport_charges || "0"}</p>
                            </div>
                          </div>
                          
                          {session.end_image && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">End Image</p>
                              <img 
                                src={session.end_image} 
                                alt={`End session ${index + 1}`}
                                className="h-20 w-20 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* All Ticket Images */}
          {allTicketImages.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiImage className="mr-2 text-purple-500" />
                  <h5 className="font-semibold text-gray-700">All Ticket Images</h5>
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {allTicketImages.length} {allTicketImages.length === 1 ? 'image' : 'images'}
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
                {allTicketImages.map((img, i) => (
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