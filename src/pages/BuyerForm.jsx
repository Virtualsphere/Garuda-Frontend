import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { 
  User, 
  Phone, 
  MapPin, 
  Landmark, 
  Building2, 
  Map, 
  Target, 
  Trees, 
  DollarSign, 
  FileText,
  ArrowLeft,
  Save,
  X,
  Check,
  Globe,
  Navigation,
  Tag,
  ChevronDown,
  Grid
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const BuyerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState({
    states: false,
    districts: false,
    sectors: false
  });

  // Store location IDs separately
  const [locationIds, setLocationIds] = useState({
    stateId: "",
    districtId: "",
    sectorId: ""
  });

  const initialForm = {
    name: "",
    phone: "",
    state: "",
    district: "",
    sector: "",
    near_town_1: "",
    near_town_2: "",
    acres: "",
    total_budget: "",
    price_per_acres: "",
    type_of_soil: "",
    remarks: "",
  };

  const [form, setForm] = useState(initialForm);

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (locationIds.stateId) {
      fetchDistricts(locationIds.stateId);
    } else {
      setDistricts([]);
      setSectors([]);
      setForm(prev => ({ 
        ...prev, 
        district: "",
        sector: ""
      }));
    }
  }, [locationIds.stateId]);

  // Fetch sectors when district changes
  useEffect(() => {
    if (locationIds.districtId) {
      fetchSectors(locationIds.districtId);
    } else {
      setSectors([]);
      setForm(prev => ({ ...prev, sector: "" }));
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
        toast.error("Failed to load states");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Error loading states");
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
        toast.error("Failed to load districts");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Error loading districts");
    } finally {
      setLoadingLocation(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchSectors = async (districtId) => {
    try {
      setLoadingLocation(prev => ({ ...prev, sectors: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://72.61.169.226/admin/districts/${districtId}/sectors`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSectors(data);
      } else {
        console.error("Failed to fetch sectors");
        toast.error("Failed to load sectors");
      }
    } catch (error) {
      console.error("Error fetching sectors:", error);
      toast.error("Error loading sectors");
    } finally {
      setLoadingLocation(prev => ({ ...prev, sectors: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle location dropdown changes
    if (name === "state") {
      const selectedState = states.find(s => s.name === value);
      setForm(prev => ({ 
        ...prev, 
        [name]: value,
        district: "",
        sector: ""
      }));
      setLocationIds(prev => ({
        ...prev,
        stateId: selectedState?.id || "",
        districtId: "",
        sectorId: ""
      }));
    } 
    else if (name === "district") {
      const selectedDistrict = districts.find(d => d.name === value);
      setForm(prev => ({ 
        ...prev, 
        [name]: value,
        sector: ""
      }));
      setLocationIds(prev => ({
        ...prev,
        districtId: selectedDistrict?.id || "",
        sectorId: ""
      }));
    }
    else if (name === "sector") {
      const selectedSector = sectors.find(s => s.name === value);
      setForm(prev => ({ ...prev, [name]: value }));
      setLocationIds(prev => ({
        ...prev,
        sectorId: selectedSector?.id || ""
      }));
    }
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.name || !form.phone) {
      toast.error("Name and Phone are required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://72.61.169.226/admin/buyers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Buyer saved successfully!", {
          icon: "🎉",
          duration: 4000,
        });
        setForm(initialForm);
        setLocationIds({
          stateId: "",
          districtId: "",
          sectorId: ""
        });
        setTimeout(() => {
          navigate("/buyers");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to save buyer");
      }
    } catch (err) {
      console.error("Error saving buyer", err);
      toast.error(err.message || "Failed to save buyer");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setLocationIds({
      stateId: "",
      districtId: "",
      sectorId: ""
    });
    toast("Form cleared", {
      icon: "🔄",
    });
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "location", label: "Location", icon: MapPin },
    { id: "requirements", label: "Requirements", icon: Target },
    { id: "budget", label: "Budget", icon: FaRupeeSign },
    { id: "additional", label: "Additional", icon: FileText },
  ];

  const fieldConfigs = {
    name: { icon: User, label: "Full Name", required: true, placeholder: "Enter buyer's full name" },
    phone: { icon: Phone, label: "Phone Number", required: true, placeholder: "Enter 10-digit mobile number", type: "tel" },
    state: { icon: Globe, label: "State", placeholder: "Select state", type: "select" },
    district: { icon: Landmark, label: "District", placeholder: "Select district", type: "select" },
    sector: { icon: Grid, label: "Sector", placeholder: "Select sector", type: "select" },
    near_town_1: { icon: Navigation, label: "Nearest Town 1", placeholder: "Primary nearby town" },
    near_town_2: { icon: Navigation, label: "Nearest Town 2", placeholder: "Secondary nearby town" },
    acres: { icon: Trees, label: "Required Acres", placeholder: "Enter land area in acres", type: "number" },
    total_budget: { icon: FaRupeeSign, label: "Total Budget (₹)", placeholder: "Enter total budget amount", type: "number" },
    price_per_acres: { icon: Tag, label: "Price per Acre (₹)", placeholder: "Expected price per acre", type: "number" },
    type_of_soil: { icon: Building2, label: "Type of Soil", placeholder: "e.g., Black Soil, Red Soil" },
    remarks: { icon: FileText, label: "Remarks", placeholder: "Any additional notes or requirements" },
  };

  const getSectionFields = (sectionId) => {
    const sectionMap = {
      basic: ["name", "phone"],
      location: ["state", "district", "sector", "near_town_1", "near_town_2"],
      requirements: ["acres", "type_of_soil"],
      budget: ["total_budget", "price_per_acres"],
      additional: ["remarks"],
    };
    return sectionMap[sectionId] || [];
  };

  const renderField = (fieldKey) => {
    const config = fieldConfigs[fieldKey];
    const Icon = config.icon;
    
    // Render dropdown for location fields
    if (["state", "district", "sector"].includes(fieldKey)) {
      let options = [];
      let isLoading = false;
      let isDisabled = false;
      let helpText = "";
      
      switch(fieldKey) {
        case "state":
          options = states;
          isLoading = loadingLocation.states;
          break;
        case "district":
          options = districts;
          isLoading = loadingLocation.districts;
          isDisabled = !locationIds.stateId;
          helpText = "Please select state first";
          break;
        case "sector":
          options = sectors;
          isLoading = loadingLocation.sectors;
          isDisabled = !locationIds.districtId;
          helpText = "Please select district first";
          break;
      }
      
      return (
        <div key={fieldKey} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Icon className="h-4 w-4" />
            {config.label}
            {config.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              name={fieldKey}
              value={form[fieldKey]}
              onChange={handleChange}
              disabled={isDisabled || isLoading}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{config.placeholder}</option>
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
          {isDisabled && fieldKey !== "state" && (
            <p className="text-xs text-gray-500">
              {helpText}
            </p>
          )}
        </div>
      );
    }
    
    if (fieldKey === "remarks") {
      return (
        <div key={fieldKey} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Icon className="h-4 w-4" />
            {config.label}
            {config.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name={fieldKey}
            value={form[fieldKey]}
            onChange={handleChange}
            placeholder={config.placeholder}
            rows="4"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
      );
    }

    return (
      <div key={fieldKey} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Icon className="h-4 w-4" />
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={config.type || "text"}
            name={fieldKey}
            value={form[fieldKey]}
            onChange={handleChange}
            placeholder={config.placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
          <Icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 md:p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/buyers")}
            className="group flex items-center gap-2 text-gray-600 hover:text-emerald-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Buyers</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Add New Buyer</h1>
              <p className="text-gray-600 mt-2">Fill in the buyer details to add them to the registry</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  {Object.values(form).filter(v => v).length} / {Object.keys(form).length} fields filled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Progress/Section Navigation */}
          <div className="border-b border-gray-100">
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const fields = getSectionFields(section.id);
                  const filledCount = fields.filter(field => form[field]).length;
                  const totalCount = fields.length;
                  const isActive = activeSection === section.id;
                  const isComplete = filledCount === totalCount && totalCount > 0;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`group flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white/20' 
                          : isComplete 
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-200'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{section.label}</div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {filledCount} of {totalCount} fields
                        </div>
                      </div>
                      {isComplete && !isActive && (
                        <Check className="h-4 w-4 text-emerald-600 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Current Section Fields */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)?.icon || FileText;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {sections.find(s => s.id === activeSection)?.label} Details
                </h3>
                
                <div className={`grid grid-cols-1 ${
                  activeSection === "additional" ? "lg:grid-cols-1" : "lg:grid-cols-2"
                } gap-6`}>
                  {getSectionFields(activeSection).map(renderField)}
                </div>
              </div>

              {/* Navigation between sections */}
              <div className="flex justify-between mb-8">
                <div className="flex gap-3">
                  {sections.map((section, index) => (
                    sections[index - 1]?.id === activeSection && (
                      <button
                        key="prev"
                        type="button"
                        onClick={() => setActiveSection(sections[index - 1].id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-700 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous: {sections[index - 1].label}
                      </button>
                    )
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {sections.map((section, index) => (
                    sections[index + 1]?.id === activeSection && (
                      <button
                        key="next"
                        type="button"
                        onClick={() => setActiveSection(sections[index + 1].id)}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Next: {sections[index + 1].label}
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Quick Preview */}
              <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Quick Preview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(form)
                    .filter(([key, value]) => value && key !== "remarks")
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 uppercase font-medium">
                          {fieldConfigs[key]?.label || key.replace(/_/g, ' ')}
                        </div>
                        <div className="font-medium text-gray-800 truncate">{value}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="group flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear Form
                </button>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/buyers")}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Buyer</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800">Required Fields</h4>
            </div>
            <p className="text-sm text-gray-600">Name and Phone number are mandatory for all buyers</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-medium text-gray-800">Better Matching</h4>
            </div>
            <p className="text-sm text-gray-600">More details lead to better land recommendations</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Save className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800">Auto-redirect</h4>
            </div>
            <p className="text-sm text-gray-600">You'll be redirected to buyers list after successful save</p>
          </div>
        </div>
      </div>
    </div>
  );
};