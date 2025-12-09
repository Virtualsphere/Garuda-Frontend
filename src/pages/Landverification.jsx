import { React, useContext, createContext, useEffect, useState } from "react";
import axios from "axios";
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
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { getApiUrl } from "../config/api";

const VerificationContext = createContext();

export default function LandVerification() {
  const { state } = useLocation();
  const [openRow, setOpenRow] = useState(null);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState([]);
  const [verificationChecks, setVerificationChecks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isBuyerSelecting = !!state?.buyer_id;

  // Form / edit states
  const [formData, setFormData] = useState({});
  const [passbookPhoto, setPassbookPhoto] = useState(null);
  const [landBorder, setLandBorder] = useState(null);
  const [landPhotos, setLandPhotos] = useState([]);
  const [landVideos, setLandVideos] = useState([]);

  // Previews from backend
  const [existingLandPhotos, setExistingLandPhotos] = useState([]);
  const [existingLandVideos, setExistingLandVideos] = useState([]);
  const [existingPassbookUrl, setExistingPassbookUrl] = useState(null);
  const [existingLandBorderUrl, setExistingLandBorderUrl] = useState(null);

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    fetchLand();
  }, []);

  const handleVerifyClick = (field, status) => {
    setVerificationChecks((prev) => ({
      ...prev,
      [field]: status,
    }));
  };

  const fetchLand = async () => {
    try {
      const res = await axios.get(getApiUrl(`/admin/land`), {
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

    return matchesSearch && matchesStatus;
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
        getApiUrl(`/admin/wishlist`),
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

    const flattened = {
      land_id: land.land_id,
      ...((land.land_location && {
        state: land.land_location.state,
        district: land.land_location.district,
        mandal: land.land_location.mandal,
        village: land.land_location.village,
        location: land.land_location.location,
        status: land.land_location.status,
      }) ||
        {}),
      ...((land.farmer_details && {
        name: land.farmer_details.name,
        phone: land.farmer_details.phone,
        whatsapp_number: land.farmer_details.whatsapp_number,
        literacy: land.farmer_details.literacy,
        age_group: land.farmer_details.age_group,
        nature: land.farmer_details.nature,
        land_ownership: land.farmer_details.land_ownership,
        mortgage: land.farmer_details.mortgage,
      }) ||
        {}),
      ...((land.land_details && {
        land_area: land.land_details.land_area,
        guntas: land.land_details.guntas,
        price_per_acre: land.land_details.price_per_acre,
        total_land_price: land.land_details.total_land_price,
        land_type: land.land_details.land_type,
        water_source: land.land_details.water_source,
        garden: land.land_details.garden,
        shed_details: land.land_details.shed_details,
        farm_pond: land.land_details.farm_pond,
        residental: land.land_details.residental,
        fencing: land.land_details.fencing,
      }) ||
        {}),
      ...((land.gps_tracking && {
        road_path: land.gps_tracking.road_path,
        latitude: land.gps_tracking.latitude,
        longitude: land.gps_tracking.longitude,
      }) ||
        {}),
      ...((land.dispute_details && {
        dispute_type: land.dispute_details.dispute_type,
        siblings_involve_in_dispute:
          land.dispute_details.siblings_involve_in_dispute,
        path_to_land: land.dispute_details.path_to_land,
      }) ||
        {}),
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
    setPassbookPhoto(null);
    setLandBorder(null);
    setLandPhotos([]);
    setLandVideos([]);
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
  };

  const handleInput = (e) => {
    const name = e.target?.name;
    const value = e.target?.value;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectButton = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const updateLand = async () => {
    let verificationStatus = "verified";
    try {
      if (!formData.land_id) {
        alert("Missing land_id");
        return;
      }

      const fd = new FormData();
      Object.values(verificationChecks).forEach((v) => {
        if (v === "fail") {
          verificationStatus = "in progress";
        }
      });

      Object.keys(formData).forEach((k) => {
        const v = formData[k];
        fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
      });

      fd.append("verification", verificationStatus);
      if (passbookPhoto) fd.append("passbook_photo", passbookPhoto);
      if (landBorder) fd.append("land_border", landBorder);
      landPhotos.forEach((f) => fd.append("land_photo", f));
      landVideos.forEach((f) => fd.append("land_video", f));

      const token = getToken();
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = getApiUrl(`/admin/land/${encodeURIComponent(
        formData.land_id
      )}`);
      const res = await axios.put(url, fd, { headers });

      alert("Update successful");
      await fetchLand();
    } catch (err) {
      console.error("Update failed:", err);
      const msg = err.response?.data?.message || err.message || "Update failed";
      alert(msg);
    }
  };

  return (
    <VerificationContext.Provider
      value={{ verificationChecks, handleVerifyClick }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-white shadow-lg">
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
                  <p className="text-gray-500 text-sm font-medium">Verified</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {
                      lands.filter(
                        (l) => l.land_location?.verification === "verified"
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
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {
                      lands.filter(
                        (l) => l.land_location?.verification === "pending"
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
                  <option value="rejected">In Progress</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
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
                      <th className="text-left p-6 text-gray-700 font-semibold">
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
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Details
                    </th>
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Location
                    </th>
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Land Info
                    </th>
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Pricing
                    </th>
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Land Code
                    </th>
                    <th className="text-left p-6 text-gray-700 font-semibold">
                      Status
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
                          <td className="p-6">
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

                        <td className="p-6">
                          <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                            {openRow === index ? (
                              <>
                                <ChevronUp className="w-5 h-5" />
                                <span className="font-medium">
                                  Hide Details
                                </span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-5 h-5" />
                                <span className="font-medium">
                                  View Details
                                </span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="p-6">
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

                        <td className="p-6">
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

                        <td className="p-6">
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

                        <td className="p-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <span className="font-mono font-medium text-gray-700">
                              {item.land_id || "-"}
                            </span>
                          </div>
                        </td>

                        <td className="p-6">
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
                      </tr>

                      {/* Expanded Details */}
                      {openRow === index && (
                        <tr>
                          <td
                            colSpan={isBuyerSelecting ? 7 : 6}
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
                                            <select
                                              name="state"
                                              onChange={handleInput}
                                              value={formData.state || ""}
                                              className="w-full p-3 rounded-lg border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            >
                                              <option value="">
                                                Select State
                                              </option>
                                              <option>Telangana</option>
                                              <option>Delhi</option>
                                            </select>
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

// Add these icons if not already imported
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
