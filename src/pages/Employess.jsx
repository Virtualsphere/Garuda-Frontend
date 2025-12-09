import React, { useState, useEffect, useRef } from "react";
import { PanelRight, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";

/**
 * Employee.jsx
 * - Fetches all users + related tables
 * - Opens an edit panel with all fields (address, aadhar, salary, bank, work, vehicle)
 * - Supports updating text fields and uploading 4 files:
 *    - image (profile)
 *    - photo
 *    - aadhar_front_image
 *    - aadhar_back_image
 * - Sends multipart/form-data PUT to /admin/personal/details
 */

export default function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("Field Executives");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  // keep track of object URLs we create for previews so we can revoke them
  const createdUrls = useRef([]);

  const tabs = [
    "Field Executives",
    "Town Incharges",
    "HR & Training",
    "Telecallers",
    "Mediators",
    "Marketing",
    "Job Posters",
    "Recruitment",
  ];

  const roleMap = {
    "field executive": "Field Executives",
    "town incharge": "Town Incharges",
    hr: "HR & Training",
    telecaller: "Telecallers",
    mediator: "Mediators",
    marketing: "Marketing",
    "job poster": "Job Posters",
    recruitment: "Recruitment",
    admin: "Admin",
  };

  // helper to create preview URL for either existing backend URL (string) or new File
  const filePreview = (fileOrUrl) => {
    if (!fileOrUrl) return null;
    if (fileOrUrl instanceof File) {
      const url = URL.createObjectURL(fileOrUrl);
      createdUrls.current.push(url);
      return url;
    }
    // backend already returns full URL like http://localhost:5000/public/images/...
    return fileOrUrl;
  };

  // fetch users + relational tables and merge for UI
  const fetchAll = async () => {
    try {
      const res = await fetch(getApiUrl(`/admin/personal/details`), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!data?.users) return;

      const merged = data.users.map((u) => ({
        ...u,
        roleLabel: roleMap[u.role?.toLowerCase()] || u.role,
        image: u.image || null,
        photo: u.photo || null,
        address: data.address?.find((x) => x.unique_id === u.unique_id) || {},
        aadhar: data.aadhar?.find((x) => x.unique_id === u.unique_id) || {},
        salary:
          data.salary_package?.find((x) => x.unique_id === u.unique_id) || {},
        bank: data.bank_account?.find((x) => x.unique_id === u.unique_id) || {},
        work_location:
          data.work_location?.find((x) => x.unique_id === u.unique_id) || {},
        vehicle:
          data.vehicle_information?.find((x) => x.unique_id === u.unique_id) ||
          {},
      }));

      setEmployees(merged);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAll();

    // cleanup on unmount: revoke created object URLs
    return () => {
      createdUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // open panel -> deep copy employee into formData
  const openEditPanel = (emp) => {
    setSelectedEmployee(emp);
    // deep copy so changes don't mutate the list directly
    const copy = JSON.parse(JSON.stringify(emp));

    // keep file fields null initially; existing backend URLs are in copy.image/copy.photo etc.
    // but if you want them to be previewed, they will be handled by filePreview
    setFormData(copy);
  };

  const closeEditPanel = () => {
    // revoke any object URLs created for previews during editing
    createdUrls.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    createdUrls.current = [];
    setSelectedEmployee(null);
    setFormData({});
  };

  // update nested object fields
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  // top-level fields like name, phone, email
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // file inputs: either top-level (image/photo) or nested (aadhar.*)
  const handleFileChange = (path, file) => {
    // path: e.g. "image" or "photo" or "aadhar.aadhar_front_image"
    if (!path) return;
    const parts = path.split(".");
    if (parts.length === 1) {
      // top-level
      setFormData((prev) => ({ ...prev, [path]: file }));
    } else {
      const [section, field] = parts;
      handleNestedChange(section, field, file);
    }
  };

  // construct FormData and PUT to backend
  const handleUpdate = async () => {
    if (!formData?.unique_id) {
      console.error("Missing unique_id in formData");
      return;
    }

    const fd = new FormData();

    // include unique_id so backend can upsert based on it
    fd.append("unique_id", formData.unique_id);

    // Basic user fields
    ["name", "email", "phone", "blood_group", "role"].forEach((k) =>
      fd.append(k, formData[k] ?? "")
    );

    // Address fields (flat)
    if (formData.address) {
      ["state", "district", "mandal", "village", "pincode"].forEach((k) =>
        fd.append(k, formData.address[k] ?? "")
      );
    } else {
      ["state", "district", "mandal", "village", "pincode"].forEach((k) =>
        fd.append(k, "")
      );
    }

    // Aadhar fields
    fd.append("aadhar_number", formData.aadhar?.aadhar_number ?? "");

    // Salary
    fd.append("package", formData.salary?.package ?? "");

    // Bank
    [
      "bank_name",
      "account_number",
      "ifsc_code",
      "gpay_number",
      "phonepe_number",
      "upi_id",
    ].forEach((k) => fd.append(k, formData.bank?.[k] ?? ""));

    // Work location
    ["work_state", "work_district", "work_mandal", "work_village"].forEach(
      (k) => fd.append(k, formData.work_location?.[k] ?? "")
    );

    // Vehicle
    ["vehicle_type", "license_plate"].forEach((k) =>
      fd.append(k, formData.vehicle?.[k] ?? "")
    );

    // Files: append only when user has selected a new File object.
    // Backend already handles req.files.* and upserts accordingly.
    if (formData.image instanceof File) {
      fd.append("image", formData.image);
    }
    if (formData.photo instanceof File) {
      fd.append("photo", formData.photo);
    }
    // aadhar images (nested)
    if (formData.aadhar?.aadhar_front_image instanceof File) {
      fd.append("aadhar_front_image", formData.aadhar.aadhar_front_image);
    }
    if (formData.aadhar?.aadhar_back_image instanceof File) {
      fd.append("aadhar_back_image", formData.aadhar.aadhar_back_image);
    }

    try {
      const res = await fetch(getApiUrl(`/admin/personal/details`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("Update failed:", json);
        alert(json.error || json.message || "Update failed");
        return;
      }

      // success: refresh list and close panel
      await fetchAll();
      closeEditPanel();
      alert(json.message || "Updated successfully");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed (see console)");
    }
  };

  // filtered employees by active tab
  const filteredEmployees = employees.filter(
    (emp) => emp.roleLabel === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                      <PanelRight className="h-5 w-5 text-white" />
                    </div>
          <h1 className="text-xl font-semibold">Employees</h1>
        </div>
        <button onClick={() => navigate("/signup")} className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white">
                  <Plus size={16} /> Add User
        </button>
      </header>

      <div className="p-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Employee Directory
          </h2>
          <p className="text-gray-500 mb-4">
            Browse, manage, and recruit employees by role.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-3 rounded-xl mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="grid grid-cols-5 font-semibold text-gray-600 py-2 border-b">
            <span>Employee</span>
            <span>Role</span>
            <span>Phone</span>
            <span>District</span>
            <span>Salary</span>
          </div>

          {/* List */}
          {filteredEmployees.map((emp) => (
            <div
              key={emp.unique_id}
              onClick={() => openEditPanel(emp)}
              className="grid grid-cols-5 py-4 items-center border-b hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={emp.image || emp.avatar || "/placeholder.png"}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-gray-800 block">
                    {emp.name}
                  </span>
                </div>
              </div>

              <span>{emp.roleLabel}</span>
              <span>{emp.phone}</span>
              <span>{emp.work_location?.work_district || "-"}</span>
              <span>{emp.salary?.package || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Edit Panel */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* Main Centered Modal */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Employee</h2>
              <button onClick={closeEditPanel}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BASIC DETAILS */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Basic Details</h3>

              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Name"
              />

              <input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Email"
              />

              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Phone"
              />

              <input
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Role"
              />

              <input
                name="blood_group"
                value={formData.blood_group || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Blood Group"
              />
            </div>

            {/* IMAGES */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Images</h3>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                {filePreview(formData.image) && (
                  <img
                    src={filePreview(formData.image)}
                    className="w-32 h-32 rounded-xl object-cover mb-3 border shadow-sm"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("image", e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                {filePreview(formData.photo) && (
                  <img
                    src={filePreview(formData.photo)}
                    className="w-32 h-32 rounded-xl object-cover mb-3 border shadow-sm"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("photo", e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Address</h3>
              {["state", "district", "mandal", "village", "pincode"].map(
                (field) => (
                  <input
                    key={field}
                    value={formData.address?.[field] || ""}
                    onChange={(e) =>
                      handleNestedChange("address", field, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder={field}
                  />
                )
              )}
            </div>

            {/* AADHAR */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Aadhar</h3>

              <input
                value={formData.aadhar?.aadhar_number || ""}
                onChange={(e) =>
                  handleNestedChange("aadhar", "aadhar_number", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Aadhar Number"
              />

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Aadhar Front
                  </label>
                  {filePreview(formData.aadhar?.aadhar_front_image) && (
                    <img
                      src={filePreview(formData.aadhar?.aadhar_front_image)}
                      className="w-full h-32 rounded-xl object-cover mb-3 border shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "aadhar.aadhar_front_image",
                        e.target.files[0]
                      )
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Aadhar Back
                  </label>
                  {filePreview(formData.aadhar?.aadhar_back_image) && (
                    <img
                      src={filePreview(formData.aadhar?.aadhar_back_image)}
                      className="w-full h-32 rounded-xl object-cover mb-3 border shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "aadhar.aadhar_back_image",
                        e.target.files[0]
                      )
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SALARY */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Salary Package</h3>
              <input
                value={formData.salary?.package || ""}
                onChange={(e) =>
                  handleNestedChange("salary", "package", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Salary Package"
              />
            </div>

            {/* BANK */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Bank Information</h3>
              {[
                "bank_name",
                "account_number",
                "ifsc_code",
                "gpay_number",
                "phonepe_number",
                "upi_id",
              ].map((field) => (
                <input
                  key={field}
                  value={formData.bank?.[field] || ""}
                  onChange={(e) =>
                    handleNestedChange("bank", field, e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder={field}
                />
              ))}
            </div>

            {/* WORK LOCATION */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Work Location</h3>
              {[
                "work_state",
                "work_district",
                "work_mandal",
                "work_village",
              ].map((field) => (
                <input
                  key={field}
                  value={formData.work_location?.[field] || ""}
                  onChange={(e) =>
                    handleNestedChange("work_location", field, e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder={field}
                />
              ))}
            </div>

            {/* VEHICLE */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-lg">Vehicle Information</h3>
              <input
                value={formData.vehicle?.vehicle_type || ""}
                onChange={(e) =>
                  handleNestedChange("vehicle", "vehicle_type", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Vehicle Type"
              />

              <input
                value={formData.vehicle?.license_plate || ""}
                onChange={(e) =>
                  handleNestedChange("vehicle", "license_plate", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
                placeholder="License Plate"
              />
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleUpdate}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl mt-6 font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
