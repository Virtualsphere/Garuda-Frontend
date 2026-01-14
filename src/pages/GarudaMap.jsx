import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";
import { PanelRight, Menu } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function GarudaMap() {
  const [lands, setLands] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const getHeaders = () => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetch("http://72.61.169.226/admin/land", {
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then((json) => setLands(json.data || []));
  }, []);

  const decodePolyline = (encoded) => {
    if (!encoded) return null;
    try {
      return polyline.decode(encoded).map(([lat, lng]) => ({ lat, lng }));
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADERS SAME AS BEFORE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Land Location</h1>
        </div>
      </div>

      <header className="hidden lg:flex h-14 items-center bg-white px-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Land Location</h1>
        </div>
      </header>

      <div className="p-4 pt-16 lg:pt-6">
        <LoadScript googleMapsApiKey="AIzaSyAD_1yL7L3YcqdNthx7m1P6D2qv9Lbn_cY">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
          >
            {lands.map((land) => {
              const lat = parseFloat(land.gps_tracking?.latitude);
              const lng = parseFloat(land.gps_tracking?.longitude);
              const path = decodePolyline(land.gps_tracking?.road_path);

              return (
                <div key={land.land_id}>
                  {!isNaN(lat) && !isNaN(lng) && (
                    <Marker
                      position={{ lat, lng }}
                      title={land.land_id}
                    />
                  )}

                  {path && (
                    <Polyline
                      path={path}
                      options={{
                        strokeWeight: 4,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
