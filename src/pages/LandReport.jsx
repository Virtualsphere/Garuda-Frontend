import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  PanelRight,
  Check,
  X,
  Plus,
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
  Route,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

const MapModal = ({ isOpen, onClose, latitude, longitude, roadPath }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [decodedPath, setDecodedPath] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && latitude && longitude) {
      // Parse coordinates - handle both single and comma-separated values
      let lat, lng;

      if (typeof latitude === "string" && latitude.includes(",")) {
        const coords = latitude
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        lat = coords[0];
      } else {
        lat = parseFloat(latitude);
      }

      if (typeof longitude === "string" && longitude.includes(",")) {
        const coords = longitude
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
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
          const decoded = polyline
            .decode(roadPath)
            .map(([lat, lng]) => ({ lat, lng }));
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
    width: "100%",
    height: "400px",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Road to Land Path
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Showing path to land location
              {latitude && longitude && (
                <span className="ml-2 text-gray-500">
                  (Lat:{" "}
                  {typeof latitude === "string"
                    ? latitude.split(",")[0]
                    : latitude}
                  , Lng:{" "}
                  {typeof longitude === "string"
                    ? longitude.split(",")[0]
                    : longitude}
                  )
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
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
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
                      clickable: false,
                    }}
                  />
                )}

                {/* Start point marker if path exists */}
                {decodedPath && decodedPath.length > 0 && (
                  <Marker
                    position={decodedPath[0]}
                    title="Path Start"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(30, 30),
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
                <span className="text-amber-600">
                  No road path data available for this land
                </span>
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

export default function LandReport() {
  const navigate = useNavigate();
  const [openRow, setOpenRow] = useState(null);
  const [lands, setLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isBuyerSelecting = false;
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLandForMap, setSelectedLandForMap] = useState(null);
  const [filters, setFilters] = useState({
    farmerName: "",
    farmerPhone: "",
    village: "",
    mandal: "",
    pricePerAcreMin: "",
    pricePerAcreMax: "",
    totalPriceMin: "",
    totalPriceMax: "",
  });

  // Form / edit states (read-only)
  const [formData, setFormData] = useState({});

  // Previews from backend
  const [existingLandPhotos, setExistingLandPhotos] = useState([]);
  const [existingLandVideos, setExistingLandVideos] = useState([]);
  const [existingPassbookUrl, setExistingPassbookUrl] = useState(null);
  const [existingLandBorderUrl, setExistingLandBorderUrl] = useState(null);
  const [existingBorderPhotos, setExistingBorderPhotos] = useState([]);

  const API_BASE = "http://72.61.169.226";
  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    fetchLandReport();
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
      roadPath: landData.gps_tracking?.road_path,
    });
    setMapModalOpen(true);
  };

  const fetchLandReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/land/report`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLands(res.data.data || []);
    } catch (error) {
      console.error("Error fetching land report:", error);
      setLands([]);
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

    // Apply the new filters
    const matchesFarmerName =
      filters.farmerName === "" ||
      land.farmer_details?.name
        ?.toLowerCase()
        .includes(filters.farmerName.toLowerCase());

    const matchesFarmerPhone =
      filters.farmerPhone === "" ||
      land.farmer_details?.phone?.includes(filters.farmerPhone);

    const matchesVillage =
      filters.village === "" ||
      land.land_location?.village
        ?.toLowerCase()
        .includes(filters.village.toLowerCase());

    const matchesMandal =
      filters.mandal === "" ||
      land.land_location?.mandal
        ?.toLowerCase()
        .includes(filters.mandal.toLowerCase());

    // Price per Acre filter
    const pricePerAcre = parseFloat(land.land_details?.price_per_acre) || 0;
    const minPricePerAcre = filters.pricePerAcreMin
      ? parseFloat(filters.pricePerAcreMin)
      : 0;
    const maxPricePerAcre = filters.pricePerAcreMax
      ? parseFloat(filters.pricePerAcreMax)
      : Infinity;
    const matchesPricePerAcre =
      pricePerAcre >= minPricePerAcre && pricePerAcre <= maxPricePerAcre;

    // Total Price filter
    const totalPrice = parseFloat(land.land_details?.total_land_price) || 0;
    const minTotalPrice = filters.totalPriceMin
      ? parseFloat(filters.totalPriceMin)
      : 0;
    const maxTotalPrice = filters.totalPriceMax
      ? parseFloat(filters.totalPriceMax)
      : Infinity;
    const matchesTotalPrice =
      totalPrice >= minTotalPrice && totalPrice <= maxTotalPrice;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFarmerName &&
      matchesFarmerPhone &&
      matchesVillage &&
      matchesMandal &&
      matchesPricePerAcre &&
      matchesTotalPrice
    );
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

    const cleanValue = (value) => {
      if (value === null || value === undefined || value === "null") return "";
      return value;
    };

    const visitors = (land.office_work?.visitors || []).map((visitor) => ({
      date: visitor.visit_date,
      name: visitor.visitor_name,
      phone: visitor.visitor_phone,
      status: visitor.visitor_status,
    }));

    const flattened = {
      land_id: cleanValue(land.land_id),
      ...((land.land_location && {
        state: cleanValue(land.land_location.state),
        district: cleanValue(land.land_location.district),
        mandal: cleanValue(land.land_location.mandal),
        village: cleanValue(land.land_location.village),
        location: cleanValue(land.land_location.location),
        status: cleanValue(land.land_location.status),
        verification: cleanValue(land.land_location.verification),
        unique_id: cleanValue(land.land_location.unique_id),
      }) ||
        {}),
      ...((land.farmer_details && {
        name: cleanValue(land.farmer_details.name),
        phone: cleanValue(land.farmer_details.phone),
        whatsapp_number: cleanValue(land.farmer_details.whatsapp_number),
        literacy: cleanValue(land.farmer_details.literacy),
        age_group: cleanValue(land.farmer_details.age_group),
        nature: cleanValue(land.farmer_details.nature),
        land_ownership: cleanValue(land.farmer_details.land_ownership),
        mortgage: cleanValue(land.farmer_details.mortgage),
      }) ||
        {}),
      ...((land.land_details && {
        land_area: cleanValue(land.land_details.land_area),
        guntas: cleanValue(land.land_details.guntas),
        price_per_acre: cleanValue(land.land_details.price_per_acre),
        total_land_price: cleanValue(land.land_details.total_land_price),
        land_type: cleanValue(land.land_details.land_type),
        water_source: Array.isArray(land.land_details.water_source)
          ? land.land_details.water_source
          : land.land_details.water_source
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean) || [],
        garden: Array.isArray(land.land_details.garden)
          ? land.land_details.garden
          : land.land_details.garden
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean) || [],
        shed_details: Array.isArray(land.land_details.shed_details)
          ? land.land_details.shed_details
          : land.land_details.shed_details
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean) || [],
        farm_pond: cleanValue(land.land_details.farm_pond),
        residental: cleanValue(land.land_details.residental),
        fencing: cleanValue(land.land_details.fencing),
      }) ||
        {}),
      ...((land.gps_tracking && {
        road_path: cleanValue(land.gps_tracking.road_path),
        latitude: cleanValue(land.gps_tracking.latitude),
        longitude: cleanValue(land.gps_tracking.longitude),
      }) ||
        {}),
      ...((land.dispute_details && {
        dispute_type: cleanValue(land.dispute_details.dispute_type),
        siblings_involve_in_dispute: cleanValue(
          land.dispute_details.siblings_involve_in_dispute,
        ),
        path_to_land: cleanValue(land.dispute_details.path_to_land),
      }) ||
        {}),
      ...((land.office_work && {
        suggested_farmer_name: cleanValue(
          land.office_work.suggested_farmer_name,
        ),
        suggested_farmer_phone: cleanValue(
          land.office_work.suggested_farmer_phone,
        ),
        suggested_village: cleanValue(land.office_work.suggested_village),
        suggested_mandal: cleanValue(land.office_work.suggested_mandal),
        keep_in_special_package:
          land.office_work.keep_in_special_package === true
            ? "true"
            : land.office_work.keep_in_special_package === false
              ? "false"
              : cleanValue(land.office_work.keep_in_special_package),
        package_name: cleanValue(land.office_work.package_name),
        package_remarks: cleanValue(land.office_work.package_remarks),
        mediator_name: cleanValue(land.office_work.mediator?.mediator_name),
        certification_willingness: cleanValue(
          land.office_work.certification_willingness,
        ),
        certification_location: cleanValue(
          land.office_work.certification_location,
        ),
        board_start_date: cleanValue(land.office_work.board_start_date),
        board_end_date: cleanValue(land.office_work.board_end_date),
        border_latitude: cleanValue(land.office_work.border_latitude),
        border_longitude: cleanValue(land.office_work.border_longitude),
        visitors: visitors || [],
      }) ||
        {}),
    };

    setFormData(flattened);
    const docMedia = land.document_media || {};
    setExistingLandPhotos(
      Array.isArray(docMedia.land_photo) ? docMedia.land_photo : [],
    );
    setExistingLandVideos(
      Array.isArray(docMedia.land_video) ? docMedia.land_video : [],
    );
    setExistingPassbookUrl(land.land_details?.passbook_photo || null);
    setExistingLandBorderUrl(land.gps_tracking?.land_border || null);
    setExistingBorderPhotos(land.office_work?.border_photo || []);
  };

  const clearForm = () => {
    setFormData({});
    setExistingLandPhotos([]);
    setExistingLandVideos([]);
    setExistingPassbookUrl(null);
    setExistingLandBorderUrl(null);
    setExistingBorderPhotos([]);
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
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {formData.latitude || "Not available"}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Longitude
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {formData.longitude || "Not available"}
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div className="flex items-center justify-between p-4">
          <div className="container mx-auto px-2 py-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="text-gray-600" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Land Report Portal
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Header */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="container mx-auto px-2 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="text-gray-600" />
              </button>
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                <PanelRight className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Land Report Portal
                </h1>
                <p className="text-sm mt-1">
                  View land properties data (Read-only)
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Lands</p>
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
                <p className="text-gray-500 text-sm font-medium">
                  Field Verified
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {
                    lands.filter(
                      (l) => l.land_location?.verification === "verified",
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="space-y-6">
            {/* Main Search Row */}
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
                  <option value="all">All Field Status</option>
                  <option value="verified">Field Verified</option>
                  <option value="pending">Field Pending</option>
                  <option value="rejected">Field Rejected</option>
                </select>
              </div>
            </div>

            {/* Filter Form */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Properties
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Farmer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter farmer name"
                    value={filters.farmerName}
                    onChange={(e) =>
                      setFilters({ ...filters, farmerName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={filters.farmerPhone}
                    onChange={(e) =>
                      setFilters({ ...filters, farmerPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village
                  </label>
                  <input
                    type="text"
                    placeholder="Enter village name"
                    value={filters.village}
                    onChange={(e) =>
                      setFilters({ ...filters, village: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                {/* Mandal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mandal
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mandal name"
                    value={filters.mandal}
                    onChange={(e) =>
                      setFilters({ ...filters, mandal: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                {/* Price per Acre Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Acre (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.pricePerAcreMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pricePerAcreMin: e.target.value,
                        })
                      }
                      className="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.pricePerAcreMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pricePerAcreMax: e.target.value,
                        })
                      }
                      className="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      min="0"
                    />
                  </div>
                </div>

                {/* Total Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Price (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.totalPriceMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          totalPriceMin: e.target.value,
                        })
                      }
                      className="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.totalPriceMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          totalPriceMax: e.target.value,
                        })
                      }
                      className="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilters({
                      farmerName: "",
                      farmerPhone: "",
                      village: "",
                      mandal: "",
                      pricePerAcreMin: "",
                      pricePerAcreMax: "",
                      totalPriceMin: "",
                      totalPriceMax: "",
                    });
                    setSearchTerm("");
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    // The filter logic will be applied in the filteredLands calculation
                    // Just trigger a re-render by updating state
                    setFilters({ ...filters });
                  }}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Apply Filters
                </button>
              </div>
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
                  Land Properties Report
                </h2>
                <p className="text-gray-600 mt-1">
                  Click on any row to view details (Read-only mode)
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
                    Field Status
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
                            {item.land_details?.land_type?.toLowerCase() || "-"}
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
                            item.land_location?.verification,
                          )}`}
                        >
                          {item.land_location?.verification === "verified" && (
                            <Check className="w-3 h-3" />
                          )}
                          {item.land_location?.verification || "Pending"}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {openRow === index && (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <div className="px-8 py-6 bg-gradient-to-b from-white to-gray-50">
                            {/* Section Header */}
                            <div className="mb-8">
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-600" />
                                    Land Details Report
                                  </h3>
                                  <p className="text-gray-600 mt-1">
                                    View land details (Read-only mode)
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setOpenRow(null)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    Close
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
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.state || "Not available"}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.district ||
                                              "Not available"}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mandal
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.mandal || "Not available"}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Village
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.village ||
                                              "Not available"}
                                          </div>
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
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.name || "Not available"}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone No
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.phone || "Not available"}
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          WhatsApp Number
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                          {formData.whatsapp_number ||
                                            "Not available"}
                                        </div>
                                      </div>

                                      {/* Quick Select Fields */}
                                      <div className="space-y-3">
                                        {[
                                          ["Literacy", "literacy"],
                                          ["Age Group", "age_group"],
                                          ["Nature", "nature"],
                                          ["Land Ownership", "land_ownership"],
                                          ["Mortgage", "mortgage"],
                                        ].map(([label, field]) => (
                                          <ReadOnlyField
                                            key={field}
                                            label={label}
                                            value={formData[field]}
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
                                      <div className="space-y-3">
                                        {[
                                          ["Dispute Type", "dispute_type"],
                                          [
                                            "Siblings Involved in Dispute",
                                            "siblings_involve_in_dispute",
                                          ],
                                        ].map(([label, field]) => (
                                          <ReadOnlyField
                                            key={field}
                                            label={label}
                                            value={formData[field]}
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
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.land_area ||
                                              "Not available"}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guntas
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.guntas || "Not available"}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price/Acre
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.price_per_acre ||
                                              "Not available"}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Price
                                          </label>
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {formData.total_land_price ||
                                              "Not available"}
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Passbook Photo
                                        </label>
                                        {existingPassbookUrl ? (
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <img
                                              src={existingPassbookUrl}
                                              alt="Passbook"
                                              className="w-32 h-32 object-contain rounded-lg"
                                            />
                                          </div>
                                        ) : (
                                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                                            Not available
                                          </div>
                                        )}
                                      </div>

                                      {/* Land Type Fields */}
                                      <div className="space-y-3">
                                        {[
                                          ["Land Type", "land_type"],
                                          [
                                            "Water Source",
                                            "water_source",
                                            true,
                                          ],
                                          ["Farm Pond", "farm_pond"],
                                          ["Garden", "garden", true],
                                          ["Residential", "residental"],
                                          [
                                            "Shed Details",
                                            "shed_details",
                                            true,
                                          ],
                                          ["Fencing", "fencing"],
                                        ].map(([label, field, isArray]) => (
                                          <ReadOnlyField
                                            key={field}
                                            label={label}
                                            value={
                                              isArray &&
                                              Array.isArray(formData[field])
                                                ? formData[field].join(", ")
                                                : formData[field]
                                            }
                                          />
                                        ))}
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
                                          {existingLandPhotos.length > 0 ? (
                                            <MediaPreviewReadOnly
                                              urls={existingLandPhotos}
                                              type="image"
                                            />
                                          ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                                              No photos available
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Land Videos
                                        </label>
                                        <div className="space-y-3">
                                          {existingLandVideos.length > 0 ? (
                                            <MediaPreviewReadOnly
                                              urls={existingLandVideos}
                                              type="video"
                                            />
                                          ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                                              No videos available
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        latitude={selectedLandForMap?.latitude}
        longitude={selectedLandForMap?.longitude}
        roadPath={selectedLandForMap?.roadPath}
      />
    </div>
  );
}

// Helper Components
function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        {value || "Not available"}
      </div>
    </div>
  );
}

function MediaPreviewReadOnly({ urls, type }) {
  return (
    <div className="flex flex-wrap gap-3">
      {urls.map((url, idx) => (
        <div key={idx} className="relative">
          {type === "image" ? (
            <img
              src={url}
              className="w-20 h-20 rounded-lg object-cover"
              alt={`Media ${idx}`}
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
