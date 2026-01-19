import React, { useState, useEffect, useRef } from "react";
import {
  PanelRight,
  X,
  Plus,
  RefreshCw,
  Menu,
  UserPlus,
  Trash2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const createdUrls = useRef([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Signup form state
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    agree: false,
  });
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Location states for HOME ADDRESS
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [homeLocationLoading, setHomeLocationLoading] = useState({
    states: false,
    districts: false,
    mandals: false,
    villages: false,
  });

  // Location states for WORK LOCATION
  const [workStates, setWorkStates] = useState([]);
  const [workDistricts, setWorkDistricts] = useState([]);
  const [workMandals, setWorkMandals] = useState([]);
  const [workVillages, setWorkVillages] = useState([]);
  const [workLocationLoading, setWorkLocationLoading] = useState({
    states: false,
    districts: false,
    mandals: false,
    villages: false,
  });

  // To store IDs (for fetching dependent dropdowns)
  const [homeLocationIds, setHomeLocationIds] = useState({
    stateId: "",
    districtId: "",
    mandalId: "",
    villageId: "",
  });

  const [workLocationIds, setWorkLocationIds] = useState({
    stateId: "",
    districtId: "",
    mandalId: "",
    villageId: "",
  });

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // NEW: States for employee dropdowns (for Assign To and Report To)
  const [allEmployeesList, setAllEmployeesList] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return "Unknown";
    return roleName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Add this Tooltip component after imports and before the Employee component
  const Tooltip = ({ children, text, position = "top" }) => {
    const [visible, setVisible] = useState(false);

    const positionClasses = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
      top: "top-full left-1/2 -translate-x-1/2 -mt-1",
      bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
      left: "left-full top-1/2 -translate-y-1/2 -ml-1",
      right: "right-full top-1/2 -translate-y-1/2 -mr-1",
    };

    return (
      <div className="relative inline-block w-full">
        <div
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="w-full"
        >
          {children}
        </div>

        {visible && (
          <div
            className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap ${positionClasses[position]}`}
          >
            {text}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowClasses[position]}`}
            />
          </div>
        )}
      </div>
    );
  };

  const filePreview = (fileOrUrl) => {
    if (!fileOrUrl) return null;
    if (fileOrUrl instanceof File) {
      const url = URL.createObjectURL(fileOrUrl);
      createdUrls.current.push(url);
      return url;
    }
    // backend already returns full URL like http://72.61.169.226/public/images/...
    return fileOrUrl;
  };

  // NEW: Fetch all employees for dropdowns (excluding current employee and "user" role)
  const fetchAllEmployeesForDropdown = async (excludeUniqueId = null) => {
    try {
      setLoadingEmployees(true);
      const res = await fetch("http://72.61.169.226/admin/personal/details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (!data?.users) {
        setAllEmployeesList([]);
        return;
      }

      // Format employees for dropdown - EXCLUDE "user" role
      const formattedEmployees = data.users
        .filter(user => {
          // Exclude current employee if provided
          if (excludeUniqueId && user.unique_id === excludeUniqueId) return false;
          // Exclude employees with "user" role (case insensitive)
          const userRole = user.role?.toLowerCase() || "";
          return userRole !== "user";
        })
        .map(user => ({
          id: user.unique_id,
          name: user.name,
          phone: user.phone || "",
          email: user.email || "",
          role: user.role || "",
          displayRole: formatRoleName(user.role),
          // Get work district for filtering if needed
          work_location: data.work_location?.find((x) => x.unique_id === user.unique_id) || {},
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setAllEmployeesList(formattedEmployees);
      console.log(`Loaded ${formattedEmployees.length} employees for dropdown (excluding "user" role)`);
    } catch (err) {
      console.error("Error fetching employees for dropdown:", err);
      setAllEmployeesList([]);
    } finally {
      setLoadingEmployees(false);
    }
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
        personal_assignment:
          data.personal_assignment?.find((x) => x.unique_id === u.unique_id) ||
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

  const fetchStates = async () => {
    try {
      setHomeLocationLoading((prev) => ({ ...prev, states: true }));
      setWorkLocationLoading((prev) => ({ ...prev, states: true }));

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
        setWorkStates(data); // Same states for both locations
      } else {
        console.error("Failed to fetch states");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setHomeLocationLoading((prev) => ({ ...prev, states: false }));
      setWorkLocationLoading((prev) => ({ ...prev, states: false }));
    }
  };

  // HOME ADDRESS: Fetch districts based on stateId
  const fetchDistricts = async (stateId) => {
    if (!stateId) {
      setDistricts([]);
      setMandals([]);
      setVillages([]);
      return;
    }

    try {
      setHomeLocationLoading((prev) => ({ ...prev, districts: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/states/${stateId}/districts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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
      setHomeLocationLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  // HOME ADDRESS: Fetch mandals based on districtId
  const fetchMandals = async (districtId) => {
    if (!districtId) {
      setMandals([]);
      setVillages([]);
      return;
    }

    try {
      setHomeLocationLoading((prev) => ({ ...prev, mandals: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/districts/${districtId}/mandals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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
      setHomeLocationLoading((prev) => ({ ...prev, mandals: false }));
    }
  };

  // HOME ADDRESS: Fetch villages based on mandalId
  const fetchVillages = async (mandalId) => {
    if (!mandalId) {
      setVillages([]);
      return;
    }

    try {
      setHomeLocationLoading((prev) => ({ ...prev, villages: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/mandals/${mandalId}/villages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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
      setHomeLocationLoading((prev) => ({ ...prev, villages: false }));
    }
  };

  const fetchWorkDistricts = async (stateId) => {
    if (!stateId) {
      setWorkDistricts([]);
      setWorkMandals([]);
      setWorkVillages([]);
      return;
    }

    try {
      setWorkLocationLoading((prev) => ({ ...prev, districts: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/states/${stateId}/districts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setWorkDistricts(data);
      } else {
        console.error("Failed to fetch work districts");
      }
    } catch (error) {
      console.error("Error fetching work districts:", error);
    } finally {
      setWorkLocationLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const fetchWorkMandals = async (districtId) => {
    if (!districtId) {
      setWorkMandals([]);
      setWorkVillages([]);
      return;
    }

    try {
      setWorkLocationLoading((prev) => ({ ...prev, mandals: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/districts/${districtId}/mandals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setWorkMandals(data);
      } else {
        console.error("Failed to fetch work mandals");
      }
    } catch (error) {
      console.error("Error fetching work mandals:", error);
    } finally {
      setWorkLocationLoading((prev) => ({ ...prev, mandals: false }));
    }
  };

  // WORK LOCATION: Fetch villages based on mandalId
  const fetchWorkVillages = async (mandalId) => {
    if (!mandalId) {
      setWorkVillages([]);
      return;
    }

    try {
      setWorkLocationLoading((prev) => ({ ...prev, villages: true }));
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://72.61.169.226/admin/mandals/${mandalId}/villages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setWorkVillages(data);
      } else {
        console.error("Failed to fetch work villages");
      }
    } catch (error) {
      console.error("Error fetching work villages:", error);
    } finally {
      setWorkLocationLoading((prev) => ({ ...prev, villages: false }));
    }
  };

  // Open password change form
  const openPasswordForm = () => {
    setShowPasswordForm(true);
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  // Close password change form
  const closePasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update employee password
  const updateEmployeePassword = async () => {
    const { newPassword, confirmPassword } = passwordData;

    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordError("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      const response = await fetch(
        "http://72.61.169.226/admin/update/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            unique_id: formData.unique_id,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        closePasswordForm();
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Fetch roles for signup form
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://72.61.169.226/admin/roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched roles:", data.roles);
        setRoles(data.roles || []);

        // If roles are fetched, set default role to first one if exists
        if (data.roles && data.roles.length > 0) {
          setSignupData((prev) => ({
            ...prev,
            role: data.roles[0].name, // Keep original case
          }));
        }
      } else {
        setSignupError(data.error || "Failed to load roles");
        console.error("Error fetching roles:", data.error);
      }
    } catch (err) {
      console.error("Network error fetching roles:", err);
      setSignupError("Network error. Please check your connection.");
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchRoles();
    fetchStates();
    fetchAllEmployeesForDropdown(); // Fetch employees for dropdown

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

    // Reset location IDs
    setHomeLocationIds({
      stateId: "",
      districtId: "",
      mandalId: "",
      villageId: "",
    });

    setWorkLocationIds({
      stateId: "",
      districtId: "",
      mandalId: "",
      villageId: "",
    });

    // Fetch employees for dropdown (excluding current employee)
    fetchAllEmployeesForDropdown(emp.unique_id);

    // If employee has home address, try to find and set IDs
    if (emp.address?.state) {
      const currentState = states.find((s) => s.name === emp.address.state);
      if (currentState) {
        setHomeLocationIds((prev) => ({ ...prev, stateId: currentState.id }));
        fetchDistricts(currentState.id).then(() => {
          // After districts are fetched, try to find district ID
          if (emp.address?.district) {
            const currentDistrict = districts.find(
              (d) => d.name === emp.address.district,
            );
            if (currentDistrict) {
              setHomeLocationIds((prev) => ({
                ...prev,
                districtId: currentDistrict.id,
              }));
              fetchMandals(currentDistrict.id).then(() => {
                // After mandals are fetched, try to find mandal ID
                if (emp.address?.mandal) {
                  const currentMandal = mandals.find(
                    (m) => m.name === emp.address.mandal,
                  );
                  if (currentMandal) {
                    setHomeLocationIds((prev) => ({
                      ...prev,
                      mandalId: currentMandal.id,
                    }));
                    fetchVillages(currentMandal.id).then(() => {
                      // After villages are fetched, try to find village ID
                      if (emp.address?.village) {
                        const currentVillage = villages.find(
                          (v) => v.name === emp.address.village,
                        );
                        if (currentVillage) {
                          setHomeLocationIds((prev) => ({
                            ...prev,
                            villageId: currentVillage.id,
                          }));
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }

    // If employee has work location, try to find and set IDs
    if (emp.work_location?.work_state) {
      const currentWorkState = workStates.find(
        (s) => s.name === emp.work_location.work_state,
      );
      if (currentWorkState) {
        setWorkLocationIds((prev) => ({
          ...prev,
          stateId: currentWorkState.id,
        }));
        fetchWorkDistricts(currentWorkState.id).then(() => {
          if (emp.work_location?.work_district) {
            const currentWorkDistrict = workDistricts.find(
              (d) => d.name === emp.work_location.work_district,
            );
            if (currentWorkDistrict) {
              setWorkLocationIds((prev) => ({
                ...prev,
                districtId: currentWorkDistrict.id,
              }));
              fetchWorkMandals(currentWorkDistrict.id).then(() => {
                if (emp.work_location?.work_mandal) {
                  const currentWorkMandal = workMandals.find(
                    (m) => m.name === emp.work_location.work_mandal,
                  );
                  if (currentWorkMandal) {
                    setWorkLocationIds((prev) => ({
                      ...prev,
                      mandalId: currentWorkMandal.id,
                    }));
                    fetchWorkVillages(currentWorkMandal.id).then(() => {
                      if (emp.work_location?.work_village) {
                        const currentWorkVillage = workVillages.find(
                          (v) => v.name === emp.work_location.work_village,
                        );
                        if (currentWorkVillage) {
                          setWorkLocationIds((prev) => ({
                            ...prev,
                            villageId: currentWorkVillage.id,
                          }));
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
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

  // Open delete confirmation
  const openDeleteConfirm = (emp) => {
    setEmployeeToDelete(emp);
    setShowDeleteConfirm(true);
  };

  // Close delete confirmation
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
  };

  // Delete employee function - UPDATED to use route parameter
  const deleteEmployee = async () => {
    if (!employeeToDelete) return;

    setDeleteLoading(true);
    try {
      // Using route parameter format: /admin/personal/detial/:uniqueId
      const response = await fetch(
        `http://72.61.169.226/admin/personal/detial/${employeeToDelete.unique_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          // No need for body since unique_id is in the URL
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Employee deleted successfully!");

        // Close confirmation modal
        closeDeleteConfirm();

        // Refresh employee list
        fetchAll();
      } else {
        alert(`Error: ${data.error || "Failed to delete employee"}`);
        console.error("Delete error:", data);
      }
    } catch (err) {
      console.error("Network error deleting employee:", err);
      alert("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open signup form
  const openSignupForm = () => {
    setShowSignupForm(true);
    // Refresh roles when opening signup form
    fetchRoles();
  };

  // Close signup form
  const closeSignupForm = () => {
    setShowSignupForm(false);
    setSignupData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: roles.length > 0 ? roles[0].name : "",
      agree: false,
    });
    setSignupError("");
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle HOME location change
  const handleHomeLocationChange = async (type, value, id) => {
    const updates = { [type]: value };
    const idUpdates = { [`${type}Id`]: id };

    // Cascade clearing for dependent fields
    if (type === "state") {
      updates.district = "";
      updates.mandal = "";
      updates.village = "";
      idUpdates.districtId = "";
      idUpdates.mandalId = "";
      idUpdates.villageId = "";
      setDistricts([]);
      setMandals([]);
      setVillages([]);

      if (id) {
        await fetchDistricts(id);
      }
    } else if (type === "district") {
      updates.mandal = "";
      updates.village = "";
      idUpdates.mandalId = "";
      idUpdates.villageId = "";
      setMandals([]);
      setVillages([]);

      if (id) {
        await fetchMandals(id);
      }
    } else if (type === "mandal") {
      updates.village = "";
      idUpdates.villageId = "";
      setVillages([]);

      if (id) {
        await fetchVillages(id);
      }
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        ...updates,
      },
    }));

    // Update location IDs
    setHomeLocationIds((prev) => ({
      ...prev,
      ...idUpdates,
    }));
  };

  // Handle WORK location change
  const handleWorkLocationChange = async (type, value, id) => {
    const fieldName = type.replace("work_", "");
    const updates = { [type]: value };
    const idUpdates = { [`${fieldName}Id`]: id };

    // Cascade clearing for dependent fields
    if (type === "work_state") {
      updates.work_district = "";
      updates.work_mandal = "";
      updates.work_village = "";
      idUpdates.districtId = "";
      idUpdates.mandalId = "";
      idUpdates.villageId = "";
      setWorkDistricts([]);
      setWorkMandals([]);
      setWorkVillages([]);

      if (id) {
        await fetchWorkDistricts(id);
      }
    } else if (type === "work_district") {
      updates.work_mandal = "";
      updates.work_village = "";
      idUpdates.mandalId = "";
      idUpdates.villageId = "";
      setWorkMandals([]);
      setWorkVillages([]);

      if (id) {
        await fetchWorkMandals(id);
      }
    } else if (type === "work_mandal") {
      updates.work_village = "";
      idUpdates.villageId = "";
      setWorkVillages([]);

      if (id) {
        await fetchWorkVillages(id);
      }
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      work_location: {
        ...prev.work_location,
        ...updates,
      },
    }));

    // Update location IDs
    setWorkLocationIds((prev) => ({
      ...prev,
      ...idUpdates,
    }));
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.agree) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    const { name, email, phone, password, role } = signupData;

    setSignupLoading(true);

    try {
      const response = await fetch("http://72.61.169.226/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role: role, // Send exact role name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("Registered user:", data.user);

        // Reset form and close
        closeSignupForm();

        // Refresh employee list
        fetchAll();
        // Also refresh dropdown list
        fetchAllEmployeesForDropdown();
      } else {
        alert(`Error: ${data.error || "Registration failed"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again.");
    } finally {
      setSignupLoading(false);
    }
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

  // NEW: Handle employee dropdown change (for Assign To and Report To)
  const handleEmployeeDropdownChange = (field, uniqueId) => {
    // Find the selected employee
    const selectedEmployee = allEmployeesList.find(emp => emp.id === uniqueId);
    
    // Update form data with unique_id and display name
    setFormData((prev) => ({
      ...prev,
      personal_assignment: {
        ...prev.personal_assignment,
        [field]: uniqueId, // Store unique_id
        [`${field}_name`]: selectedEmployee ? selectedEmployee.name : "", // Store name for display
      },
    }));
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
    [
      "name",
      "email",
      "phone",
      "status",
      "blood_group",
      "role",
      "join_date",
    ].forEach((k) => fd.append(k, formData[k] ?? ""));

    // Address fields
    if (formData.address) {
      [
        "state",
        "district",
        "mandal",
        "village",
        "pincode",
        "near_town_1",
        "near_town_2",
        "near_town_3",
      ].forEach((k) => fd.append(k, formData.address[k] ?? ""));
    } else {
      [
        "state",
        "district",
        "mandal",
        "village",
        "pincode",
        "near_town_1",
        "near_town_2",
        "near_town_3",
      ].forEach((k) => fd.append(k, ""));
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
      (k) => fd.append(k, formData.work_location?.[k] ?? ""),
    );

    // Vehicle
    ["vehicle_type", "license_plate"].forEach((k) =>
      fd.append(k, formData.vehicle?.[k] ?? ""),
    );

    // NEW: Send unique_id for report_to and assigned_employee
    // Get the actual unique_id from personal_assignment
    const reportToUniqueId = formData.personal_assignment?.report_to || "";
    const assignedEmployeeUniqueId = formData.personal_assignment?.assigned_employee || "";
    
    fd.append("report_to", reportToUniqueId);
    fd.append("assigned_employee", assignedEmployeeUniqueId);

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
        [...prev, newTab].sort((a, b) => a.display.localeCompare(b.display)),
      );
    }
  };

  // Helper function to render location dropdown
  const renderLocationDropdown = (
    label,
    value,
    onChange,
    options,
    loading,
    disabled,
    helpText,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={onChange}
        disabled={disabled || loading}
        className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:opacity-50"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
      {loading && <p className="text-xs text-gray-500 mt-1">Loading...</p>}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );

  // NEW: Helper function to render employee dropdown
  const renderEmployeeDropdown = (label, field, currentValue) => {
    // Get the display name for current value
    const currentEmployee = allEmployeesList.find(emp => emp.id === currentValue);
    const displayValue = currentEmployee ? currentEmployee.name : currentValue || "";

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={currentValue || ""}
          onChange={(e) => handleEmployeeDropdownChange(field, e.target.value)}
          disabled={loadingEmployees}
          className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:opacity-50"
        >
          <option value="">Select {label}</option>
          {allEmployeesList.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} - {employee.role} ({employee.phone})
            </option>
          ))}
        </select>
        {loadingEmployees && <p className="text-xs text-gray-500 mt-1">Loading employees...</p>}
        <p className="text-xs text-gray-500 mt-1">
          {allEmployeesList.length} employee(s) available
          {displayValue && ` • Currently selected: ${displayValue}`}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Mobile Header */}
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
              <h1 className="text-lg font-semibold">Employees</h1>
              <p className="text-xs text-gray-500">
                {tabs.length} role(s) • {employees.length} employee(s)
              </p>
            </div>
          </div>
          <button
            onClick={openSignupForm}
            className="flex items-center gap-2 px-3 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex h-14 items-center justify-between bg-white px-6 shadow-sm">
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
            onClick={openSignupForm}
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </header>

      {/* Main Content with Mobile Padding */}
      <div className="p-4 lg:p-6 pt-20 lg:pt-6">
        <div className="rounded-2xl bg-white p-4 lg:p-6 shadow-md border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                Employee Directory
              </h2>
              <p className="text-sm lg:text-base text-gray-500">
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
              <div className="flex flex-wrap gap-2 bg-gray-100 p-2 lg:p-3 rounded-xl overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.original}
                    onClick={() => setActiveTab(tab.original)}
                    className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.original
                        ? "bg-white shadow-sm text-orange-600"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-xs lg:text-sm">{tab.display}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 lg:p-6 border border-dashed border-gray-300 rounded-xl">
                <p className="text-sm lg:text-base text-gray-500">
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
                <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                  {formatRoleName(activeTab)} ({filteredEmployees.length}{" "}
                  employees)
                </h3>
              </div>

              {/* Table Header - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:grid lg:grid-cols-6 font-semibold text-gray-600 py-3 border-b bg-gray-50 rounded-t-lg px-4">
                <span>Employee</span>
                <span>Role</span>
                <span>Phone</span>
                <span>District</span>
                <span>Salary</span>
                <span>Actions</span>
              </div>

              {/* Mobile List View */}
              <div className="lg:hidden space-y-3">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.unique_id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            emp.image ||
                            emp.photo ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="
                          }
                          alt={emp.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
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
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold text-gray-800 block truncate">
                              {emp.name}
                            </span>
                            <span className="text-sm text-gray-600 block mt-1">
                              {emp.displayRole}
                            </span>
                          </div>
                          <span className="font-medium text-green-600 text-sm">
                            {emp.salary?.package
                              ? `₹${emp.salary.package}`
                              : "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <span className="text-gray-700 ml-2 truncate block">
                              {emp.phone || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">District:</span>
                            <span className="text-gray-700 ml-2 truncate block">
                              {emp.work_location?.work_district ||
                                emp.address?.district ||
                                "-"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditPanel(emp)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          {emp.role !== "admin" && emp.role !== "Admin" && (
                            <button
                              onClick={() => openDeleteConfirm(emp)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.unique_id}
                    className="grid grid-cols-6 py-4 items-center border-b hover:bg-gray-50 transition px-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            emp.image ||
                            emp.photo ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="
                          }
                          alt={emp.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
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
                        <span className="text-xs text-gray-500">
                          ID: {emp.unique_id}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditPanel(emp)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                        title="Edit Employee"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      {emp.role !== "admin" && emp.role !== "Admin" && (
                        <button
                          onClick={() => openDeleteConfirm(emp)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 lg:py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 lg:w-16 lg:h-16 mx-auto"
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
              <p className="text-gray-500 mb-4 text-sm lg:text-base">
                {activeTab
                  ? `No employees with role "${formatRoleName(
                      activeTab,
                    )}" found.`
                  : "No employees found in the system."}
              </p>
              <button
                onClick={openSignupForm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white text-sm lg:text-base"
              >
                <Plus size={16} /> Add New Employee
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Panel - Responsive */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl lg:rounded-2xl shadow-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Edit Employee
                </h2>
                <p className="text-xs lg:text-sm text-gray-500">
                  ID: {formData.unique_id}
                </p>
              </div>
              <button
                onClick={closeEditPanel}
                className="p-1 lg:p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            {/* BASIC DETAILS */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Basic Details
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
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
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
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
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
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
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <input
                    name="status"
                    type="text"
                    value={formData.status || ""}
                    onChange={handleChange}
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="Status"
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
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="Blood Group"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    name="join_date"
                    type="date"
                    value={formData.join_date || ""}
                    onChange={handleChange}
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>

            {/* IMAGES SECTION */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Profile Images
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover border shadow-sm mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("image", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover border shadow-sm mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                        <span className="text-gray-400 text-sm">No photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("photo", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS SECTION - UPDATED WITH DROPDOWNS */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Address Details
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {/* State Dropdown */}
                {renderLocationDropdown(
                  "State",
                  formData.address?.state || "",
                  (e) => {
                    const selectedState = states.find(
                      (s) => s.name === e.target.value,
                    );
                    handleHomeLocationChange(
                      "state",
                      e.target.value,
                      selectedState?.id,
                    );
                  },
                  states,
                  homeLocationLoading.states,
                  false,
                  "",
                )}

                {/* District Dropdown */}
                {renderLocationDropdown(
                  "District",
                  formData.address?.district || "",
                  (e) => {
                    const selectedDistrict = districts.find(
                      (d) => d.name === e.target.value,
                    );
                    handleHomeLocationChange(
                      "district",
                      e.target.value,
                      selectedDistrict?.id,
                    );
                  },
                  districts,
                  homeLocationLoading.districts,
                  !homeLocationIds.stateId,
                  !formData.address?.state ? "Please select a state first" : "",
                )}

                {/* Mandal Dropdown */}
                {renderLocationDropdown(
                  "Mandal",
                  formData.address?.mandal || "",
                  (e) => {
                    const selectedMandal = mandals.find(
                      (m) => m.name === e.target.value,
                    );
                    handleHomeLocationChange(
                      "mandal",
                      e.target.value,
                      selectedMandal?.id,
                    );
                  },
                  mandals,
                  homeLocationLoading.mandals,
                  !homeLocationIds.districtId,
                  !formData.address?.district
                    ? "Please select a district first"
                    : "",
                )}

                {/* Village Dropdown */}
                {renderLocationDropdown(
                  "Village",
                  formData.address?.village || "",
                  (e) => {
                    const selectedVillage = villages.find(
                      (v) => v.name === e.target.value,
                    );
                    handleHomeLocationChange(
                      "village",
                      e.target.value,
                      selectedVillage?.id,
                    );
                  },
                  villages,
                  homeLocationLoading.villages,
                  !homeLocationIds.mandalId,
                  !formData.address?.mandal
                    ? "Please select a mandal first"
                    : "",
                )}

                {/* Pincode (remains as input) */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    value={formData.address?.pincode || ""}
                    onChange={(e) =>
                      handleNestedChange("address", "pincode", e.target.value)
                    }
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="Enter Pincode"
                  />
                </div>

                {/* Near Towns (remain as inputs) */}
                {["near_town_1", "near_town_2", "near_town_3"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      value={formData.address?.[field] || ""}
                      onChange={(e) =>
                        handleNestedChange("address", field, e.target.value)
                      }
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                      placeholder={`Enter ${field.replace("_", " ")}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AADHAR SECTION */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
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
                      e.target.value,
                    )
                  }
                  className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 text-sm lg:text-base"
                  placeholder="Aadhar Number"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Front Image
                  </label>
                  <div className="mb-3">
                    {filePreview(formData.aadhar?.aadhar_front_image) ? (
                      <img
                        src={filePreview(formData.aadhar?.aadhar_front_image)}
                        alt="Aadhar Front"
                        className="w-full h-40 lg:h-48 rounded-xl object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-40 lg:h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
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
                        e.target.files[0],
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                        className="w-full h-40 lg:h-48 rounded-xl object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-40 lg:h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
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
                        e.target.files[0],
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SALARY SECTION */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
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
                  className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="Enter salary package"
                />
              </div>
            </div>

            {/* BANK SECTION */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Bank Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {[
                  "bank_name",
                  "account_number",
                  "ifsc_code",
                  "gpay_number",
                  "phonepe_number",
                  "upi_id",
                ].map((field) => (
                  <div
                    key={field}
                    className={
                      ["account_number", "upi_id"].includes(field)
                        ? "lg:col-span-2"
                        : ""
                    }
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace(/_/g, " ")}
                    </label>
                    <input
                      value={formData.bank?.[field] || ""}
                      onChange={(e) =>
                        handleNestedChange("bank", field, e.target.value)
                      }
                      className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* WORK LOCATION - UPDATED WITH DROPDOWNS */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Work Location
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {/* Work State Dropdown */}
                {renderLocationDropdown(
                  "State",
                  formData.work_location?.work_state || "",
                  (e) => {
                    const selectedState = workStates.find(
                      (s) => s.name === e.target.value,
                    );
                    handleWorkLocationChange(
                      "work_state",
                      e.target.value,
                      selectedState?.id,
                    );
                  },
                  workStates,
                  workLocationLoading.states,
                  false,
                  "",
                )}

                {/* Work District Dropdown */}
                {renderLocationDropdown(
                  "District",
                  formData.work_location?.work_district || "",
                  (e) => {
                    const selectedDistrict = workDistricts.find(
                      (d) => d.name === e.target.value,
                    );
                    handleWorkLocationChange(
                      "work_district",
                      e.target.value,
                      selectedDistrict?.id,
                    );
                  },
                  workDistricts,
                  workLocationLoading.districts,
                  !workLocationIds.stateId,
                  !formData.work_location?.work_state
                    ? "Please select a state first"
                    : "",
                )}

                {/* Work Mandal Dropdown */}
                {renderLocationDropdown(
                  "Mandal",
                  formData.work_location?.work_mandal || "",
                  (e) => {
                    const selectedMandal = workMandals.find(
                      (m) => m.name === e.target.value,
                    );
                    handleWorkLocationChange(
                      "work_mandal",
                      e.target.value,
                      selectedMandal?.id,
                    );
                  },
                  workMandals,
                  workLocationLoading.mandals,
                  !workLocationIds.districtId,
                  !formData.work_location?.work_district
                    ? "Please select a district first"
                    : "",
                )}

                {/* Work Village Dropdown */}
                {renderLocationDropdown(
                  "Village",
                  formData.work_location?.work_village || "",
                  (e) => {
                    const selectedVillage = workVillages.find(
                      (v) => v.name === e.target.value,
                    );
                    handleWorkLocationChange(
                      "work_village",
                      e.target.value,
                      selectedVillage?.id,
                    );
                  },
                  workVillages,
                  workLocationLoading.villages,
                  !workLocationIds.mandalId,
                  !formData.work_location?.work_mandal
                    ? "Please select a mandal first"
                    : "",
                )}
              </div>

              {/* Optional: "Same as Home Address" checkbox */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="sameAsHome"
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Copy home address to work location
                      setFormData((prev) => ({
                        ...prev,
                        work_location: {
                          ...prev.work_location,
                          work_state: prev.address?.state || "",
                          work_district: prev.address?.district || "",
                          work_mandal: prev.address?.mandal || "",
                          work_village: prev.address?.village || "",
                        },
                      }));
                      // Also update work location IDs
                      setWorkLocationIds({
                        stateId: homeLocationIds.stateId,
                        districtId: homeLocationIds.districtId,
                        mandalId: homeLocationIds.mandalId,
                        villageId: homeLocationIds.villageId,
                      });
                    }
                  }}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="sameAsHome" className="text-sm text-gray-600">
                  Same as home address
                </label>
              </div>
            </div>

            {/* VEHICLE INFORMATION */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
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
                        e.target.value,
                      )
                    }
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
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
                        e.target.value,
                      )
                    }
                    className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="License Plate"
                  />
                </div>
              </div>
            </div>

            {/* PERSONAL ASSIGNMENT SECTION - UPDATED WITH DROPDOWNS */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-base lg:text-lg border-b pb-2">
                Personal Assignment
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {/* Report To Dropdown */}
                {renderEmployeeDropdown(
                  "Report To",
                  "report_to",
                  formData.personal_assignment?.report_to || ""
                )}

                {/* Assigned Employee Dropdown */}
                {renderEmployeeDropdown(
                  "Assigned Employee",
                  "assigned_employee",
                  formData.personal_assignment?.assigned_employee || ""
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col lg:flex-row gap-3 pt-6 border-t">
              <button
                onClick={closeEditPanel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm lg:text-base"
              >
                Cancel
              </button>
              {formData.role !== "admin" && (
                <button
                  onClick={openPasswordForm}
                  type="button"
                  className="flex-1 px-4 py-3 border border-yellow-500 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg font-medium text-sm lg:text-base transition-colors"
                >
                  Change Password
                </button>
              )}
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-sm lg:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-blue-600">
                  Change Password
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Set a new password for {formData.name || "this employee"}
                </p>
              </div>
              <button
                onClick={closePasswordForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={passwordLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                    required
                    minLength="6"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={passwordLoading}
                  >
                    {showNewPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={passwordLoading}
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 mt-0.5">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700">
                      The password will be updated immediately. Employee will
                      need to use this new password for future logins.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closePasswordForm}
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={updateEmployeePassword}
                  disabled={passwordLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-red-600">
                  Delete Employee
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={closeDeleteConfirm}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={deleteLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg mb-4">
                <div className="relative">
                  <img
                    src={
                      employeeToDelete.image ||
                      employeeToDelete.photo ||
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="
                    }
                    alt={employeeToDelete.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-200"
                  />
                  {employeeToDelete.blood_group && (
                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                      {employeeToDelete.blood_group}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {employeeToDelete.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {employeeToDelete.displayRole}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {employeeToDelete.unique_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {employeeToDelete.email}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 mt-0.5">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">
                      Warning: This will permanently delete:
                    </p>
                    <ul className="text-sm text-yellow-600 mt-1 space-y-1">
                      <li>• Employee profile and all associated data</li>
                      <li>• Address, Aadhar, salary, and bank information</li>
                      <li>• Work location and vehicle details</li>
                      <li>• All related records from the database</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 pt-6 border-t">
              <button
                onClick={closeDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={deleteEmployee}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Employee
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-emerald-700">
                  Create Account
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  New here? Signing up is easy. It only takes a few steps.
                </p>
              </div>
              <button
                onClick={closeSignupForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  maxLength={10}
                  name="phone"
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Role
                  </label>
                  {signupError && (
                    <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
                      {signupError}
                    </div>
                  )}
                </div>

                {rolesLoading ? (
                  <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-emerald-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-gray-600">Loading roles...</span>
                  </div>
                ) : roles.length === 0 ? (
                  <div className="text-center p-3 border border-yellow-300 rounded-lg bg-yellow-50">
                    <p className="text-yellow-700 text-sm">
                      No roles found. Please create roles first in Access
                      Controls.
                    </p>
                  </div>
                ) : (
                  <select
                    name="role"
                    value={signupData.role}
                    onChange={handleSignupChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 bg-white text-sm lg:text-base"
                    required
                  >
                    <option value="">-- Select a Role --</option>
                    {roles.map((role) => (
                      <option
                        key={role.id || role.name}
                        value={role.name}
                        title={role.description || "No description"}
                      >
                        {role.name}
                        {role.description && ` - ${role.description}`}
                      </option>
                    ))}
                  </select>
                )}

                {roles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {roles.length} role(s) loaded from database
                  </div>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 text-sm lg:text-base"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSignupPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={signupData.agree}
                  onChange={handleSignupChange}
                  className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 rounded transition duration-200"
                  required
                />
                <label htmlFor="agree" className="text-gray-600 text-sm">
                  I agree to all Terms & Conditions and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={signupLoading || rolesLoading || !signupData.role}
                className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  signupLoading || rolesLoading || !signupData.role
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                } text-sm lg:text-base`}
              >
                {signupLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
              {/* Submit button tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <p className="font-medium mb-1">
                  After creation, you can edit user details like:
                </p>
                <ul className="mt-1 space-y-1 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Address, contact info, and location details</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Profile picture and documents (Aadhar, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Bank details and salary information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Work location and vehicle information</span>
                  </li>
                </ul>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </form>
            {/* Additional Info Panel */}
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-emerald-600 mr-3">💡</div>
                <div>
                  <h4 className="font-medium text-emerald-800">
                    Complete Profile Later
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    After creating the basic account, you can use the edit form
                    to add: address, profile picture, Aadhar details, bank
                    information, work location, vehicle info, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}