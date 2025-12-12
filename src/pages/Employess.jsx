import React, { useState, useEffect, useRef } from "react";
import { PanelRight, X, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tabs, setTabs] = useState([]); // Dynamic tabs from user roles
  const [activeTab, setActiveTab] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const createdUrls = useRef([]);

  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return "Unknown";
    return roleName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch all users + relational tables
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://72.61.169.226/admin/personal/details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (!data?.users) {
        setEmployees([]);
        setTabs([]);
        return;
      }

      // Merge user data with related tables
      const merged = data.users.map((u) => ({
        ...u,
        roleLabel: u.role || "Unknown",
        displayRole: formatRoleName(u.role),
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

      // Extract unique roles from users to create tabs
      const uniqueRoles = [
        ...new Set(merged.map((emp) => emp.role).filter(Boolean)),
      ];

      // Create tabs with formatted names and sort alphabetically
      const roleTabs = uniqueRoles
        .map((role) => ({
          original: role,
          display: formatRoleName(role),
          count: merged.filter((emp) => emp.role === role).length,
        }))
        .sort((a, b) => a.display.localeCompare(b.display));

      setTabs(roleTabs);

      // Set first tab as active if available
      if (roleTabs.length > 0 && !activeTab) {
        setActiveTab(roleTabs[0].original);
      }

      console.log(`Found ${uniqueRoles.length} unique roles:`, uniqueRoles);
      console.log(`Total employees: ${merged.length}`);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to load employees. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    // Cleanup on unmount
    return () => {
      createdUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open edit panel
  const openEditPanel = (emp) => {
    setSelectedEmployee(emp);
    const copy = JSON.parse(JSON.stringify(emp));
    setFormData(copy);
  };

  // Close edit panel
  const closeEditPanel = () => {
    createdUrls.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    createdUrls.current = [];
    setSelectedEmployee(null);
    setFormData({});
  };

  // Update nested object fields
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  // Top-level fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File inputs
  const handleFileChange = (path, file) => {
    if (!path) return;
    const parts = path.split(".");
    if (parts.length === 1) {
      setFormData((prev) => ({ ...prev, [path]: file }));
    } else {
      const [section, field] = parts;
      handleNestedChange(section, field, file);
    }
  };

  // Update employee
  const handleUpdate = async () => {
    if (!formData?.unique_id) {
      console.error("Missing unique_id in formData");
      return;
    }

    const fd = new FormData();
    fd.append("unique_id", formData.unique_id);

    // Basic user fields
    ["name", "email", "phone", "blood_group", "role"].forEach((k) =>
      fd.append(k, formData[k] ?? "")
    );

    // Address fields
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

    // Files
    if (formData.image instanceof File) {
      fd.append("image", formData.image);
    }
    if (formData.photo instanceof File) {
      fd.append("photo", formData.photo);
    }
    if (formData.aadhar?.aadhar_front_image instanceof File) {
      fd.append("aadhar_front_image", formData.aadhar.aadhar_front_image);
    }
    if (formData.aadhar?.aadhar_back_image instanceof File) {
      fd.append("aadhar_back_image", formData.aadhar.aadhar_back_image);
    }

    try {
      const res = await fetch("http://72.61.169.226/admin/personal/details", {
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

      await fetchAll();
      closeEditPanel();
      alert(json.message || "Updated successfully");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed (see console)");
    }
  };

  // Filter employees by active tab
  const filteredEmployees = employees.filter((emp) => emp.role === activeTab);

  // Handle role change in form
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData((prev) => ({ ...prev, role: newRole }));

    // If changing role and it's a new role, add to tabs if not already present
    if (newRole && !tabs.find((tab) => tab.original === newRole)) {
      const newTab = {
        original: newRole,
        display: formatRoleName(newRole),
        count: 1,
      };
      setTabs((prev) =>
        [...prev, newTab].sort((a, b) => a.display.localeCompare(b.display))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="flex h-14 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Employees</h1>
            <p className="text-sm text-gray-500">
              {tabs.length} role(s) • {employees.length} employee(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Employee Directory
              </h2>
              <p className="text-gray-500">
                Browse, manage, and recruit employees by role.
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading employees...
              </div>
            )}
          </div>

          {/* Dynamic Tabs */}
          <div className="mb-6">
            {loading ? (
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : tabs.length > 0 ? (
              <div className="flex flex-wrap gap-2 bg-gray-100 p-3 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.original}
                    onClick={() => setActiveTab(tab.original)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.original
                        ? "bg-white shadow-sm text-orange-600"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{tab.display}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">
                  No employees found. Add your first employee!
                </p>
              </div>
            )}
          </div>

          {/* Employee List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredEmployees.length > 0 ? (
            <>
              {/* Active Tab Header */}
              <div className="mb-4 px-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {formatRoleName(activeTab)} ({filteredEmployees.length}{" "}
                  employees)
                </h3>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-5 font-semibold text-gray-600 py-3 border-b bg-gray-50 rounded-t-lg px-4">
                <span>Employee</span>
                <span>Role</span>
                <span>Phone</span>
                <span>District</span>
                <span>Salary</span>
              </div>

              {filteredEmployees.map((emp) => (
                <div
                  key={emp.unique_id}
                  onClick={() => openEditPanel(emp)}
                  className="grid grid-cols-5 py-4 items-center border-b hover:bg-gray-50 transition cursor-pointer px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* FIX THIS IMAGE TAG */}
                      <img
                        src={
                          emp.image ||
                          emp.photo ||
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="
                        }
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null; // CRITICAL: Prevent infinite loop
                          e.target.style.display = "none";
                        }}
                        loading="lazy"
                      />
                      {emp.blood_group && (
                        <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                          {emp.blood_group}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 block">
                        {emp.name}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium">{emp.displayRole}</span>
                  <span className="text-gray-700">{emp.phone || "-"}</span>
                  <span className="text-gray-700">
                    {emp.work_location?.work_district ||
                      emp.address?.district ||
                      "-"}
                  </span>
                  <span className="font-medium text-green-600">
                    {emp.salary?.package ? `₹${emp.salary.package}` : "-"}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No {activeTab ? formatRoleName(activeTab) : "Employees"} Found
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab
                  ? `No employees with role "${formatRoleName(
                      activeTab
                    )}" found.`
                  : "No employees found in the system."}
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus size={16} /> Add New Employee
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Panel */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Edit Employee</h2>
                <p className="text-sm text-gray-500">
                  ID: {formData.unique_id}
                </p>
              </div>
              <button
                onClick={closeEditPanel}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BASIC DETAILS */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Basic Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    name="role"
                    value={formData.role || ""}
                    onChange={handleRoleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Employee Role"
                    list="role-suggestions"
                  />
                  <datalist id="role-suggestions">
                    {tabs.map((tab) => (
                      <option key={tab.original} value={tab.original} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email Address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <input
                    name="blood_group"
                    value={formData.blood_group || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Blood Group"
                  />
                </div>
              </div>
            </div>

            {/* IMAGES SECTION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Profile Images
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="mb-3">
                    {filePreview(formData.image) ? (
                      <img
                        src={filePreview(formData.image)}
                        alt="Profile"
                        className="w-32 h-32 rounded-xl object-cover border shadow-sm mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("image", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Additional Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Photo
                  </label>
                  <div className="mb-3">
                    {filePreview(formData.photo) ? (
                      <img
                        src={filePreview(formData.photo)}
                        alt="Photo"
                        className="w-32 h-32 rounded-xl object-cover border shadow-sm mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                        <span className="text-gray-400">No photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("photo", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS SECTION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Address Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["state", "district", "mandal", "village", "pincode"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        value={formData.address?.[field] || ""}
                        onChange={(e) =>
                          handleNestedChange("address", field, e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* AADHAR SECTION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Aadhar Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number
                </label>
                <input
                  value={formData.aadhar?.aadhar_number || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "aadhar",
                      "aadhar_number",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  placeholder="Aadhar Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Front Image
                  </label>
                  <div className="mb-3">
                    {filePreview(formData.aadhar?.aadhar_front_image) ? (
                      <img
                        src={filePreview(formData.aadhar?.aadhar_front_image)}
                        alt="Aadhar Front"
                        className="w-full h-48 rounded-xl object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "aadhar.aadhar_front_image",
                        e.target.files[0]
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Back Image
                  </label>
                  <div className="mb-3">
                    {filePreview(formData.aadhar?.aadhar_back_image) ? (
                      <img
                        src={filePreview(formData.aadhar?.aadhar_back_image)}
                        alt="Aadhar Back"
                        className="w-full h-48 rounded-xl object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "aadhar.aadhar_back_image",
                        e.target.files[0]
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SALARY SECTION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Salary Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Package
                </label>
                <input
                  value={formData.salary?.package || ""}
                  onChange={(e) =>
                    handleNestedChange("salary", "package", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter salary package"
                />
              </div>
            </div>

            {/* BANK SECTION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Bank Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "bank_name",
                  "account_number",
                  "ifsc_code",
                  "gpay_number",
                  "phonepe_number",
                  "upi_id",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace(/_/g, " ")}
                    </label>
                    <input
                      value={formData.bank?.[field] || ""}
                      onChange={(e) =>
                        handleNestedChange("bank", field, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* WORK LOCATION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Work Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "work_state",
                  "work_district",
                  "work_mandal",
                  "work_village",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace("work_", "").replace("_", " ")}
                    </label>
                    <input
                      value={formData.work_location?.[field] || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "work_location",
                          field,
                          e.target.value
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${field
                        .replace("work_", "")
                        .replace("_", " ")}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* VEHICLE INFORMATION */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <input
                    value={formData.vehicle?.vehicle_type || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "vehicle",
                        "vehicle_type",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Vehicle Type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <input
                    value={formData.vehicle?.license_plate || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "vehicle",
                        "license_plate",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="License Plate"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={closeEditPanel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
