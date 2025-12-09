import { useState } from "react";
import { ChevronDown, ChevronUp, PanelRight } from "lucide-react";
import { getApiUrl } from "../config/api";

export const DataEntry = () => {
  const [form, setForm] = useState({
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
      land_type: "",
      water_source: "",
      garden: "",
      shed_details: "",
      farm_pond: "",
      residental: "",
      fencing: "",
      road_path: "",
      latitude: "",
      longitude: "",
      path_to_land: "",
      dispute_type: "",
      siblings_involve_in_dispute: "",
    });
  
    const handleInput = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSelectButton = (name, value) => {
      setForm({ ...form, [name]: value });
    };
  
    // FILE STATES
    const [passbookPhoto, setPassbookPhoto] = useState(null);
    const [landBorder, setLandBorder] = useState(null);
    const [landPhotos, setLandPhotos] = useState([]);
    const [landVideos, setLandVideos] = useState([]);
  
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
  
        Object.entries(form).forEach(([key, value]) => {
          fd.append(key, value);
        });
  
        if (passbookPhoto) fd.append("passbook_photo", passbookPhoto);
        if (landBorder) fd.append("land_border", landBorder);
  
        landPhotos.forEach((file) => fd.append("land_photo", file));
        landVideos.forEach((file) => fd.append("land_video", file));
  
        const res = await fetch(getApiUrl(`/field-executive/land`), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert("Land Entry Saved Successfully: " + data.land_id);
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to submit land entry");
      }
    };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                            <PanelRight className="h-5 w-5 text-white" />
                          </div>
          <h1 className="text-xl font-semibold">Direct Farmer Data Entry</h1>
        </div>
      </header>
      <div className="p-4 space-y-6">

        {/* ------------------ VILLAGE ADDRESS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Village Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">State</label>
              <select
                name="state"
                onChange={handleInput}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              >
                <option value="Telangana">Telangana</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">District</label>
              <select
                name="district"
                onChange={handleInput}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              >
                <option>Select District</option>
                <option value="tricha">Tricha</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Mandal</label>
              <select
                name="mandal"
                onChange={handleInput}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              >
                <option>Select Mandal</option>
                <option value="random">random</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Village</label>
              <select
                name="village"
                onChange={handleInput}
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              >
                <option>Select Village</option>
                <option value="village">Village</option>
              </select>
            </div>
          </div>
        </div>

        {/* ------------------ FARMER DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Farmer Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                onChange={handleInput}
                type="text"
                className="w-full mt-1 p-2 rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone No</label>
              <input
                name="phone"
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
            <div key={field}>
              <label className="text-sm font-medium">{label}</label>
              <div className="flex gap-2 mt-2">
                {options.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleSelectButton(field, v)}
                    className="px-4 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ------------------ LAND DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">Land Details</h2>

          <div>
            <label className="text-sm font-medium">Land Area</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Acres</label>
                <input
                  type="number"
                  name="land_area"
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Guntas</label>
                <input
                  type="text"
                  name="guntas"
                  onChange={handleInput}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Price Per Acre in Lakhs
              </label>
              <input
                type="number"
                name="price_per_acre"
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

          {/* Select fields */}
          {[
            ["Land Type", "land_type", ["Red", "Black", "Sand"]],
            ["Water Source", "water_source", ["Canal", "Bores", "Cheruvu", "Rain Water Only"]],
            ["Farm Pond", "farm_pond", ["Yes", "No"]],
            ["Garden", "garden", ["Mango", "Coconut", "Guava", "Sapota"]],
            ["Residential", "residental", ["Farm House", "RCC Home", "Asbestos Shelter", "Hut"]],
            ["Shed Details", "shed_details", ["Poultry", "Cow Shed"]],
            ["Fencing", "fencing", ["With Gate", "All Sides", "Partially", "No"]],
          ].map(([label, field, options]) => (
            <div key={field}>
              <label className="text-sm font-medium">{label}</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {options.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleSelectButton(field, v)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full"
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Other input */}
              {field === "garden" && (
                <input
                  name="garden"
                  onChange={handleInput}
                  placeholder="Other..."
                  className="w-full mt-2 p-2 rounded-xl bg-gray-50"
                />
              )}
            </div>
          ))}
        </div>

        {/* ------------------ GPS DETAILS ------------------ */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">GPS & Path Tracking</h2>

          <label className="text-sm font-medium">Path from Main Road</label>
          <div className="flex gap-2 mt-2">
            {["Attached to Road", "No Connectivity", "Record a Path"].map((v) => (
              <button
                key={v}
                onClick={() => handleSelectButton("road_path", v)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full"
              >
                {v}
              </button>
            ))}
          </div>

          <label className="text-sm font-medium">Land Entry Point</label>
          <div className="flex gap-2 mt-2">
            <input
              name="latitude"
              onChange={handleInput}
              placeholder="Latitude"
              className="px-4 py-1 rounded-full bg-gray-100"
            />
            <input
              name="longitude"
              onChange={handleInput}
              placeholder="Longitude"
              className="px-4 py-1 rounded-full bg-gray-100"
            />
          </div>

          <label className="text-sm font-medium">Land Border</label>
          <input
            type="file"
            onChange={(e) => setLandBorder(e.target.files[0])}
            className="w-full mt-2 p-2 rounded-xl bg-gray-50"
          />
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
              onChange={addPhotos}
              className="w-full mt-1 p-2 rounded-xl bg-gray-50"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              {landPhotos.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
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
              onChange={addVideos}
              className="w-full mt-1 p-2 rounded-xl bg-gray-50"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              {landVideos.map((file, index) => (
                <div key={index} className="relative">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-24 h-24 rounded object-cover"
                    controls
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
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
      <div className="flex justify-end mt-6 pb-10">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-all"
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
              <label className="text-sm font-medium">Suggested Village</label>
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
            <label className="text-gray-700 text-sm">
              Certification Willingness
            </label>
            <select className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400">
              <option>Thinking</option>
            </select>
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
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm space-y-4 mt-6">
          <h2 className="text-lg font-semibold text-red-700">
            Verification Status
          </h2>
          <h3 className="text-sm font-semibold text-red-600">
            Telecaller Verification
          </h3>

          <div className="space-y-1">
            <label className="text-gray-700 text-sm">Verified By</label>
            <input
              type="text"
              defaultValue="Suresh Kumar"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 text-sm">
              Date of Verification
            </label>
            <input
              type="date"
              defaultValue="2023-05-10"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-95 transition">
            <span>↻</span> Request Re-check
          </button>
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
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-gray-700 text-sm">Visitor Phone</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 pt-4">
            Previous Visitors
          </h3>
          <table className="w-full text-sm border-t border-gray-300 pt-2">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">2024-05-20</td>
                <td className="py-2">Potential Buyer Corp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
