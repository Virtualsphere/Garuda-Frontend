import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PanelRight, Menu } from "lucide-react";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function GarudaMap() {
  const [lands, setLands] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getToken = () => {
  return localStorage.getItem("token");
};

// Common headers for all requests
const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

  useEffect(() => {
    fetch("http://72.61.169.226/admin/land", {
        headers: getHeaders()
    })
      .then((res) => res.json())
      .then((json) => setLands(json.data || []));
  }, []);

  const parseLatLng = (lat, lng) => {
    if (!lat || !lng) return null;

    const latVal = parseFloat(String(lat).split(",")[0].replace(/[^0-9.-]/g, ""));
    const lngVal = parseFloat(String(lng).split(",")[1] || String(lng).split(",")[0]);

    if (isNaN(latVal) || isNaN(lngVal)) return null;
    return [latVal, lngVal];
  };

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
              <h1 className="text-lg font-semibold">Land Location</h1>
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
          <h1 className="text-xl font-semibold">Land Location</h1>
        </div>
      </header>

      <div className="p-4 space-y-6 pt-16 lg:pt-6">
        <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-[600px] w-full rounded-xl shadow"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lands.map((land) => {
          const coords = parseLatLng(
            land.gps_tracking?.latitude,
            land.gps_tracking?.longitude
          );

          if (!coords) return null;

          return (
            <Marker key={land.land_id} position={coords}>
              <Popup>
                <div className="text-sm">
                  <strong>{land.land_id}</strong>
                  <br />
                  {land.land_location?.district},{" "}
                  {land.land_location?.state}
                  <br />
                  Area: {land.land_details?.land_area}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      </div>
    </div>
  );
}
