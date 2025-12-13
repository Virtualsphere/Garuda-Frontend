import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FilePenLine,
  CalendarDays,
  Building,
  Box,
  Wallet,
  LayoutDashboard,
  User,
  Landmark,
  Globe,
  Award,
  MapPin,
  List,
  Map,
  Phone,
  FilePlus,
  FingerprintPattern,
  Home,
  Users,
  Shield,
  Database,
  ShoppingCart,
  SquarePen,
  Menu,
  X,
  PanelRight,
  AlertCircle
} from "lucide-react";

const API_BASE = "http://72.61.169.226";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [userImage, setUserImage] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Map menu items to permission keys
  const menu = [
    {
      label: "CEO",
      items: [
        { icon: SquarePen, name: "New Land", path: "/land", key: "New Land" },
      ],
    },
    {
      label: "HR",
      items: [
        { icon: FingerprintPattern, name: "Access Controls", path: "/roles", key: "Access Controls" },
        { icon: Users, name: "Employees", path: "/employess", key: "Employees" },
      ],
    },
    {
      label: "Operations",
      items: [
        { icon: FilePlus, name: "Lands Data and Verification", path: "/land-verification", key: "Lands Data and Verification" },
        { icon: SquarePen, name: "Data Entry", path: "/data-entry", key: "Data Entry" },
        { icon: Phone, name: "Buyers", path: "/buyers", key: "Buyers" },
        { icon: Users, name: "Agents", path: "/agent", key: "Agents" },
        { icon: Map, name: "Garuda Map", path: "/map", key: "Garuda Map" },
        { icon: List, name: "Land Codes", path: "/land-code", key: "Land Codes" },
        { icon: MapPin, name: "Locations", path: "/location", key: "Locations" },
        { icon: List, name: "Travel Wallet", path: "/travel/wallet", key: "Travel Wallet" },
        { icon: List, name: "Land Wallet", path: "/land/wallet", key: "Land Wallet" },
        { icon: List, name: "Physical Verification Wallet", path: "/physical/verification/wallet", key: "Physical Verification Wallet" },
      ],
    },
    {
      label: "Marketing",
      items: [
        { icon: Award, name: "Garuda Points", path: "/garuda-points", key: "Garuda Points" },
      ],
    },
    {
      label: "Public Website",
      items: [
        { icon: Globe, name: "Home", path: "/", key: "Home" },
        { icon: Globe, name: "Lands", path: "/land-list", key: "Lands" },
        { icon: Landmark, name: "Investors", path: "/investors", key: "Investors" },
        { icon: User, name: "My Profile", path: "/my-profile", key: "My Profile" },
      ],
    },
    {
      label: "Future",
      items: [
        { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard", key: "Dashboard" },
        { icon: Landmark, name: "Investors", key: "Investors" },
        { icon: Wallet, name: "Budget", path: "/budget", key: "Budget" },
        { icon: Wallet, name: "CRM", key: "CRM" },
        { icon: Box, name: "Stock", path: "/admin/stock", key: "Stock" },
        { icon: Building, name: "Company Profile", path: "/company-profile", key: "Company Profile" },
        { icon: CalendarDays, name: "Schedule", path: "/schedule", key: "Schedule" },
        { icon: FilePenLine, name: "Legal & Docs", path: "/legal-docs", key: "Legal & Docs" },
      ],
    },
  ];

  // Fetch user profile data including email and image
  const fetchUserProfile = async (token) => {
    try {
      setProfileLoading(true);
      const response = await fetch(`${API_BASE}/admin/personal/detail`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Set user data from profile API
        setUserName(data.user?.name || "");
        setUserEmail(data.user?.email || "");
        setUserRole(data.user?.role || "");
        
        // Set user image if available (prioritize image, then photo)
        const userImage = data.user?.image;
        if (userImage) {
          setUserImage(userImage);
        }
        
        console.log("User profile loaded:", {
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role,
          hasImage: !!userImage
        });
      } else {
        console.error("Failed to load user profile:", data.error);
        // Fallback to JWT token data
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const userData = JSON.parse(jsonPayload);
        
        setUserRole(userData.role || "");
        setUserEmail(userData.email || "");
        setUserName(userData.name || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to JWT token
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const userData = JSON.parse(jsonPayload);
        
        setUserRole(userData.role || "");
        setUserEmail(userData.email || "");
        setUserName(userData.name || "");
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user role and permissions
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile data (name, email, image, role)
        await fetchUserProfile(token);

        // Fetch user permissions in parallel
        const [roleResponse, permResponse] = await Promise.all([
          fetch(`${API_BASE}/roles/my-role`, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/roles/my-permissions`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        const roleData = await roleResponse.json();
        const permData = await permResponse.json();
        
        // Update role from permissions API (might be more accurate)
        if (roleData.success && roleData.role) {
          setUserRole(roleData.role);
        }
        
        if (permData.success) {
          setUserPermissions(permData.permissions || {});
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Set default permissions for safety
        setUserPermissions({
          "Dashboard": true,
          "My Profile": true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Filter menu based on user permissions
  const getFilteredMenu = () => {
    if (loading || Object.keys(userPermissions).length === 0) {
      return [];
    }
    
    return menu.map(section => {
      const filteredItems = section.items.filter(item => {
        // Items without key are always shown
        if (!item.key) return true;
        
        // Check if user has permission for this item
        return userPermissions[item.key] === true;
      });
      
      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  };

  const filteredMenu = getFilteredMenu();

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <div className="text-gray-600">Loading permissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      {/* HAMBURGER BUTTON - Mobile Only */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <PanelRight size={24} />}
      </button>

      {/* OVERLAY - Mobile Only */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div className={`
        sidebar
        fixed lg:static
        w-72 h-full bg-black text-white flex flex-col p-4 space-y-6
        transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* CLOSE BUTTON - Mobile Only */}
        <div className="flex lg:hidden justify-end">
          <button
            className="p-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* TOP SECTION */}
        <div>
          <div
            className="text-2xl font-bold flex items-center space-x-2 mb-4 cursor-pointer"
            onClick={() => {
              navigate("/dashboard");
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
          >
            <span>🦅</span>
            <span>Garuda Admin</span>
          </div>

          <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-xl">
            {/* User Image Circle */}
            <div className="relative">
              {profileLoading ? (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : userImage ? (
                <img 
                  src={userImage || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="} 
                  alt={userName || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <span class="text-white font-semibold">${userName?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <p className="font-semibold">{userRole || "User"}</p>
              <p className="text-xs opacity-70">
                {userName ? `${userEmail}` : userEmail || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* MENU SECTION */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {filteredMenu.map((section) => (
            <div key={section.label}>
              <p className="text-orange-400 font-bold uppercase text-lg mb-2">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActive(item.name);
                      if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 py-2 pr-2 pl-0 rounded-lg transition-all text-left
                      ${active === item.name ? "bg-gray-700" : "hover:bg-gray-800"}`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM PROFILE */}
        <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-xl">
          {/* User Image Circle */}
          <div className="relative">
            {profileLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : userImage ? (
              <img 
                src={userImage || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0VFRUVFRSIvPjwvc3ZnPg=="} 
                alt={userName || "User"}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <span class="text-white font-semibold">${userName?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <p className="font-semibold">{userRole || "User"}</p>
            <p className="text-sm opacity-70">{userEmail || "Loading..."}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — PAGE CONTENT */}
      <div className="flex-1 bg-gray-100 overflow-y-auto p-4 lg:p-0">
        {/* MOBILE HEADER SPACER */}
        <div className="h-12 lg:h-0" />
        <Outlet />
      </div>
    </div>
  );
}