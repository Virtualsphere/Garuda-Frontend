import React, { useState, useEffect } from "react";
import {
  Plus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PanelRight,
  Save,
  X,
  Trash2,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const API_BASE = "http://72.61.169.226";

export default function AccessControls() {
  // All permissions that correspond to menu items
  const allPermissions = [
    "Dashboard",
    "Data Entry",
    "Buyers",
    "Budget",
    "Lands",
    "Stock",
    "Land Codes",
    "Access Controls",
    "New Land",
    "Agents",
    "Garuda Map",
    "Investors",
    "Company Profile",
    "Legal & Docs",
    "Garuda Points",
    "Lands Data and Verification",
    "Employees",
    "Home",
    "My Profile",
    "Schedule",
    "Locations",
    "Travel Wallet",
    "Land Wallet",
    "CRM"
  ];

  const [roles, setRoles] = useState([]);
  const [permissionsState, setPermissionsState] = useState({});
  const [expandedRoles, setExpandedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  // Fetch all roles from backend
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/roles`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          setError("Access denied. You need admin privileges to view roles.");
        } else {
          setError(data.error || "Failed to fetch roles");
        }
        setRoles([]);
        return;
      }
      
      setRoles(data.roles || []);
      
      // Initialize permissions state from database
      const initialPermissions = {};
      const initialExpanded = {};
      
      data.roles.forEach(role => {
        // Ensure permissions is an object, not a string
        let rolePermissions = {};
        
        if (typeof role.permissions === 'string') {
          try {
            rolePermissions = JSON.parse(role.permissions);
          } catch (e) {
            console.error("Error parsing permissions JSON:", e);
            rolePermissions = {};
          }
        } else if (typeof role.permissions === 'object') {
          rolePermissions = role.permissions;
        }
        
        initialPermissions[role.name] = rolePermissions;
        initialExpanded[role.name] = false;
      });
      
      console.log("Initial permissions loaded:", initialPermissions);
      setPermissionsState(initialPermissions);
      setExpandedRoles(initialExpanded);
      setError("");
      
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Toggle permission checkbox - FIXED VERSION
  const togglePermission = (roleName, permissionKey) => {
    console.log(`Toggling ${permissionKey} for ${roleName}`);
    
    setPermissionsState(prev => {
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(prev));
      
      // Ensure the role exists
      if (!newState[roleName]) {
        newState[roleName] = {};
      }
      
      // Get current value (default to false if undefined)
      const currentValue = newState[roleName][permissionKey] || false;
      
      // Toggle the permission
      newState[roleName][permissionKey] = !currentValue;
      
      console.log(`Changed ${permissionKey} from ${currentValue} to ${!currentValue}`);
      console.log("Updated state for", roleName, ":", newState[roleName]);
      
      return newState;
    });
    
    // Update debug message
    setDebug(`Toggled ${permissionKey} for ${roleName}`);
  };

  // Save role permissions to backend
  const saveRolePermissions = async (roleName) => {
    try {
      setSaving(prev => ({ ...prev, [roleName]: true }));
      const token = localStorage.getItem("token");
      
      const permissionsToSave = permissionsState[roleName] || {};
      console.log("Saving permissions for", roleName, ":", permissionsToSave);
      
      const response = await fetch(`${API_BASE}/admin/roles/${roleName}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          permissions: permissionsToSave
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to save permissions"}`);
        return;
      }
      
      alert("✅ Permissions saved successfully!");
      setDebug(`Permissions saved for ${roleName}`);
      
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Failed to save permissions. Please try again.");
    } finally {
      setSaving(prev => ({ ...prev, [roleName]: false }));
    }
  };

  // Add new role
  const addNewRole = async () => {
    if (!newRole.name.trim()) {
      alert("Please enter a role name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Initialize default permissions (all false)
      const defaultPermissions = {};
      allPermissions.forEach(perm => {
        defaultPermissions[perm] = false;
      });

      const response = await fetch(`${API_BASE}/admin/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newRole.name,
          permissions: defaultPermissions
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to add role"}`);
        return;
      }

      setShowAddRole(false);
      setNewRole({ name: "", description: "" });
      fetchRoles();
      alert("✅ Role added successfully!");
      
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Failed to add role. Please try again.");
    }
  };

  // Delete role
  const deleteRole = async (roleName) => {
    if (!window.confirm(`Are you sure you want to delete "${roleName}" role?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/roles/${roleName}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to delete role"}`);
        return;
      }

      fetchRoles();
      alert("✅ Role deleted successfully!");
      
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role. Please try again.");
    }
  };

  // CheckCircle component with proper styling
  const CheckCircle = ({ checked }) => {
    return (
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checked ? 'bg-green-500' : 'bg-white border border-gray-300'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-8 w-8 text-gray-500 mb-2" />
          <div className="text-gray-600">Loading roles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <header className="flex h-14 items-center justify-between bg-white px-4 shadow-sm sticky top-0 z-50 mb-4 rounded-md">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">User Roles & Access Control</h1>
        </div>
        
        <button 
          onClick={() => setShowAddRole(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white">
          <Plus size={16} /> Add Role
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Role-Based Access Control</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <ShieldCheck size={16} /> Define which pages each user role can access. Changes will apply to all users assigned to that role.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                  <p className="text-red-600 text-sm mt-1">Only admin users can access role management.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section content */}
          <div className="mt-6 space-y-4">
            {roles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No roles found. Add your first role to get started.
              </div>
            ) : (
              <>
                
                {roles.map((role) => {
                  const open = expandedRoles[role.name];
                  const rolePerms = permissionsState[role.name] || {};
                  
                  return (
                    <div key={role.name} className="mt-1 pb-1 border-b last:border-b-0">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setExpandedRoles(prev => ({
                            ...prev,
                            [role.name]: !prev[role.name]
                          }))}
                          className="flex-1 flex justify-between text-left text-lg items-center py-2 hover:bg-gray-50 px-2 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{role.name}</span>
                          </div>
                          <span>{open ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => saveRolePermissions(role.name)}
                            disabled={saving[role.name]}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1"
                          >
                            <Save size={14} /> {saving[role.name] ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => deleteRole(role.name)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>

                      {open && (
                        <div className="mt-3 bg-gray-50 p-4 rounded-xl">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Permissions for {role.name}:</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allPermissions.map((permission) => {
                              const checked = rolePerms[permission] || false;
                              return (
                                <div
                                  key={permission}
                                  className={`flex items-center gap-3 text-sm p-3 rounded-lg cursor-pointer transition-all ${
                                    checked 
                                      ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                                      : 'bg-white border border-gray-200 hover:bg-gray-100'
                                  }`}
                                  onClick={() => {
                                    console.log(`Clicking ${permission} for ${role.name}`);
                                    togglePermission(role.name, permission);
                                  }}
                                >
                                  <CheckCircle checked={checked} />
                                  <span className={`font-medium ${checked ? 'text-green-800' : 'text-gray-700'}`}>
                                    {permission}
                                  </span>
                                  <span className="ml-auto text-xs text-gray-500">
                                    {checked ? "Enabled" : "Disabled"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Current state display */}
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Current state:</span>{" "}
                              {Object.keys(rolePerms).filter(k => rolePerms[k]).length} permissions enabled,{" "}
                              {Object.keys(rolePerms).filter(k => !rolePerms[k]).length} permissions disabled
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Role</h3>
              <button
                onClick={() => setShowAddRole(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Marketing Manager"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddRole(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewRole}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Plus size={16} /> Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}