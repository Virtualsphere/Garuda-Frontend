import React, { useState } from "react";
import {
  Plus,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PanelRight,
} from "lucide-react";

/**
 * Data model:
 * sections: [
 *   { key: "userRoles", title: "User Roles & Access Control", showHeader: true, roles: [...roleNames], perms: [...] },
 *   { key: "deptConnections", title: "Department Connections", showHeader: false, roles: [...], perms: [...] },
 *   ...
 * ]
 *
 * permissionsState = {
 *   [sectionKey]: {
 *     [roleName]: { [permName]: boolean, ... },
 *     ...
 *   },
 *   ...
 * }
 */

export default function AccessControls() {
  // Shared permission items used in the "User Roles" style sections
  const commonPermissions = [
    "Dashboard",
    "Data Entry",
    "Buyers",
    "Budget",
    "Lands (Public)",
    "Stock",
    "Land Codes",
    "Profile Management",
    "Users, Roles & Access Controls",
    "New Land",
    "Agents",
    "Map",
    "Investors (Public)",
    "Company Profile",
    "Legal & Docs",
    "Garuda Points",
    "Field Data and Verification",
    "Employees",
    "Investors",
    "Home (Public)",
    "My Profile",
    "Schedule",
    "Locations",
  ];

  // Roles for user roles section (structure groups visually via subtitles in UI)
  const allRolesList = [
    "Director / Founder",
    "Operations Head",
    "Management Team",
    "HR & Training Executive",
    "Accounts Officer",
    "IT / App Support",
    "Legal Advisor",
    "Telecaller",
    "Marketing Executive",
    "Job Poster",
    "Town Incharge",
    "Field Executive",
    "Mediator",
    "People",
  ];

  const departmentRoles = [
    "Operation Head",
    "Investor Relations Manager",
    "HR & Training Executive",
    "Accounts Officer",
    "IT / App Support",
    "Legal Advisor",
    "Telecaller",
    "Town Incharge",
    "Field Exeuctive",
    "Mediator",
    "Marketing Executive",
    "Job Poster",
    "People",
  ];

  // Map Access Control permissions (different set)
  const mapPermissions = [
    "Paths",
    "Entry Points",
    "Perimeter Points",
    "Executive Current Location",
  ];

  // Job Post Access Control permissions
  const jobPostPermissions = [
    "View Job Posts",
    "Create Job Posts",
    "Edit Job Posts",
    "Delete Job Posts",
  ];

  // Field Verification Access Control permissions
  const fieldVerificationPermissions = [
    "View Verification Details",
    "Edit Verification Details",
    "Approve Verification",
    "Reject Verification",
  ];

  // Marketing Access Control permissions
  const marketingPermissions = [
    "View Marketing Campaigns",
    "Create Marketing Campaigns",
    "Manage Ad Spend",
    "Analyze Campaign Performance",
  ];

  // Sections definition (data-driven)
  const sections = [
    {
      key: "userRoles",
      title: "User Roles & Access Control",
      showHeader: true, // show the main page header for this section
      roles: allRolesList,
      perms: commonPermissions,
    },
    {
      key: "departmentConnections",
      title: "Department Connections",
      description: "Define which departments are connected to each other. This can be used to model communication flows.",
      showHeader: false,
      roles: allRolesList,
      perms: departmentRoles, // here each role is also an option for connection; adjust if you want different perms
    },
    {
      key: "mapAccess",
      title: "Map Access Control",
      description: "Define which map features each user role can access on the Roadmap page.",
      showHeader: false,
      roles: allRolesList,
      perms: mapPermissions,
    },
    {
      key: "jobPostAccess",
      title: "Job Post Access Control",
      description: "Define role permissions for managing job postings.",
      showHeader: false,
      roles: allRolesList,
      perms: jobPostPermissions,
    },
    {
      key: "fieldVerification",
      title: "Field Verification Access Control",
      description: "Set role permissions for the land verification process.",
      showHeader: false,
      roles: allRolesList,
      perms: fieldVerificationPermissions,
    },
    {
      key: "marketingAccess",
      title: "Marketing Access Control",
      description: "Control access to marketing campaign features.",
      showHeader: false,
      roles: allRolesList,
      perms: marketingPermissions,
    },
  ];

  // Helper to create initial permission map for a list of perms (default: true or false as you prefer)
  const createPermsMap = (permList, defaultValue = true) =>
    permList.reduce((acc, p) => ({ ...acc, [p]: defaultValue }), {});

  // Initialize permissionsState: per-section -> per-role -> per-permission boolean
  const initialPermissionsState = {};
  sections.forEach((sec) => {
    initialPermissionsState[sec.key] = {};
    // If section has roles that are actually permission items (e.g., mapAccess roles), handle accordingly.
    sec.roles.forEach((roleName) => {
      // For userRoles and job/field/marketing we use sec.perms as permission list for each role
      // For mapAccess where we treated roles as the items, we'll give each role the same-perm map (empty or itself)
      const permsForRole =
        sec.perms && sec.perms.length > 0
          ? createPermsMap(sec.perms, true)
          : createPermsMap(sec.roles, true); // fallback
      initialPermissionsState[sec.key][roleName] = permsForRole;
    });
  });

  const [permissionsState, setPermissionsState] = useState(initialPermissionsState);

  // Track which role is open (expanded) inside each section: { [sectionKey]: openRoleName|null }
  const initialOpen = {};
  sections.forEach((sec) => {
    // open first role by default for the users section to match your original
    initialOpen[sec.key] = sec.key === "userRoles" ? sec.roles[0] ?? null : null;
  });
  const [openRoleBySection, setOpenRoleBySection] = useState(initialOpen);

  // Toggle open role for a particular section
  const toggleOpen = (sectionKey, roleName) => {
    setOpenRoleBySection((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey] === roleName ? null : roleName,
    }));
  };

  // Toggle a specific permission for a single role inside a single section
  const togglePermission = (sectionKey, roleName, permName) => {
    setPermissionsState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [roleName]: {
          ...prev[sectionKey][roleName],
          [permName]: !prev[sectionKey][roleName][permName],
        },
      },
    }));
  };

  // Small presentational helper for checkbox circle
  const CheckCircle = ({ checked }) =>
    checked ? (
      <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-green-500 text-white text-xs">
        ✓
      </span>
    ) : (
      <span className="w-5 h-5 inline-block border border-gray-300 rounded-full" />
    );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header area for the full page */}
      <header className="flex h-14 items-center justify-between bg-white px-4 shadow-sm sticky top-0 z-50 mb-4 rounded-md">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                      <PanelRight className="h-5 w-5 text-white" />
                    </div>
          <h1 className="text-xl font-semibold">User Roles & Access Control</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {sections.map((sec) => (
          <div key={sec.key} className="bg-white rounded-2xl p-6 shadow">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                {sec.showHeader ? (
                  <>
                    <h2 className="text-xl font-semibold">Role-Based Access Control</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <ShieldCheck size={16} /> Define which pages each user role can access. Changes will apply to all users assigned to that role.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{sec.title}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <ShieldCheck size={16} />{sec.description}
                    </p>
                  </>
                )}
              </div>

              {/* Only show Add Role on the first (userRoles) block to match original */}
              {sec.key === "userRoles" && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-green-500 hover:bg-green-600 text-white">
                  <Plus size={16} /> Add Role
                </button>
              )}
            </div>

            {/* Section content: list of roles (expandable) */}
            <div className="mt-6 space-y-4">
              {/* You can add headings inside the list if desired. Here we show simple role rows. */}
              {sec.roles.map((roleName) => {
                const open = openRoleBySection[sec.key] === roleName;
                // Determine permission list for this role
                const perms =
                  sec.perms && sec.perms.length > 0 ? sec.perms : sec.roles; // fallback
                const rolePerms = permissionsState[sec.key]?.[roleName] ?? {};
                return (
                  <div key={roleName} className="mt-1 pb-1">
                    <button
                      onClick={() => toggleOpen(sec.key, roleName)}
                      className="flex justify-between w-full text-left text-lg items-center py-2"
                    >
                      <span className="font-medium">{roleName}</span>
                      <span>{open ? <ChevronUp /> : <ChevronDown />}</span>
                    </button>

                    {open && (
                      <div className="mt-3 bg-gray-50 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {perms.map((perm) => {
                          // If rolePerms doesn't include perm (rare), default false
                          const checked = !!rolePerms[perm];
                          return (
                            <div
                              key={perm}
                              className="flex items-center gap-3 text-sm cursor-pointer"
                              onClick={() => togglePermission(sec.key, roleName, perm)}
                            >
                              <CheckCircle checked={checked} />
                              <span>{perm}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
