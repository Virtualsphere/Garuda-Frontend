import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PanelRight, Menu, Navigation } from "lucide-react";

export const DataEntry = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSpecialPackage, setIsSpecialPackage] = useState(false);

  const initialFormState = {
    state: "",
    district: "",
    status: "true",
    mandal: "",
    village: "",
    name: "",
    phone: "",
    whatsapp_number: "",
    literacy: "",
    age_group: "",
    nature: "",
    land_ownership: "",
    mortgage: "",
    land_area: "",
    guntas: "",
    price_per_acre: "",
    total_land_price: "",
    land_type: "",
    water_source: [], // Changed to array
    garden: [], // Changed to array
    shed_details: [], // Changed to array
    farm_pond: "",
    residental: "",
    fencing: "",
    road_path: "",
    latitude: "",
    longitude: "",
    path_to_land: "",
    dispute_type: "",
    siblings_involve_in_dispute: "",
    
    // Office work fields
    suggested_farmer_name: "",
    suggested_farmer_phone: "",
    suggested_village: "",
    suggested_mandal: "",
    keep_in_special_package: "false",
    package_name: "",
    package_remarks: "",
    mediator_id: "",
    certification_willingness: "",
    certification_location: "",
    board_start_date: "",
    board_end_date: "",
    border_latitude: "",
    border_longitude: "",
  };

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorStatus, setVisitorStatus] = useState("Interested");
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState(initialFormState);

  const [locationIds, setLocationIds] = useState({
    stateId: "",
    districtId: "",
    mandalId: "",
    villageId: "",
  });

  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    mandals: false,
    villages: false,
  });

  // FILE STATES
  const [passbookPhoto, setPassbookPhoto] = useState(null);
  const [landBorder, setLandBorder] = useState(null);
  const [landPhotos, setLandPhotos] = useState([]);
  const [landVideos, setLandVideos] = useState([]);
  const [borderPhotos, setBorderPhotos] = useState([]); // New for border photos

  // Mediators list
  const [mediators, setMediators] = useState([]);
  const [loadingMediators, setLoadingMediators] = useState(false);

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
      setMandals([]);
      setVillages([]);
    }
  }, [locationIds.stateId]);

  // Fetch mandals when district changes
  useEffect(() => {
    if (locationIds.districtId) {
      fetchMandals(locationIds.districtId);
      fetchMediators(locationIds.districtId); // Fetch mediators based on district
    } else {
      setMandals([]);
      setVillages([]);
      setMediators([]);
    }
  }, [locationIds.districtId]);

  // Fetch villages when mandal changes
  useEffect(() => {
    if (locationIds.mandalId) {
      fetchVillages(locationIds.mandalId);
    } else {
      setVillages([]);
    }
  }, [locationIds.mandalId]);

  const fetchStates = async () => {
    try {
      setLoading((prev) => ({ ...prev, states: true }));
      const token = localStorage.getItem("token");
      const res = await fetch("http://72.61.169.226/admin/states", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      setLoading((prev) => ({ ...prev, states: false }));
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      setLoading((prev) => ({ ...prev, districts: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/states/${stateId}/districts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      } else {
        console.error("Failed to fetch districts");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const fetchMandals = async (districtId) => {
    try {
      setLoading((prev) => ({ ...prev, mandals: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/districts/${districtId}/mandals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMandals(data);
      } else {
        console.error("Failed to fetch mandals");
      }
    } catch (error) {
      console.error("Error fetching mandals:", error);
    } finally {
      setLoading((prev) => ({ ...prev, mandals: false }));
    }
  };

  const fetchVillages = async (mandalId) => {
    try {
      setLoading((prev) => ({ ...prev, villages: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/mandals/${mandalId}/villages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setVillages(data);
      } else {
        console.error("Failed to fetch villages");
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading((prev) => ({ ...prev, villages: false }));
    }
  };

  const fetchMediators = async (districtId) => {
  try {
    setLoadingMediators(true);
    const token = localStorage.getItem("token");
    
    // Fetch all users with their details
    const res = await fetch("http://72.61.169.226/admin/personal/details", {
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

      // Filter users by role (agent or field executive) and work district
      const filteredMediators = data.users
        .filter(user => {
          // Check if user has the right role
          const userRole = user.role?.toLowerCase();
          const isMediatorRole = userRole === 'mediator';
          
          // Get work location from work_location data
          const workLocation = data.work_location?.find((x) => x.unique_id === user.unique_id);
          const worksInDistrict = workLocation?.work_district === form.district;
          
          return isMediatorRole && worksInDistrict;
        })
        .map(user => ({
          id: user.unique_id, // This is the unique_id that backend expects
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          work_location: data.work_location?.find((x) => x.unique_id === user.unique_id) || {},
        }));

      setMediators(filteredMediators);
      
      // Log for debugging
      console.log(`Found ${filteredMediators.length} mediators in district: ${form.district}`);
      filteredMediators.forEach(mediator => {
        console.log(`Mediator: ${mediator.name} (${mediator.role}) - ID: ${mediator.id}`);
      });
      
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

  const handleInput = (e) => {
    const { name, value } = e.target;

    // If state changes
    if (name === "state") {
      const selectedState = states.find((s) => s.name === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        district: "",
        mandal: "",
        village: "",
      }));
      setLocationIds((prev) => ({
        ...prev,
        stateId: selectedState?.id || "",
        districtId: "",
        mandalId: "",
        villageId: "",
      }));
    }
    // If district changes
    else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        mandal: "",
        village: "",
      }));
      setLocationIds((prev) => ({
        ...prev,
        districtId: selectedDistrict?.id || "",
        mandalId: "",
        villageId: "",
      }));
    }
    // If mandal changes
    else if (name === "mandal") {
      const selectedMandal = mandals.find((m) => m.name === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        village: "",
      }));
      setLocationIds((prev) => ({
        ...prev,
        mandalId: selectedMandal?.id || "",
        villageId: "",
      }));
    }
    // If village changes
    else if (name === "village") {
      const selectedVillage = villages.find((v) => v.name === value);
      setForm((prev) => ({ ...prev, [name]: value }));
      setLocationIds((prev) => ({
        ...prev,
        villageId: selectedVillage?.id || "",
      }));
    }
    // Handle guntas field
    else if (name === "guntas") {
      let num = Number(value);
      if (num > 40) num = 40;
      if (num < 0) num = 0;
      setForm((prev) => ({ ...prev, [name]: num }));
    }
    // Handle checkbox for special package
    else if (name === "keep_in_special_package") {
      const boolValue = value === "true" ? "true" : "false";
      setForm((prev) => ({ ...prev, [name]: boolValue }));
    }
    // Handle other fields
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectButton = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: Handle multi-select toggle for array fields
  const handleMultiSelectToggle = (field, option) => {
    setForm((prev) => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(option)
        ? currentArray.filter((item) => item !== option)
        : [...currentArray, option];

      return { ...prev, [field]: newArray };
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
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

  // Function to get current location for border coordinates
  const getCurrentBorderLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            border_latitude: position.coords.latitude.toString(),
            border_longitude: position.coords.longitude.toString(),
          }));
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

  // MULTI PHOTO SELECT
  const addPhotos = (e) => {
    const files = Array.from(e.target.files);
    setLandPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setLandPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // MULTI VIDEO SELECT
  const addVideos = (e) => {
    const files = Array.from(e.target.files);
    setLandVideos((prev) => [...prev, ...files]);
  };

  const removeVideo = (index) => {
    setLandVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // BORDER PHOTOS
  const addBorderPhotos = (e) => {
    const files = Array.from(e.target.files);
    setBorderPhotos((prev) => [...prev, ...files]);
  };

  const removeBorderPhoto = (index) => {
    setBorderPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      // Append all form values
      Object.entries(form).forEach(([key, value]) => {
        // Handle array fields - join with comma and space
        if (Array.isArray(value)) {
          if (value.length > 0) {
            fd.append(key, value.join(", "));
          } else {
            fd.append(key, ""); // Send empty string if no selection
          }
        } else {
          fd.append(key, value);
        }
      });

      // Append visitors data as JSON
      if (visitors.length > 0) {
        fd.append("visitors", JSON.stringify(visitors));
      }

      // Append files
      if (passbookPhoto) fd.append("passbook_photo", passbookPhoto);
      if (landBorder) fd.append("land_border", landBorder);
      landPhotos.forEach((file) => fd.append("land_photo", file));
      landVideos.forEach((file) => fd.append("land_video", file));
      borderPhotos.forEach((file) => fd.append("border_photo", file));

      const res = await fetch("http://72.61.169.226/admin/land", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Land Entry Saved Successfully: " + data.land_id);
        // Reset all form states
        setForm(initialFormState);
        setLocationIds({
          stateId: "",
          districtId: "",
          mandalId: "",
          villageId: "",
        });
        setPassbookPhoto(null);
        setLandBorder(null);
        setLandPhotos([]);
        setLandVideos([]);
        setBorderPhotos([]);
        setVisitors([]);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit land entry");
    }
  };

  // Helper function to render multi-select field
  const renderMultiSelectField = (label, field, options) => (
    <div key={field} className="mt-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2 mt-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleMultiSelectToggle(field, option)}
            className={`px-3 py-1 text-xs lg:px-4 lg:py-1 lg:text-sm rounded-full transition-colors ${
              form[field]?.includes(option)
                ? "bg-green-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-1">
        <span className="text-xs text-gray-500">
          Selected: {form[field]?.length > 0 ? form[field].join(", ") : "None"}
        </span>
      </div>
    </div>
  );

  // Helper function to render single-select field
  const renderSingleSelectField = (label, field, options) => (
    <div key={field} className="mt-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2 mt-2 flex-wrap">
        {options.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleSelectButton(field, v)}
            className={`px-3 py-1 text-xs lg:px-4 lg:py-1 lg:text-sm rounded-full transition-colors ${
              form[field] === v
                ? "bg-green-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* MOBILE HEADER */}
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
              <h1 className="text-lg font-semibold">Data Entry</h1>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Data Entry</h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="p-4 space-y-6 pt-16 lg:pt-6">
        <div className="p-4 space-y-6 pt-16 lg:pt-6">
        {/* ------------------ VILLAGE ADDRESS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Village Address</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">State</label>
              <select
                name="state"
                value={form.state}
                onChange={handleInput}
                disabled={loading.states}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {loading.states && <p className="text-xs text-gray-500 mt-1">Loading states...</p>}
            </div>

            <div>
              <label className="text-sm font-medium">District</label>
              <select
                name="district"
                value={form.district}
                onChange={handleInput}
                disabled={!locationIds.stateId || loading.districts}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
              {loading.districts && <p className="text-xs text-gray-500 mt-1">Loading districts...</p>}
              {!form.state && <p className="text-xs text-gray-500 mt-1">Please select a state first</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Mandal</label>
              <select
                name="mandal"
                value={form.mandal}
                onChange={handleInput}
                disabled={!locationIds.districtId || loading.mandals}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select Mandal</option>
                {mandals.map(mandal => (
                  <option key={mandal.id} value={mandal.name}>
                    {mandal.name}
                  </option>
                ))}
              </select>
              {loading.mandals && <p className="text-xs text-gray-500 mt-1">Loading mandals...</p>}
              {!form.district && <p className="text-xs text-gray-500 mt-1">Please select a district first</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Village</label>
              <select
                name="village"
                value={form.village}
                onChange={handleInput}
                disabled={!locationIds.mandalId || loading.villages}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select Village</option>
                {villages.map(village => (
                  <option key={village.id} value={village.name}>
                    {village.name}
                  </option>
                ))}
              </select>
              {loading.villages && <p className="text-xs text-gray-500 mt-1">Loading villages...</p>}
              {!form.mandal && <p className="text-xs text-gray-500 mt-1">Please select a mandal first</p>}
            </div>
          </div>
        </div>

        {/* ------------------ FARMER DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Farmer Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone No</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleInput}
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Other WhatsApp</label>
            <input
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleInput}
              type="text"
              className="w-full mt-1 p-2 rounded-xl bg-gray-50"
            />
          </div>

          {/* Select buttons */}
          {[
            ["Literacy", "literacy", ["Literate", "Illiterate", "Graduate"]],
            ["Age Group", "age_group", ["Young", "30-50", "50 Above"]],
            ["Nature", "nature", ["Polite", "Medium", "Rude"]],
            ["Land Ownership", "land_ownership", ["Joint", "Single"]],
            ["Ready for Mortgage", "mortgage", ["Yes", "No"]],
          ].map(([label, field, options]) => (
            renderSingleSelectField(label, field, options)
          ))}
        </div>

        {/* ------------------ DISTPUTE DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Dispute Details</h2>

          {renderSingleSelectField("Dispute Type", "dispute_type", ["Boundary", "Ownership", "Family", "Other", "Budhan", "Land Sealing", "Electric Poles", "Canal Planning"])}
          
          {renderSingleSelectField("Siblings Involved in Dispute", "siblings_involve_in_dispute", ["Yes", "No"])}
          
        </div>

        {/* ------------------ LAND DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Land Details</h2>

          <div>
            <label className="text-sm font-medium">Land Area</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm font-medium">Acres</label>
                <input
                  type="number"
                  name="land_area"
                  value={form.land_area}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Guntas (0-40)</label>
                <input
                  type="number"
                  name="guntas"
                  value={form.guntas}
                  onChange={handleInput}
                  max={40}
                  min={0}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">
                Price Per Acre in Lakhs
              </label>
              <input
                type="number"
                name="price_per_acre"
                value={form.price_per_acre}
                onChange={handleInput}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Passbook Photo</label>
              <input
                type="file"
                onChange={(e) => setPassbookPhoto(e.target.files[0])}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Total Price</label>
                <input
                  type="number"
                  name="total_land_price"
                  value={form.total_land_price}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Select fields - Updated for multi-select */}
          {renderSingleSelectField("Land Type", "land_type", ["Red", "Black", "Sand"])}
          
          {/* Multi-select fields */}
          {renderMultiSelectField("Water Source", "water_source", ["Canal", "Bores", "Cheruvu", "Rain Water Only"])}
          
          {renderSingleSelectField("Farm Pond", "farm_pond", ["Yes", "No"])}
          
          {renderMultiSelectField("Garden", "garden", ["Mango", "Coconut", "Guava", "Sapota"])}
          
          {renderSingleSelectField("Residential", "residental", ["Farm House", "RCC Home", "Asbestos Shelter", "Hut"])}
          
          {renderMultiSelectField("Shed Details", "shed_details", ["Poultry", "Cow Shed"])}
          
          {renderSingleSelectField("Fencing", "fencing", ["With Gate", "All Sides", "Partially", "No"])}
        </div>

        {/* ------------------ GPS DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">GPS & Path Tracking</h2>

          <label className="text-sm font-medium">Land Entry Point</label>
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
  <h2 className="font-semibold text-lg">GPS & Path Tracking</h2>

  <div className="space-y-2">
    <label className="text-sm font-medium">Land Entry Point Coordinates</label>
    
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-gray-500 mb-1">Latitude</div>
          <input
            name="latitude"
            value={form.latitude}
            onChange={handleInput}
            placeholder="e.g. 17.123456"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Longitude</div>
          <input
            name="longitude"
            value={form.longitude}
            onChange={handleInput}
            placeholder="e.g. 78.123456"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
          />
        </div>
      </div>
      
      <div className="flex sm:items-end">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
          title="Use your current location"
        >
          <Navigation size={18} />
          <span className="font-medium">GPS</span>
        </button>
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${form.latitude && form.longitude ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
        <span>{form.latitude && form.longitude ? 'Location captured' : 'Click GPS to auto-fill'}</span>
      </div>
      {form.latitude && form.longitude && (
        <span className="text-green-600 font-medium">
          ✓ Ready
        </span>
      )}
    </div>
  </div>
</div>
        </div>

        {/* ------------------ PHOTOS & VIDEOS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Documents & Media</h2>

          {/* PHOTOS */}
          <div>
            <label className="text-sm font-medium">Land Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={addPhotos}
              className="w-full mt-1 p-2 rounded-xl bg-gray-50"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              {landPhotos.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Land photo ${index + 1}`}
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEOS */}
          <div>
            <label className="text-sm font-medium">Land Videos</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={addVideos}
              className="w-full mt-1 p-2 rounded-xl bg-gray-50"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              {landVideos.map((file, index) => (
                <div key={index} className="relative">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded object-cover"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        {/* ------------------ OFFICE WORK SECTION ------------------ */}
        <div className="p-4 space-y-6">
          <div className="flex h-14 items-center justify-between bg-red-50 px-4 shadow-sm sticky top-0 z-50 mb-4 rounded-md">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Office Work</h1>
            </div>
          </div>

          <div className="flex h-14 items-center justify-between bg-red-50 px-4 shadow-sm sticky top-0 z-50 mb-4 rounded-md">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                Other Lands Information Verification
              </h1>
            </div>
          </div>

          {/* New Land Suggestion */}
          <div className="bg-red-50 rounded-2xl shadow p-4 space-y-3">
            <h2 className="font-semibold text-lg">New Land Suggestion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Suggested Farmer Name
                </label>
                <input
                  type="text"
                  name="suggested_farmer_name"
                  value={form.suggested_farmer_name}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Suggested Farmer Phone
                </label>
                <input
                  type="text"
                  name="suggested_farmer_phone"
                  value={form.suggested_farmer_phone}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Suggested Village
                </label>
                <input
                  type="text"
                  name="suggested_village"
                  value={form.suggested_village}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Suggested Mandal
                </label>
                <input
                  type="text"
                  name="suggested_mandal"
                  value={form.suggested_mandal}
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Special Package & Mediator Assignment */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={form.keep_in_special_package === "true"}
                onChange={(e) => 
                  setForm(prev => ({
                    ...prev, 
                    keep_in_special_package: e.target.checked ? "true" : "false"
                  }))
                }
              />
              <span className="text-gray-700">Keep in Special Package</span>
            </label>
            <p className="text-sm text-gray-500">
              Check this if the land is a high‑priority or has unique features.
            </p>

            {form.keep_in_special_package === "true" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-700 text-sm">Package Name</label>
                  <input
                    type="text"
                    name="package_name"
                    value={form.package_name}
                    onChange={handleInput}
                    placeholder="e.g. Hot Deal"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700 text-sm">Package Remarks</label>
                  <input
                    type="text"
                    name="package_remarks"
                    value={form.package_remarks}
                    onChange={handleInput}
                    placeholder="e.g. Limited time, urgent"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
  <label className="text-gray-700 text-sm">Assign Mediator</label>
  <select
    name="mediator_id"
    value={form.mediator_id}
    onChange={handleInput}
    disabled={!locationIds.districtId || loadingMediators}
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
    {locationIds.districtId 
      ? loadingMediators 
        ? "Loading mediators..." 
        : mediators.length === 0
          ? `No mediators (agent/field executive) found in ${form.district} district`
          : `Found ${mediators.length} mediator(s) in ${form.district} district`
      : "Please select a district first to see mediators."}
  </p>
</div>
          </div>

          {/* Land Certification Process */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-red-700">
              Land Certification Process
            </h2>

            {/* Certification Willingness */}
            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm">
                    Certification Willingness
                  </label>
                  <select
                    name="certification_willingness"
                    value={form.certification_willingness}
                    onChange={handleInput}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="">Select...</option>
                    <option value="Thinking">Thinking</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Already Certified">Already Certified</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm">
                    Certification Location
                  </label>
                  <input
                    type="text"
                    name="certification_location"
                    value={form.certification_location}
                    onChange={handleInput}
                    placeholder="e.g. Village Office, Tahsildar Office"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>
            </div>

            {/* Board Duration */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Board Start Date</label>
                <input
                  type="date"
                  name="board_start_date"
                  value={form.board_start_date}
                  onChange={handleInput}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Board End Date</label>
                <input
                  type="date"
                  name="board_end_date"
                  value={form.board_end_date}
                  onChange={handleInput}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Border Coordinates */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Border Latitude</label>
                <input
                  type="text"
                  name="border_latitude"
                  value={form.border_latitude}
                  onChange={handleInput}
                  placeholder="e.g. 17.123456"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Border Longitude</label>
                <input
                  type="text"
                  name="border_longitude"
                  value={form.border_longitude}
                  onChange={handleInput}
                  placeholder="e.g. 78.123456"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Track Location Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={getCurrentBorderLocation}
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>📍</span> Track Current Border Location
              </button>
            </div>

            {/* Border Photos */}
            <div className="space-y-3">
              <label className="text-gray-700 text-sm">Border Photos</label>
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('border-photo-upload').click()}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                >
                  <span>⤴️</span> Upload Border Photo
                </button>
                <input
                  type="file"
                  id="border-photo-upload"
                  multiple
                  accept="image/*"
                  onChange={addBorderPhotos}
                  className="hidden"
                />
              </div>

              {/* Display border photos */}
              {borderPhotos.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-3">
                    {borderPhotos.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Border photo ${index + 1}`}
                          className="w-20 h-20 lg:w-24 lg:h-24 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeBorderPhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visitor Details */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm space-y-4 mt-6">
            <h2 className="text-lg font-semibold text-red-700">
              Visitor Details
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Visitor Name</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Visitor Phone</label>
                <input
                  type="text"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-gray-700 text-sm">Visitor Status</label>
                <select
                  value={visitorStatus}
                  onChange={(e) => setVisitorStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Follow up">Follow up</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
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

                setVisitors([...visitors, newVisitor]);
                setVisitorName("");
                setVisitorPhone("");
                setVisitorStatus("Interested");
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition-colors"
            >
              + Add Visitor
            </button>

            {visitors.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-700 pt-4">
                  Previous Visitors ({visitors.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t mt-2">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Phone</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((v, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2">{v.date}</td>
                          <td className="py-2">{v.name}</td>
                          <td className="py-2">{v.phone}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              v.status === "Interested" 
                                ? "bg-green-100 text-green-700"
                                : v.status === "Not Interested"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-6 pb-10 px-4 sticky bottom-0 bg-gray-100 pt-4 lg:relative lg:bg-transparent lg:pt-0">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-all w-full lg:w-auto"
        >
          Save Land Entry
        </button>
      </div>
    </div>
  );
};