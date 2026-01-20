import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PanelRight, 
  Filter, 
  Search, 
  X, 
  Grid, 
  List, 
  UserPlus,
  Eye,
  MapPin,
  Phone,
  Landmark,
  Building,
  Target,
  Calendar,
  ArrowRight,
  ChevronRight,
  Menu,
  X as XIcon,
  Globe,
  Grid as GridIcon,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Buyers = () => {
  const [view, setView] = useState("cards");
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState({
    states: false,
    districts: false,
    mandals: false
  });

  // Filters with IDs
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [mandalFilter, setMandalFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [tab, setTab] = useState("requirement");

  // Store location IDs
  const [locationIds, setLocationIds] = useState({
    stateId: "",
    districtId: ""
  });

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
    fetchBuyers();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (locationIds.stateId) {
      fetchDistricts(locationIds.stateId);
    } else {
      setDistricts([]);
      setMandals([]);
      setDistrictFilter("");
      setMandalFilter("");
    }
  }, [locationIds.stateId]);

  // Fetch mandals when district changes
  useEffect(() => {
    if (locationIds.districtId) {
      fetchMandals(locationIds.districtId);
    } else {
      setMandals([]);
      setMandalFilter("");
    }
  }, [locationIds.districtId]);

  const fetchStates = async () => {
    try {
      setLoadingLocation(prev => ({ ...prev, states: true }));
      const token = localStorage.getItem("token");
      const res = await fetch("http://72.61.169.226/admin/states", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStates(data);
      } else {
        console.error("Failed to fetch states");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingLocation(prev => ({ ...prev, states: false }));
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      setLoadingLocation(prev => ({ ...prev, districts: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://72.61.169.226/admin/states/${stateId}/districts`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      } else {
        console.error("Failed to fetch districts");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoadingLocation(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchMandals = async (districtId) => {
    try {
      setLoadingLocation(prev => ({ ...prev, mandals: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://72.61.169.226/admin/districts/${districtId}/mandals`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setMandals(data);
      } else {
        console.error("Failed to fetch mandals");
      }
    } catch (error) {
      console.error("Error fetching mandals:", error);
    } finally {
      setLoadingLocation(prev => ({ ...prev, mandals: false }));
    }
  };

  // Fetch Buyers
  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://72.61.169.226/admin/buyers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          state: stateFilter,
          district: districtFilter,
          town: townFilter,
          mandal: mandalFilter,
        },
      });
      setBuyers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching buyers", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://72.61.169.226/admin/wishlist`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const formatted = res.data.data.map((item) => ({
        ...item.buyer_details,
        wishlist_land: item.land_details,
      }));

      setBuyers(formatted);
    } catch (error) {
      console.error("Error fetching wishlist buyers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "requirement") {
      fetchBuyers();
    }
  }, [stateFilter, districtFilter, townFilter, mandalFilter, tab]);

  const clearFilters = () => {
    setStateFilter("");
    setDistrictFilter("");
    setTownFilter("");
    setMandalFilter("");
    setLocationIds({
      stateId: "",
      districtId: ""
    });
    setDistricts([]);
    setMandals([]);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === "wishlist") {
      fetchWishlist();
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setStateFilter(value);
    
    if (value) {
      const selectedState = states.find(s => s.name === value);
      setLocationIds(prev => ({
        ...prev,
        stateId: selectedState?.id || "",
        districtId: ""
      }));
    } else {
      setLocationIds({
        stateId: "",
        districtId: ""
      });
    }
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setDistrictFilter(value);
    
    if (value) {
      const selectedDistrict = districts.find(d => d.name === value);
      setLocationIds(prev => ({
        ...prev,
        districtId: selectedDistrict?.id || ""
      }));
    } else {
      setLocationIds(prev => ({
        ...prev,
        districtId: ""
      }));
    }
  };

  const handleMandalChange = (e) => {
    setMandalFilter(e.target.value);
  };

  const renderLocationDropdown = (type) => {
    let options = [];
    let icon;
    let placeholder = "";
    let value = "";
    let onChange = () => {};
    let isLoading = false;
    let isDisabled = false;
    let helpText = "";

    switch(type) {
      case "state":
        options = states;
        icon = Globe;
        placeholder = "Select state";
        value = stateFilter;
        onChange = handleStateChange;
        isLoading = loadingLocation.states;
        break;
      case "district":
        options = districts;
        icon = Landmark;
        placeholder = "Select district";
        value = districtFilter;
        onChange = handleDistrictChange;
        isLoading = loadingLocation.districts;
        isDisabled = !locationIds.stateId;
        helpText = "Please select state first";
        break;
      case "mandal":
        options = mandals;
        icon = GridIcon;
        placeholder = "Select mandal";
        value = mandalFilter;
        onChange = handleMandalChange;
        isLoading = loadingLocation.mandals;
        isDisabled = !locationIds.districtId;
        helpText = "Please select district first";
        break;
      default:
        return null;
    }

    const Icon = icon;

    return (
      <div className="space-y-1">
        <div className="relative">
          <select
            value={value}
            onChange={onChange}
            disabled={isDisabled || isLoading}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <Icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          {isLoading && (
            <div className="absolute right-10 top-3.5">
              <div className="h-4 w-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {isDisabled && type !== "state" && (
          <p className="text-xs text-gray-500 px-1">
            {helpText}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                Buyer Registry
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => navigate("/buyer/form")}
            className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
          >
            <UserPlus size={16} /> Add New Buyer
          </button>
        </div>
      </div>

      {/* HEADER */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Buyer Registry</h1>
            <p className="text-sm text-gray-500">Manage and track buyer engagements</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/buyer/form")}
          className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Buyer</span>
        </button>
      </header>

      <div className="p-4 sm:p-6">
        {/* MAIN CONTENT CARD */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          {/* HEADER SECTION */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 sm:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Buyer Management</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {tab === "requirement" 
                    ? "Browse buyers by their land requirements" 
                    : "View buyers with saved wishlists"}
                </p>
              </div>
              
              {/* VIEW TOGGLE */}
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg sm:rounded-xl">
                <button
                  onClick={() => setView("cards")}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                    view === "cards" 
                      ? "bg-white text-green-600 shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setView("table")}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                    view === "table" 
                      ? "bg-white text-green-600 shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Table</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex gap-1 sm:gap-2 mb-6">
              <button
                onClick={() => handleTabChange("requirement")}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base flex-1 sm:flex-none ${
                  tab === "requirement"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">By Requirement</span>
              </button>
              <button
                onClick={() => handleTabChange("wishlist")}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base flex-1 sm:flex-none ${
                  tab === "wishlist"
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Wishlist</span>
              </button>
            </div>

            {/* FILTERS SECTION - Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-700">Filters</h3>
                  </div>
              
                  <div className="space-y-3 mb-4">
                    {/* State Dropdown */}
                    {renderLocationDropdown("state")}

                    {/* District Dropdown */}
                    {renderLocationDropdown("district")}

                    {/* Mandal Dropdown */}
                    {renderLocationDropdown("mandal")}

                    {/* Town Input (unchanged) */}
                    <div className="relative">
                      <input
                        value={townFilter}
                        onChange={(e) => setTownFilter(e.target.value)}
                        placeholder="Enter town"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white text-sm"
                      />
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={fetchBuyers}
                      disabled={loading}
                      className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Search className="h-4 w-4" />
                      <span>{loading ? "Searching..." : "Search Buyers"}</span>
                    </button>
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all text-sm"
                    >
                      <X className="h-4 w-4" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FILTERS SECTION - Desktop */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Filters</h3>
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* State Dropdown */}
                {renderLocationDropdown("state")}

                {/* District Dropdown */}
                {renderLocationDropdown("district")}

                {/* Mandal Dropdown */}
                {renderLocationDropdown("mandal")}

                {/* Town Input */}
                <div className="relative">
                  <input
                    value={townFilter}
                    onChange={(e) => setTownFilter(e.target.value)}
                    placeholder="Enter town"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white text-sm"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={fetchBuyers}
                  disabled={loading}
                  className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="h-4 w-4" />
                  <span>{loading ? "Searching..." : "Search Buyers"}</span>
                </button>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
                <div className="flex items-center ml-auto text-sm text-gray-500">
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                    {buyers.length} buyer{buyers.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500">
                <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                  {buyers.length} buyer{buyers.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all text-sm"
              >
                <Filter className="h-4 w-4" />
                <span>{isMobileMenuOpen ? "Hide Filters" : "Show Filters"}</span>
              </button>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-500 mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Loading buyers data...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Eye className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1 sm:mb-2">No buyers found</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">Try adjusting your filters or add a new buyer</p>
                <button
                  onClick={() => navigate("/buyer/form")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  <UserPlus className="h-4 w-4" />
                  Add First Buyer
                </button>
              </div>
            ) : (
              <>
                {/* CARD VIEW */}
                {view === "cards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {buyers.map((b, i) => (
                      <div
                        key={i}
                        className="group border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white hover:shadow-xl transition-all duration-300 hover:border-emerald-100 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="pr-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors truncate">
                              {b.name}
                            </h3>
                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-gray-600 font-medium text-sm sm:text-base">{b.phone}</span>
                            </div>
                          </div>
                          <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full shrink-0">
                            <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                              {b.acres} acres
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                            <Landmark className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <span className="text-xs sm:text-sm truncate">
                              <strong className="text-gray-700">District:</strong> {b.district}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <span className="text-xs sm:text-sm truncate">
                              <strong className="text-gray-700">Town:</strong> {b.near_town_1}, {b.near_town_2}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <span className="text-xs sm:text-sm truncate">
                              <strong className="text-gray-700">Mandal:</strong> {b.mandal}
                            </span>
                          </div>
                          {b.price_per_acres && (
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-xs sm:text-sm">
                                <strong className="text-gray-700">Budget:</strong> ₹{b.total_budget?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            tab === "requirement"
                              ? navigate("/land-verification", {
                                  state: {
                                    district: b.district,
                                    state: b.state,
                                    price_per_acres: b.price_per_acres,
                                    total_land_price: b.total_budget,
                                    land_area: b.acres,
                                    buyer_id: b.unique_id,
                                  },
                                })
                              : navigate("/wishlist-view", {
                                  state: {
                                    buyerId: b.id,
                                    land: b.wishlist_land
                                  },
                                })
                          }
                          className={`group w-full flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                            tab === "requirement"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                              : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                          }`}
                        >
                          <span className="truncate">
                            {tab === "requirement" ? "Find Matching Land" : "View Wishlist"}
                          </span>
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* TABLE VIEW */}
                {view === "table" && (
                  <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Buyer Details</th>
                          <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Land Requirements</th>
                          <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Location</th>
                          <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Budget</th>
                          <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {buyers.map((b, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 sm:p-4">
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{b.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs sm:text-sm text-gray-600">{b.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 sm:p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">{b.acres} acres</span>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded truncate block max-w-[120px] sm:max-w-none">
                                  {b.mandal}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 sm:p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Landmark className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{b.district}</span>
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">
                                  Near: {b.near_town_1}, {b.near_town_2}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 sm:p-4">
                              {b.total_budget ? (
                                <div>
                                  <div className="font-medium text-emerald-700 text-sm sm:text-base">
                                    ₹{b.total_budget.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ₹{b.price_per_acres?.toLocaleString()}/acre
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Not specified</span>
                              )}
                            </td>
                            <td className="p-3 sm:p-4">
                              <button
                                onClick={() =>
                                  tab === "requirement"
                                    ? navigate("/land-verification", {
                                        state: {
                                          district: b.district,
                                          state: b.state,
                                          price_per_acres: b.price_per_acres,
                                          total_land_price: b.total_budget,
                                          land_area: b.acres,
                                          buyer_id: b.unique_id,
                                        },
                                      })
                                    : navigate("/wishlist-view", {
                                        state: {
                                          buyerId: b.id,
                                          land: b.wishlist_land
                                        },
                                      })
                                }
                                className={`group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                                  tab === "requirement"
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                }`}
                              >
                                {tab === "requirement" ? (
                                  <>
                                    <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Find Land</span>
                                    <span className="sm:hidden">Find</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>View</span>
                                  </>
                                )}
                                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};