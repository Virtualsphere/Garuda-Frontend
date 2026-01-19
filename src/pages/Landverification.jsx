import { React, useContext, createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  PanelRight,
  Check,
  X,
  Plus,
  Upload,
  MapPin,
  User,
  Landmark,
  FileImage,
  Video,
  Shield,
  Star,
  Filter,
  Menu,
  Trash2,
  Navigation,
  Target,
  Route
} from "lucide-react";
import { 
  FiEye
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

const VerificationContext = createContext();

const MapModal = ({ isOpen, onClose, latitude, longitude, roadPath }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [decodedPath, setDecodedPath] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && latitude && longitude) {
      // Parse coordinates - handle both single and comma-separated values
      let lat, lng;
      
      if (typeof latitude === 'string' && latitude.includes(',')) {
        const coords = latitude.split(',').map(coord => parseFloat(coord.trim()));
        lat = coords[0];
      } else {
        lat = parseFloat(latitude);
      }
      
      if (typeof longitude === 'string' && longitude.includes(',')) {
        const coords = longitude.split(',').map(coord => parseFloat(coord.trim()));
        lng = coords[0];
      } else {
        lng = parseFloat(longitude);
      }

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        setMapZoom(15);
      }

      // Decode polyline if exists
      if (roadPath) {
        try {
          const decoded = polyline.decode(roadPath).map(([lat, lng]) => ({ lat, lng }));
          setDecodedPath(decoded);
        } catch (error) {
          console.error("Error decoding polyline:", error);
          setDecodedPath(null);
        }
      } else {
        setDecodedPath(null);
      }
    }
  }, [isOpen, latitude, longitude, roadPath]);

  if (!isOpen) return null;

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Road to Land Path</h3>
            <p className="text-gray-600 text-sm mt-1">
              Showing path to land location
              {latitude && longitude && (
                <span className="ml-2 text-gray-500">
                  (Lat: {typeof latitude === 'string' ? latitude.split(',')[0] : latitude}, 
                  Lng: {typeof longitude === 'string' ? longitude.split(',')[0] : longitude})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <LoadScript 
            googleMapsApiKey="AIzaSyAD_1yL7L3YcqdNthx7m1P6D2qv9Lbn_cY"
            onLoad={() => setGoogleMapsLoaded(true)}
          >
            {googleMapsLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
              >
                {/* Marker for land location */}
                <Marker
                  position={mapCenter}
                  title="Land Location"
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />

                {/* Polyline for road path */}
                {decodedPath && decodedPath.length > 0 && (
                  <Polyline
                    path={decodedPath}
                    options={{
                      strokeColor: "#10B981",
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                      geodesic: true,
                      clickable: false
                    }}
                  />
                )}

                {/* Start point marker if path exists */}
                {decodedPath && decodedPath.length > 0 && (
                  <Marker
                    position={decodedPath[0]}
                    title="Path Start"
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      scaledSize: new window.google.maps.Size(30, 30)
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </LoadScript>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {decodedPath ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Path Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Land Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-emerald-400 rounded"></div>
                    <span>Road Path</span>
                  </div>
                </div>
              ) : (
                <span className="text-amber-600">No road path data available for this land</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LandVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [openRow, setOpenRow] = useState(null);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState([]);
  const [verificationChecks, setVerificationChecks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminVerificationFilter, setAdminVerificationFilter] = useState("all");
  const isBuyerSelecting = !!state?.buyer_id;
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLandForMap, setSelectedLandForMap] = useState(null);

  // Form / edit states
  const [formData, setFormData] = useState({
    water_source: [],
    garden: [],
    shed_details: [],
    keep_in_special_package: "false"
  });
  const [passbookPhoto, setPassbookPhoto] = useState(null);
  const [landBorder, setLandBorder] = useState(null);
  const [landPhotos, setLandPhotos] = useState([]);
  const [landVideos, setLandVideos] = useState([]);
  const [borderPhotos, setBorderPhotos] = useState([]);

  // Previews from backend
  const [existingLandPhotos, setExistingLandPhotos] = useState([]);
  const [existingLandVideos, setExistingLandVideos] = useState([]);
  const [existingPassbookUrl, setExistingPassbookUrl] = useState(null);
  const [existingLandBorderUrl, setExistingLandBorderUrl] = useState(null);
  const [existingBorderPhotos, setExistingBorderPhotos] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mediators, setMediators] = useState([]);
  const [loadingMediators, setLoadingMediators] = useState(false);

  const API_BASE = "http://72.61.169.226";
  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    fetchLand();
  }, []);

  const openRoadPathMap = (landData) => {
    if (!landData) return;
    
    // Check if we have coordinates
    const lat = landData.gps_tracking?.latitude;
    const lng = landData.gps_tracking?.longitude;
    
    if (!lat || !lng) {
      alert("No GPS coordinates available for this land");
      return;
    }

    setSelectedLandForMap({
      latitude: lat,
      longitude: lng,
      roadPath: landData.gps_tracking?.road_path
    });
    setMapModalOpen(true);
  };

  const fetchMediators = async (districtName) => {
    try {
      if (!districtName) {
        setMediators([]);
        return;
      }

      setLoadingMediators(true);
      const token = getToken();
      
      // Fetch all users with their details
      const res = await fetch(`${API_BASE}/admin/personal/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        if (!data?.users) {
          setMediators([]);
          return;
        }

        // Filter users by role (mediator) and work district
        const filteredMediators = data.users
          .filter(user => {
            // Check if user has the right role
            const userRole = user.role?.toLowerCase();
            const isMediatorRole = userRole === 'mediator';
            
            // Get work location from work_location data
            const workLocation = data.work_location?.find((x) => x.unique_id === user.unique_id);
            const worksInDistrict = workLocation?.work_district === districtName;
            
            return isMediatorRole && worksInDistrict;
          })
          .map(user => ({
            id: user.unique_id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            work_location: data.work_location?.find((x) => x.unique_id === user.unique_id) || {},
          }));

        setMediators(filteredMediators);
        
        console.log(`Found ${filteredMediators.length} mediators in district: ${districtName}`);
        
      } else {
        console.error("Failed to fetch users for mediators");
        setMediators([]);
      }
    } catch (error) {
      console.error("Error fetching mediators:", error);
      setMediators([]);
    } finally {
      setLoadingMediators(false);
    }
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? "true" : "false"
    }));
  };

  const handleVerifyClick = (field, status) => {
    setVerificationChecks((prev) => ({
      ...prev,
      [field]: status,
    }));
  };

  const fetchLand = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/land`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: {
          district: state?.district || "",
          land_state: state?.state || "",
          price_per_acre: state?.price_per_acres || "",
          total_land_price: state?.total_land_price || "",
          land_area: state?.land_area || "",
          comparison: "lessOrEqual",
        },
      });
      setLands(res.data.data || []);
    } catch (error) {
      console.error("Error fetching lands:", error);
    }
  };

  // Filter lands based on search and status
  const filteredLands = lands.filter((land) => {
    const matchesSearch =
      searchTerm === "" ||
      land.land_location?.district
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      land.land_location?.village
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      land.land_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      land.land_location?.verification?.toLowerCase() === statusFilter;

    const matchesAdminVerification =
      adminVerificationFilter === "all" ||
      land.land_location?.admin_verification?.toLowerCase() === adminVerificationFilter;

    return matchesSearch && matchesStatus && matchesAdminVerification;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAdminVerificationColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const addToWishlist = async () => {
    try {
      if (!isBuyerSelecting) {
        alert("No buyer_id found. Cannot add wishlist.");
        return;
      }

      if (selectedLand.length === 0) {
        alert("Please select at least one land.");
        return;
      }

      const token = getToken();
      const payload = {
        buyer_id: state.buyer_id,
        land_ids: selectedLand,
      };

      const response = await axios.post(
        `${API_BASE}/admin/wishlist`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Wishlist added successfully!");
      setSelectedLand([]);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to add wishlist";
      alert(msg);
    }
  };

  const toggleRow = (index) => {
    const newOpen = openRow === index ? null : index;
    setOpenRow(newOpen);

    if (newOpen !== null) {
      const land = filteredLands[newOpen];
      populateForm(land);
    } else {
      clearForm();
    }
  };

  const populateForm = (land) => {
    if (!land) return;

    const visitors = (land.office_work?.visitors || []).map(visitor => ({
      date: visitor.visit_date,
      name: visitor.visitor_name,
      phone: visitor.visitor_phone,
      status: visitor.visitor_status
    }));

    const flattened = {
      land_id: land.land_id,
      ...((land.land_location && {
        state: land.land_location.state,
        district: land.land_location.district,
        mandal: land.land_location.mandal,
        village: land.land_location.village,
        location: land.land_location.location,
        status: land.land_location.status,
        verification: land.land_location.verification,
        admin_verification: land.land_location.admin_verification,
        unique_id: land.land_location.unique_id,
      }) || {}),
      ...((land.farmer_details && {
        name: land.farmer_details.name,
        phone: land.farmer_details.phone,
        whatsapp_number: land.farmer_details.whatsapp_number,
        literacy: land.farmer_details.literacy,
        age_group: land.farmer_details.age_group,
        nature: land.farmer_details.nature,
        land_ownership: land.farmer_details.land_ownership,
        mortgage: land.farmer_details.mortgage,
      }) || {}),
      ...((land.land_details && {
        land_area: land.land_details.land_area,
        guntas: land.land_details.guntas,
        price_per_acre: land.land_details.price_per_acre,
        total_land_price: land.land_details.total_land_price,
        land_type: land.land_details.land_type,
        water_source: Array.isArray(land.land_details.water_source) 
          ? land.land_details.water_source 
          : land.land_details.water_source?.split(',').map(item => item.trim()).filter(Boolean) || [],
        garden: Array.isArray(land.land_details.garden) 
          ? land.land_details.garden 
          : land.land_details.garden?.split(',').map(item => item.trim()).filter(Boolean) || [],
        shed_details: Array.isArray(land.land_details.shed_details) 
          ? land.land_details.shed_details 
          : land.land_details.shed_details?.split(',').map(item => item.trim()).filter(Boolean) || [],
        farm_pond: land.land_details.farm_pond,
        residental: land.land_details.residental,
        fencing: land.land_details.fencing,
      }) || {}),
      ...((land.gps_tracking && {
        road_path: land.gps_tracking.road_path,
        latitude: land.gps_tracking.latitude,
        longitude: land.gps_tracking.longitude,
      }) || {}),
      ...((land.dispute_details && {
        dispute_type: land.dispute_details.dispute_type,
        siblings_involve_in_dispute: land.dispute_details.siblings_involve_in_dispute,
        path_to_land: land.dispute_details.path_to_land,
      }) || {}),
      ...((land.office_work && {
        suggested_farmer_name: land.office_work.suggested_farmer_name,
        suggested_farmer_phone: land.office_work.suggested_farmer_phone,
        suggested_village: land.office_work.suggested_village,
        suggested_mandal: land.office_work.suggested_mandal,
        keep_in_special_package: land.office_work.keep_in_special_package,
        package_name: land.office_work.package_name,
        package_remarks: land.office_work.package_remarks,
        mediator_id: land.office_work.mediator?.mediator_id || '',
        certification_willingness: land.office_work.certification_willingness,
        certification_location: land.office_work.certification_location,
        board_start_date: land.office_work.board_start_date,
        board_end_date: land.office_work.board_end_date,
        border_latitude: land.office_work.border_latitude,
        border_longitude: land.office_work.border_longitude,
        visitors: visitors || [],
      }) || {}),
    };

    setFormData(flattened);
    const docMedia = land.document_media || {};
    setExistingLandPhotos(
      Array.isArray(docMedia.land_photo) ? docMedia.land_photo : []
    );
    setExistingLandVideos(
      Array.isArray(docMedia.land_video) ? docMedia.land_video : []
    );
    setExistingPassbookUrl(land.land_details?.passbook_photo || null);
    setExistingLandBorderUrl(land.gps_tracking?.land_border || null);
    setExistingBorderPhotos(land.office_work?.border_photo || []);
    setPassbookPhoto(null);
    setLandBorder(null);
    setLandPhotos([]);
    setLandVideos([]);
    setBorderPhotos([]);
    if (land.land_location?.district) {
      fetchMediators(land.land_location.district);
    } else {
      setMediators([]);
    }
  };

  const clearForm = () => {
    setFormData({});
    setPassbookPhoto(null);
    setLandBorder(null);
    setLandPhotos([]);
    setLandVideos([]);
    setExistingLandPhotos([]);
    setExistingLandVideos([]);
    setExistingPassbookUrl(null);
    setExistingLandBorderUrl(null);
    setExistingBorderPhotos([]);
    setMediators([]);
  };

  const handleInput = (e) => {
    const name = e.target?.name;
    const value = e.target?.value;
    if (!name) return;
    if (name === "district") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      fetchMediators(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectButton = (field, value) => {
    setFormData((prev) => {
      if (
        field === "water_source" ||
        field === "garden" ||
        field === "shed_details"
      ) {
        return { ...prev, [field]: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const addPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLandPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setLandPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideos = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLandVideos((prev) => [...prev, ...files]);
  };

  const removeVideo = (index) => {
    setLandVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const addBorderPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBorderPhotos((prev) => [...prev, ...files]);
  };

  const removeBorderPhoto = (index) => {
    setBorderPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorStatus, setVisitorStatus] = useState("Interested");

  const handleAddVisitor = () => {
    if (!visitorName || !visitorPhone) {
      alert("Please enter visitor name and phone");
      return;
    }

    const newVisitor = {
      date: new Date().toISOString().split("T")[0],
      name: visitorName,
      phone: visitorPhone,
      status: visitorStatus,
    };

    setFormData((prev) => ({
      ...prev,
      visitors: [...(prev.visitors || []), newVisitor]
    }));

    setVisitorName("");
    setVisitorPhone("");
    setVisitorStatus("Interested");
  };

  const handleRemoveVisitor = (index) => {
    setFormData((prev) => ({
      ...prev,
      visitors: (prev.visitors || []).filter((_, i) => i !== index)
    }));
  };

  const deleteLand = async (landId) => {
    if (!window.confirm("Are you sure you want to delete this land? This action cannot be undone.")) {
      return;
    }

    try {
      const token = getToken();
      const url = `${API_BASE}/admin/land/data/${encodeURIComponent(landId)}`;
      
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Land deleted successfully!");
      
      setLands(prevLands => prevLands.filter(land => land.land_id !== landId));
      setSelectedLand(prev => prev.filter(id => id !== landId));
      
      if (openRow !== null) {
        const landInRow = filteredLands[openRow];
        if (landInRow && landInRow.land_id === landId) {
          setOpenRow(null);
        }
      }
      
      await fetchLand();
    } catch (error) {
      console.error("Error deleting land:", error);
      const msg = error.response?.data?.message || error.message || "Failed to delete land";
      alert(`Delete failed: ${msg}`);
    }
  };

  const updateLand = async () => {
    let adminVerificationStatus = "pending"; // Default to pending
    
    try {
      if (!formData.land_id) {
        alert("Missing land_id");
        return;
      }

      // Determine admin verification status based on verification checks
      const allChecks = Object.values(verificationChecks);
      if (allChecks.length > 0) {
        // If any check is "fail", set to rejected
        if (allChecks.includes("fail")) {
          adminVerificationStatus = "rejected";
        } 
        // If all checks are "ok", set to verified
        else if (allChecks.every(check => check === "ok")) {
          adminVerificationStatus = "verified";
        }
        // If mixed or some are not checked, keep as pending
        else {
          adminVerificationStatus = "pending";
        }
      }

      const fd = new FormData();
      
      // Add all form data
      Object.keys(formData).forEach((k) => {
        const v = formData[k];
        
        // Handle special cases
        if (k === 'admin_verification' || k === 'verification') {
          return; // We'll add admin_verification separately
        }
        
        if (Array.isArray(v)) {
          // For arrays, join with comma and space
          if (k === 'visitors') {
            // Special handling for visitors - send as JSON string
            fd.append(k, JSON.stringify(v || []));
          } else {
            fd.append(k, v.join(', '));
          }
        } else if (k === 'mediator_name') {
          return; // Don't send mediator_name to backend
        } else {
          fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v || ''));
        }
      });

      // Add admin verification status
      fd.append("admin_verification", adminVerificationStatus);
      
      // Add file uploads
      if (passbookPhoto) fd.append("passbook_photo", passbookPhoto);
      if (landBorder) fd.append("land_border", landBorder);
      landPhotos.forEach((f) => fd.append("land_photo", f));
      landVideos.forEach((f) => fd.append("land_video", f));
      borderPhotos.forEach((f) => fd.append("border_photo", f));

      const token = getToken();
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = `${API_BASE}/admin/land/${encodeURIComponent(formData.land_id)}`;
      
      console.log("Updating land with admin_verification:", adminVerificationStatus);
      
      const res = await axios.put(url, fd, { headers });

      alert("Update successful");
      await fetchLand();
      setVerificationChecks({}); // Reset verification checks after successful update
    } catch (err) {
      console.error("Update failed:", err);
      const msg = err.response?.data?.message || err.message || "Update failed";
      alert(msg);
    }
  };

  const getCurrentLocation = (field) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (field === 'main') {
            setFormData(prev => ({
              ...prev,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            }));
          } else if (field === 'border') {
            setFormData(prev => ({
              ...prev,
              border_latitude: position.coords.latitude.toString(),
              border_longitude: position.coords.longitude.toString(),
            }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch current location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const renderGPSTrackingSection = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Navigation className="w-5 h-5 text-blue-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800">
          GPS & Path Tracking
        </h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Land Entry Point
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Latitude
              </label>
              <div className="flex gap-2">
                <input
                  name="latitude"
                  onChange={handleInput}
                  value={formData.latitude || ""}
                  placeholder="Latitude"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => getCurrentLocation('main')}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  title="Get current location"
                >
                  <Navigation size={16} />
                </button>
              </div>
              <VerificationButtons field="latitude" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Longitude
              </label>
              <input
                name="longitude"
                onChange={handleInput}
                value={formData.longitude || ""}
                placeholder="Longitude"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
              <VerificationButtons field="longitude" />
            </div>
          </div>
        </div>

        {/* Road to Path Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              const currentLand = filteredLands[openRow];
              if (currentLand) {
                openRoadPathMap(currentLand);
              }
            }}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <Route className="w-5 h-5" />
            View Road to Path
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Click to view the road path to this land location on map
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <VerificationContext.Provider
      value={{ verificationChecks, handleVerifyClick }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <div className="flex items-center justify-between p-4">
            <div className="container mx-auto px-2 py-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Land Verification Portal
                  </h1>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/land-purchase`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
                title="View purchase requests"
              >
                <FiEye className="w-4 h-4" />
                Enquiry
              </button>

              {isBuyerSelecting && (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block bg-white/10 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">
                      Buyer ID: {state.buyer_id}
                    </span>
                  </div>
                  <button
                    onClick={addToWishlist}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Add to Wishlist
                    {selectedLand.length > 0 && (
                      <span className="ml-2 bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                        {selectedLand.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Enhanced Header */}
        <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
          <div className="container mx-auto px-2 py-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <PanelRight className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Land Verification Portal
                  </h1>
                  <p className="text-sm mt-1">
                    Manage and verify land properties with precision
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/land-purchase`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
                title="View purchase requests"
              >
                <FiEye className="w-4 h-4" />
                Enquiry
              </button>

              {isBuyerSelecting && (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block bg-white/10 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">
                      Buyer ID: {state.buyer_id}
                    </span>
                  </div>
                  <button
                    onClick={addToWishlist}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Add to Wishlist
                    {selectedLand.length > 0 && (
                      <span className="ml-2 bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                        {selectedLand.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Lands
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {lands.length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Landmark className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Admin Verified</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {
                      lands.filter(
                        (l) => l.land_location?.admin_verification === "verified"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Admin Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {
                      lands.filter(
                        (l) => l.land_location?.admin_verification === "pending"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Selected</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {selectedLand.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by district, village, or land code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <select
                  value={adminVerificationFilter}
                  onChange={(e) => setAdminVerificationFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                >
                  <option value="all">All Admin Status</option>
                  <option value="verified">Admin Verified</option>
                  <option value="pending">Admin Pending</option>
                  <option value="rejected">Admin Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Land Properties
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Click on any row to view and edit details
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {filteredLands.length} of {lands.length} lands
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    {isBuyerSelecting && (
                      <th className="text-left p-7 text-gray-700 font-semibold">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={
                              selectedLand.length === filteredLands.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLand(
                                  filteredLands.map((l) => l.land_id)
                                );
                              } else {
                                setSelectedLand([]);
                              }
                            }}
                          />
                          Select All
                        </div>
                      </th>
                    )}
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Actions
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Location
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      User Detail
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Land Info
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Pricing
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Land Code
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Status
                    </th>
                    <th className="text-left p-7 text-gray-700 font-semibold">
                      Admin Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredLands.map((item, index) => (
                    <>
                      {/* Main Row */}
                      <tr
                        key={item.land_id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          openRow === index ? "bg-emerald-50" : ""
                        }`}
                        onClick={() => toggleRow(index)}
                      >
                        {isBuyerSelecting && (
                          <td className="p-7">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 w-5 h-5"
                                checked={selectedLand.includes(item.land_id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedLand((prev) =>
                                    prev.includes(item.land_id)
                                      ? prev.filter((id) => id !== item.land_id)
                                      : [...prev, item.land_id]
                                  );
                                }}
                              />
                            </div>
                          </td>
                        )}

                        <td className="p-7">
                          <div className="flex items-center gap-3">
                            <button
                              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                              onClick={() => toggleRow(index)}
                            >
                              {openRow === index ? (
                                <>
                                  <ChevronUp className="w-5 h-5" />
                                  <span className="font-medium">Hide</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-5 h-5" />
                                  <span className="font-medium">View</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLand(item.land_id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                              title="Delete this land"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>

                        <td className="p-7">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {item.land_location?.district || "-"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.land_location?.village || "-"}
                            </div>
                          </div>
                        </td>

                        <td className="p-7">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {item.user_detail?.user_name || "-"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.user_detail?.user_role || "-"}
                            </div>
                          </div>
                        </td>

                        <td className="p-7">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-700">
                              {item.land_details?.land_area || "-"} Acres
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {item.land_details?.land_type?.toLowerCase() ||
                                "-"}
                            </div>
                          </div>
                        </td>

                        <td className="p-7">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-700">
                              ₹
                              {item.land_details?.price_per_acre?.toLocaleString() ||
                                "-"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: ₹
                              {item.land_details?.total_land_price?.toLocaleString() ||
                                "-"}
                            </div>
                          </div>
                        </td>

                        <td className="p-7">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <span className="font-mono font-medium text-gray-700">
                              {item.land_id || "-"}
                            </span>
                          </div>
                        </td>

                        <td className="p-7">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                              item.land_location?.verification
                            )}`}
                          >
                            {item.land_location?.verification ===
                              "verified" && <Check className="w-3 h-3" />}
                            {item.land_location?.verification || "Unknown"}
                          </span>
                        </td>

                        <td className="p-7">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getAdminVerificationColor(
                              item.land_location?.admin_verification
                            )}`}
                          >
                            {item.land_location?.admin_verification ===
                              "verified" && <Check className="w-3 h-3" />}
                            {item.land_location?.admin_verification || "Pending"}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {openRow === index && (
                        <tr>
                          <td
                            colSpan={isBuyerSelecting ? 9 : 8}
                            className="p-0"
                          >
                            <div className="px-8 py-6 bg-gradient-to-b from-white to-gray-50">
                              {/* Section Header */}
                              <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                      <User className="w-5 h-5 text-emerald-600" />
                                      Field Executive Section
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                      Edit and verify land details
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => setOpenRow(null)}
                                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      Close
                                    </button>
                                    <button
                                      onClick={() => deleteLand(formData.land_id)}
                                      className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Land
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  {/* Left Column - Form Sections */}
                                  <div className="space-y-6">
                                    {/* Village Address Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                          <MapPin className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          Village Address
                                        </h4>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              State
                                            </label>
                                            <input
                                              name="state"
                                              onChange={handleInput}
                                              value={formData.state || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="state" />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              District
                                            </label>
                                            <input
                                              name="district"
                                              onChange={handleInput}
                                              value={formData.district || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="district" />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Mandal
                                            </label>
                                            <input
                                              name="mandal"
                                              onChange={handleInput}
                                              value={formData.mandal || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="mandal" />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Village
                                            </label>
                                            <input
                                              name="village"
                                              onChange={handleInput}
                                              value={formData.village || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="village" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Farmer Details Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                          <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          Farmer Details
                                        </h4>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Name
                                            </label>
                                            <input
                                              name="name"
                                              onChange={handleInput}
                                              value={formData.name || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="name" />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Phone No
                                            </label>
                                            <input
                                              name="phone"
                                              onChange={handleInput}
                                              value={formData.phone || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="phone" />
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            WhatsApp Number
                                          </label>
                                          <input
                                            name="whatsapp_number"
                                            onChange={handleInput}
                                            value={
                                              formData.whatsapp_number || ""
                                            }
                                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                          />
                                          <VerificationButtons field="whatsapp_number" />
                                        </div>

                                        {/* Quick Select Buttons */}
                                        <div className="space-y-3">
                                          {[
                                            [
                                              "Literacy",
                                              "literacy",
                                              [
                                                "Literate",
                                                "Illiterate",
                                                "Graduate",
                                              ],
                                            ],
                                            [
                                              "Age Group",
                                              "age_group",
                                              ["Young", "30-50", "50 Above"],
                                            ],
                                            [
                                              "Nature",
                                              "nature",
                                              ["Polite", "Medium", "Rude"],
                                            ],
                                            [
                                              "Land Ownership",
                                              "land_ownership",
                                              ["Joint", "Single"],
                                            ],
                                            [
                                              "Mortgage",
                                              "mortgage",
                                              ["Yes", "No"],
                                            ],
                                          ].map(([label, field, options]) => (
                                            <QuickSelectField
                                              key={field}
                                              label={label}
                                              field={field}
                                              options={options}
                                              value={formData[field]}
                                              onChange={handleSelectButton}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Dispute Details Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                          <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          Dispute Details
                                        </h4>
                                      </div>

                                      <div className="space-y-4">
                                        {/* Quick Select Buttons */}
                                        <div className="space-y-3">
                                          {[
                                            [
                                              "Dispute Type",
                                              "dispute_type",
                                              [
                                                "Boundary",
                                                "Ownership",
                                                "Family",
                                                "Other",
                                                "Budhan",
                                                "Land Sealing",
                                                "Electric Poles",
                                                "Canal Planning",
                                              ],
                                            ],
                                            [
                                              "Siblings Involved in Dispute",
                                              "siblings_involve_in_dispute",
                                              ["Yes", "No"],
                                            ],
                                          ].map(([label, field, options]) => (
                                            <QuickSelectField
                                              key={field}
                                              label={label}
                                              field={field}
                                              options={options}
                                              value={formData[field]}
                                              onChange={handleSelectButton}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {renderGPSTrackingSection()}
                                  </div>

                                  {/* Right Column - Form Sections */}
                                  <div className="space-y-6">
                                    {/* Land Details Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                          <Landmark className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          Land Details
                                        </h4>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Acres
                                            </label>
                                            <input
                                              name="land_area"
                                              onChange={handleInput}
                                              value={formData.land_area || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="land_area" />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Guntas
                                            </label>
                                            <input
                                              name="guntas"
                                              onChange={handleInput}
                                              value={formData.guntas || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="guntas" />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Price/Acre
                                            </label>
                                            <input
                                              name="price_per_acre"
                                              onChange={handleInput}
                                              value={
                                                formData.price_per_acre || ""
                                              }
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="price_per_acre" />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Total Price
                                            </label>
                                            <input
                                              name="total_land_price"
                                              onChange={handleInput}
                                              value={
                                                formData.total_land_price || ""
                                              }
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            />
                                            <VerificationButtons field="total_land_price" />
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Passbook Photo
                                          </label>
                                          <FileUpload
                                            accept="image/*"
                                            onChange={(e) =>
                                              setPassbookPhoto(
                                                e.target.files[0]
                                              )
                                            }
                                            existingFile={existingPassbookUrl}
                                            selectedFile={passbookPhoto}
                                          />
                                          <VerificationButtons field="passbook" />
                                        </div>

                                        {/* Land Type Selectors */}
                                        <div className="space-y-3">
                                          {[
                                            [
                                              "Land Type",
                                              "land_type",
                                              ["Red", "Black", "Sand"],
                                            ],
                                            [
                                              "Water Source",
                                              "water_source",
                                              [
                                                "Canal",
                                                "Bores",
                                                "Cheruvu",
                                                "Rain Water Only",
                                              ],
                                            ],
                                            [
                                              "Farm Pond",
                                              "farm_pond",
                                              ["Yes", "No"],
                                            ],
                                            [
                                              "Garden",
                                              "garden",
                                              [
                                                "Mango",
                                                "Coconut",
                                                "Guava",
                                                "Sapota",
                                              ],
                                            ],
                                            [
                                              "Residential",
                                              "residental",
                                              [
                                                "Farm House",
                                                "RCC Home",
                                                "Asbestos Shelter",
                                                "Hut",
                                              ],
                                            ],
                                            [
                                              "Shed Details",
                                              "shed_details",
                                              ["Poultry", "Cow Shed"],
                                            ],
                                            [
                                              "Fencing",
                                              "fencing",
                                              [
                                                "With Gate",
                                                "All Sides",
                                                "Partially",
                                                "No",
                                              ],
                                            ],
                                          ].map(([label, field, options]) =>
                                            field === "water_source" ||
                                            field === "garden" ||
                                            field === "shed_details" ? (
                                              <MultiSelectField
                                                key={field}
                                                label={label}
                                                field={field}
                                                options={options}
                                                value={formData[field] || []}
                                                onChange={handleSelectButton}
                                              />
                                            ) : (
                                              <QuickSelectField
                                                key={field}
                                                label={label}
                                                field={field}
                                                options={options}
                                                value={formData[field]}
                                                onChange={handleSelectButton}
                                              />
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Media Upload Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                          <FileImage className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          Documents & Media
                                        </h4>
                                      </div>

                                      <div className="space-y-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Land Photos
                                          </label>
                                          <div className="space-y-3">
                                            <input
                                              type="file"
                                              multiple
                                              accept="image/*"
                                              onChange={addPhotos}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                            />
                                            <MediaPreview
                                              files={landPhotos}
                                              existingUrls={existingLandPhotos}
                                              onRemove={removePhoto}
                                              type="image"
                                            />
                                          </div>
                                          <VerificationButtons field="photos" />
                                        </div>

                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Land Videos
                                          </label>
                                          <div className="space-y-3">
                                            <input
                                              type="file"
                                              multiple
                                              accept="video/*"
                                              onChange={addVideos}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <MediaPreview
                                              files={landVideos}
                                              existingUrls={existingLandVideos}
                                              onRemove={removeVideo}
                                              type="video"
                                            />
                                          </div>
                                          <VerificationButtons field="videos" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-red-50 rounded-lg">
                                        <Target className="w-5 h-5 text-red-600" />
                                      </div>
                                      <h4 className="text-lg font-semibold text-gray-800">
                                        Office Work
                                      </h4>
                                    </div>

                                    <div className="space-y-4">
                                      {/* New Land Suggestion */}
                                      <div className="space-y-3">
                                        <h5 className="font-medium text-gray-700">New Land Suggestion</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Suggested Farmer Name
                                            </label>
                                            <input
                                              name="suggested_farmer_name"
                                              onChange={handleInput}
                                              value={formData.suggested_farmer_name || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Suggested Farmer Phone
                                            </label>
                                            <input
                                              name="suggested_farmer_phone"
                                              onChange={handleInput}
                                              value={formData.suggested_farmer_phone || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Suggested Village
                                            </label>
                                            <input
                                              name="suggested_village"
                                              onChange={handleInput}
                                              value={formData.suggested_village || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Suggested Mandal
                                            </label>
                                            <input
                                              name="suggested_mandal"
                                              onChange={handleInput}
                                              value={formData.suggested_mandal || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Special Package */}
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            name="keep_in_special_package"
                                            checked={formData.keep_in_special_package === "true"}
                                            onChange={(e) => handleCheckboxChange("keep_in_special_package", e.target.checked)}
                                            className="w-4 h-4"
                                          />
                                          <label className="text-sm text-gray-700">
                                            Keep in Special Package
                                          </label>
                                        </div>
                                        
                                        {formData.keep_in_special_package === "true" && (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                Package Name
                                              </label>
                                              <input
                                                name="package_name"
                                                onChange={handleInput}
                                                value={formData.package_name || ""}
                                                placeholder="e.g. Hot Deal"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                Package Remarks
                                              </label>
                                              <input
                                                name="package_remarks"
                                                onChange={handleInput}
                                                value={formData.package_remarks || ""}
                                                placeholder="e.g. Limited time, urgent"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Assign Mediator */}
                                      <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                          Assign Mediator
                                        </label>
                                        <div className="space-y-2">
                                          <div className="text-sm text-gray-600 mb-1">
                                            Current Mediator: <span className="font-medium">{formData.mediator_name || "Not assigned"}</span>
                                          </div>
                                          <select
                                            name="mediator_id"
                                            onChange={handleInput}
                                            value={formData.mediator_id || ""}
                                            disabled={loadingMediators}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                          >
                                            <option value="">Select a mediator...</option>
                                            {mediators.map((mediator) => (
                                              <option key={mediator.id} value={mediator.id}>
                                                {mediator.name} - {mediator.phone} ({mediator.role})
                                              </option>
                                            ))}
                                          </select>
                                          <p className="text-xs text-gray-500">
                                            {loadingMediators 
                                              ? "Loading mediators..." 
                                              : mediators.length === 0
                                                ? `No mediators found in ${formData.district || "selected"} district`
                                                : `Found ${mediators.length} mediator(s) in ${formData.district || "selected"} district`}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Land Certification Process */}
                                      <div className="space-y-3">
                                        <h5 className="font-medium text-gray-700">Land Certification Process</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Certification Willingness
                                            </label>
                                            <select
                                              name="certification_willingness"
                                              onChange={handleInput}
                                              value={formData.certification_willingness || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            >
                                              <option value="">Select...</option>
                                              <option value="Thinking">Thinking</option>
                                              <option value="Interested">Interested</option>
                                              <option value="Not Interested">Not Interested</option>
                                              <option value="Already Certified">Already Certified</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Certification Location
                                            </label>
                                            <input
                                              name="certification_location"
                                              onChange={handleInput}
                                              value={formData.certification_location || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Board Duration */}
                                      <div className="space-y-3">
                                        <h6 className="text-sm font-medium text-gray-700">Board Duration</h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Start Date
                                            </label>
                                            <input
                                              type="date"
                                              name="board_start_date"
                                              onChange={handleInput}
                                              value={formData.board_start_date || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              End Date
                                            </label>
                                            <input
                                              type="date"
                                              name="board_end_date"
                                              onChange={handleInput}
                                              value={formData.board_end_date || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Border Coordinates */}
                                      <div className="space-y-3">
                                        <h6 className="text-sm font-medium text-gray-700">Board Coordinates</h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Board Latitude
                                            </label>
                                            <div className="flex gap-2">
                                              <input
                                                name="border_latitude"
                                                onChange={handleInput}
                                                value={formData.border_latitude || ""}
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => getCurrentLocation('border')}
                                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                title="Get current border location"
                                              >
                                                <Navigation size={14} />
                                              </button>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Board Longitude
                                            </label>
                                            <input
                                              name="border_longitude"
                                              onChange={handleInput}
                                              value={formData.border_longitude || ""}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Border Photos */}
                                      <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                          Board Photos
                                        </label>
                                        <input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          onChange={addBorderPhotos}
                                          className="w-full p-2 rounded-lg border border-gray-300"
                                        />
                                        <MediaPreview
                                          files={borderPhotos}
                                          existingUrls={existingBorderPhotos}
                                          onRemove={removeBorderPhoto}
                                          type="image"
                                        />
                                      </div>

                                      {/* Visitor Details */}
                                      <div className="space-y-3">
                                        <h6 className="text-sm font-medium text-gray-700">Visitor Details</h6>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Visitor Name
                                            </label>
                                            <input
                                              type="text"
                                              value={visitorName}
                                              onChange={(e) => setVisitorName(e.target.value)}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Visitor Phone
                                            </label>
                                            <input
                                              type="text"
                                              value={visitorPhone}
                                              onChange={(e) => setVisitorPhone(e.target.value)}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 mb-1">
                                              Status
                                            </label>
                                            <select
                                              value={visitorStatus}
                                              onChange={(e) => setVisitorStatus(e.target.value)}
                                              className="w-full p-2 rounded-lg border border-gray-300"
                                            >
                                              <option value="Interested">Interested</option>
                                              <option value="Not Interested">Not Interested</option>
                                              <option value="Follow up">Follow up</option>
                                            </select>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={handleAddVisitor}
                                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                                        >
                                          + Add Visitor
                                        </button>

                                        {/* Visitors List */}
                                        {(formData.visitors || []).length > 0 && (
                                          <div className="mt-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                              Previous Visitors ({formData.visitors.length})
                                            </div>
                                            <div className="max-h-32 overflow-y-auto">
                                              {(formData.visitors || []).map((visitor, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1">
                                                  <div className="text-xs">
                                                    <div className="font-medium">{visitor.name}</div>
                                                    <div className="text-gray-500">{visitor.phone} • {visitor.date}</div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                      visitor.status === "Interested" 
                                                        ? "bg-green-100 text-green-700"
                                                        : visitor.status === "Not Interested"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                      {visitor.status}
                                                    </span>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleRemoveVisitor(index)}
                                                      className="text-red-500 hover:text-red-700"
                                                    >
                                                      <X size={14} />
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                {/* Save Button */}
                                 <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-500">
                                    All changes will be saved to the database
                                  </div>
                                  <button
                                    onClick={updateLand}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                                  >
                                    <Check className="w-5 h-5" />
                                    Save Land Details
                                  </button>
                                </div>
                              </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>

              {filteredLands.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No lands found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        latitude={selectedLandForMap?.latitude}
        longitude={selectedLandForMap?.longitude}
        roadPath={selectedLandForMap?.roadPath}
      />
    </VerificationContext.Provider>
  );
}

// Helper Components
function VerificationButtons({ field }) {
  const { verificationChecks, handleVerifyClick } =
    useContext(VerificationContext);

  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={() => handleVerifyClick(field, "ok")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          verificationChecks[field] === "ok"
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Check className="w-3 h-3" />
        OK
      </button>
      <button
        type="button"
        onClick={() => handleVerifyClick(field, "fail")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          verificationChecks[field] === "fail"
            ? "bg-rose-100 text-rose-700 border border-rose-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <X className="w-3 h-3" />
        Fail
      </button>
    </div>
  );
}

function QuickSelectField({ label, field, options, value, onChange }) {
  const { verificationChecks, handleVerifyClick } =
    useContext(VerificationContext);

  // Don't render for multi-select fields
  if (
    field === "water_source" ||
    field === "garden" ||
    field === "shed_details"
  ) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(field, option)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value === option
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <VerificationButtons field={field} />
    </div>
  );
}

function MultiSelectField({ label, field, options, value = [], onChange }) {
  const { verificationChecks, handleVerifyClick } =
    useContext(VerificationContext);

  const handleToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(field, newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value.includes(option)
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500">
          Selected: {value.length > 0 ? value.join(", ") : "None"}
        </span>
      </div>
      <VerificationButtons field={field} />
    </div>
  );
}

function FileUpload({ accept, onChange, existingFile, selectedFile }) {
  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
      />
      {(selectedFile || existingFile) && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {selectedFile ? (
            <>
              <FileImage className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={existingFile}
                alt="Existing"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <span className="text-sm text-gray-500">Existing file</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MediaPreview({ files, existingUrls, onRemove, type }) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Existing files */}
      {existingUrls.map((url, idx) => (
        <div key={`existing-${idx}`} className="relative group">
          {type === "image" ? (
            <img
              src={url}
              className="w-20 h-20 rounded-lg object-cover"
              alt={`Existing ${idx}`}
            />
          ) : (
            <video
              src={url}
              className="w-20 h-20 rounded-lg object-cover"
              controls
            />
          )}
        </div>
      ))}

      {/* New files */}
      {files.map((file, idx) => (
        <div key={idx} className="relative group">
          {type === "image" ? (
            <img
              src={URL.createObjectURL(file)}
              className="w-20 h-20 rounded-lg object-cover"
              alt={`New ${idx}`}
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              className="w-20 h-20 rounded-lg object-cover"
              controls
            />
          )}
          <button
            onClick={() => onRemove(idx)}
            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

const Search = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Clock = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);