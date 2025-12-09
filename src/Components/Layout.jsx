import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  PanelRight
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
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
  }, [active]);

  const menu = [
    {
      label: "CEO",
      items: [{ icon: SquarePen, name: "New Land", path: "/land" }],
    },
    {
      label: "HR",
      items: [
        { icon: FingerprintPattern, name: "Access Controls", path: "/roles" },
        { icon: Users, name: "Employees", path: "/employess" },
      ],
    },
    {
      label: "Operations",
      items: [
        { icon: FilePlus, name: "Lands Data and Verification", path: "/land-verification" },
        { icon: SquarePen, name: "Data Entry", path: "/data-entry" },
        { icon: Phone, name: "Buyers", path: "/buyers" },
        { icon: Users, name: "Agents", path: "/agent" },
        { icon: Map, name: "Garuda Map" },
        { icon: List, name: "Land Codes", path: "/land-code" },
        { icon: MapPin, name: "Locations", path: "/location" },
        { icon: List, name: "Travel Wallet", path: "/travel/wallet" },
      ],
    },
    {
      label: "Marketing",
      items: [{ icon: Award, name: "Garuda Points" }],
    },
    {
      label: "Public Website",
      items: [
        { icon: Globe, name: "Home" },
        { icon: Globe, name: "Lands", path: "/land-list" },
        { icon: Landmark, name: "Investors" },
        { icon: User, name: "My Profile", path: "/my-profile" },
      ],
    },
    {
      label: "Future",
      items: [
        { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" },
        { icon: Landmark, name: "Investors" },
        { icon: Wallet, name: "Budget" },
        { icon: Wallet, name: "CRM" },
        { icon: Box, name: "Stock" },
        { icon: Building, name: "Company Profile" },
        { icon: CalendarDays, name: "Schedule" },
        { icon: FilePenLine, name: "Legal & Docs" },
      ],
    },
  ];

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
            <div className="w-10 h-10 rounded-full bg-gray-600" />
            <div>
              <p className="font-semibold">Director / Founder</p>
            </div>
          </div>
        </div>

        {/* MENU SECTION */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {menu.map((section) => (
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
                    className={`w-full flex items-center space-x-3 py-2 pr-2 pl-0 rounded-lg transition-all
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
          <div className="w-10 h-10 rounded-full bg-gray-600" />
          <div>
            <p className="font-semibold">Director</p>
            <p className="text-sm opacity-70">director@garuda.com</p>
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