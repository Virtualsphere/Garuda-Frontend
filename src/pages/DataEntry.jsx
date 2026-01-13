import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PanelRight, Menu } from "lucide-react";

export const DataEntry = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    } else {
      setMandals([]);
      setVillages([]);
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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      // Append all form values (names, not IDs)
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

      // Append files
      if (passbookPhoto) fd.append("passbook_photo", passbookPhoto);
      if (landBorder) fd.append("land_border", landBorder);
      landPhotos.forEach((file) => fd.append("land_photo", file));
      landVideos.forEach((file) => fd.append("land_video", file));

      const res = await fetch("http://72.61.169.226/field-executive/land", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Land Entry Saved Successfully: " + data.land_id);
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
      } else {
        alert("Error: " + data.error);
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
                {states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {loading.states && (
                <p className="text-xs text-gray-500 mt-1">Loading states...</p>
              )}
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
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
              {loading.districts && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading districts...
                </p>
              )}
              {!form.state && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a state first
                </p>
              )}
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
                {mandals.map((mandal) => (
                  <option key={mandal.id} value={mandal.name}>
                    {mandal.name}
                  </option>
                ))}
              </select>
              {loading.mandals && (
                <p className="text-xs text-gray-500 mt-1">Loading mandals...</p>
              )}
              {!form.district && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a district first
                </p>
              )}
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
                {villages.map((village) => (
                  <option key={village.id} value={village.name}>
                    {village.name}
                  </option>
                ))}
              </select>
              {loading.villages && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading villages...
                </p>
              )}
              {!form.mandal && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a mandal first
                </p>
              )}
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
          ].map(([label, field, options]) =>
            renderSingleSelectField(label, field, options)
          )}
        </div>

        {/* ------------------ DISTPUTE DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Dispute Details</h2>

          {renderSingleSelectField("Dispute Type", "dispute_type", [
            "Boundary",
            "Ownership",
            "Family",
            "Other",
            "Budhan",
            "Land Sealing",
            "Electric Poles",
            "Canal Planning",
          ])}

          {renderSingleSelectField(
            "Siblings Involved in Dispute",
            "siblings_involve_in_dispute",
            ["Yes", "No"]
          )}
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
          {renderSingleSelectField("Land Type", "land_type", [
            "Red",
            "Black",
            "Sand",
          ])}

          {/* Multi-select fields */}
          {renderMultiSelectField("Water Source", "water_source", [
            "Canal",
            "Bores",
            "Cheruvu",
            "Rain Water Only",
          ])}

          {renderSingleSelectField("Farm Pond", "farm_pond", ["Yes", "No"])}

          {renderMultiSelectField("Garden", "garden", [
            "Mango",
            "Coconut",
            "Guava",
            "Sapota",
          ])}

          {renderSingleSelectField("Residential", "residental", [
            "Farm House",
            "RCC Home",
            "Asbestos Shelter",
            "Hut",
          ])}

          {renderMultiSelectField("Shed Details", "shed_details", [
            "Poultry",
            "Cow Shed",
          ])}

          {renderSingleSelectField("Fencing", "fencing", [
            "With Gate",
            "All Sides",
            "Partially",
            "No",
          ])}
        </div>

        {/* ------------------ GPS DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">GPS & Path Tracking</h2>

          <label className="text-sm font-medium">Land Entry Point</label>
          <div className="flex gap-2 mt-2 flex-col lg:flex-row">
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleInput}
              placeholder="Latitude"
              className="flex-1 px-4 py-2 rounded-full bg-gray-100"
            />
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleInput}
              placeholder="Longitude"
              className="flex-1 px-4 py-2 rounded-full bg-gray-100"
            />
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

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-6 pb-10 px-4 sticky bottom-0 bg-gray-100 pt-4 lg:relative lg:bg-transparent lg:pt-0">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-all w-full lg:w-auto"
        >
          Save Land Entry
        </button>
      </div>
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
        <div className="bg-red-50 rounded-2xl shadow  p-4 space-y-3">
          <h2 className="font-semibold text-lg">New Land Suggestion</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">
                Suggested Farmer Name
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">
                Suggested Farmer Phone
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Suggested Village</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Suggested Mandal</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-gray-700">Keep in Special Package</span>
          </label>
          <p className="text-sm text-gray-500">
            Check this if the land is a high‑priority or has unique features.
          </p>

          <div className="space-y-1">
            <label className="text-gray-700 text-sm">Assign Mediator</label>
            <select className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400">
              <option>Select a mediator...</option>
            </select>
            <p className="text-xs text-gray-500">
              Mediator list is filtered by the selected district.
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
                <select className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400">
                  <option>Thinking</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm">
                  Certification location
                </label>
                <input
                  type="type"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
          </div>

          {/* Board Duration */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-gray-700 text-sm">Board Duration</label>
              <input
                type="date"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                defaultValue="2024-06-01"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-gray-700 text-sm invisible">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                defaultValue="2024-12-01"
              />
            </div>
          </div>

          {/* Board Photos */}
          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition">
              <span>📷</span> Take Photo
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition">
              <span>⤴️</span> Upload Photo
            </button>
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
                <option>Interested</option>
                <option>Not Interested</option>
                <option>Follow up</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (!visitorName || !visitorPhone) return;

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
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm"
          >
            + Add Visitor
          </button>

          <h3 className="text-sm font-semibold text-gray-700 pt-4">
            Previous Visitors
          </h3>
          <table className="w-full text-sm border-t mt-2">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={i} className="border-b">
                  <td>{v.date}</td>
                  <td>{v.name}</td>
                  <td>{v.phone}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
