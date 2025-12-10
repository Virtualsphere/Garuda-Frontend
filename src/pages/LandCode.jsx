// LandCodeAllotment.jsx - SIMPLIFIED VERSION
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  ChevronDown,
  Users,
  MapPin,
  Phone,
  User,
  PanelRight
} from "lucide-react";

export const LandCode = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  
  // REMOVED: villages state - we don't need it anymore

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTown, setSelectedTown] = useState("");

  const [landCodes, setLandCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const [editingCode, setEditingCode] = useState(null);
  const [editForm, setEditForm] = useState({
    farmer_name: "",
    farmer_phone: "",
    village_name: "",
    status: "Available",
  });

  const generatePrefix = (stateName, districtName, townName) => {
    if (!stateName || !districtName || !townName) return "";

    const clean = (text) =>
      text
        .replace(/[^A-Za-z]/g, "")
        .substring(0, 3)
        .toUpperCase();

    return `${clean(stateName)}${clean(districtName)}${clean(townName)}`;
  };

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    prefix: "",
    count: 10,
  });

  const API_URL = "http://72.61.169.226/admin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTowns(selectedDistrict);
    } else {
      setTowns([]);
      setSelectedTown("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedTown) {
      fetchLandCodes();
      fetchStats();
    } else {
      setLandCodes([]);
      setStats(null);
    }
  }, [selectedState, selectedDistrict, selectedTown]);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_URL}/states`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const response = await axios.get(
        `${API_URL}/states/${stateId}/districts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchTowns = async (districtId) => {
    try {
      const response = await axios.get(
        `${API_URL}/districts/${districtId}/towns`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTowns(response.data);
    } catch (error) {
      console.error("Error fetching towns:", error);
    }
  };

  const fetchLandCodes = async () => {
    if (!selectedState || !selectedDistrict || !selectedTown) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/land-codes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          state_id: selectedState,
          district_id: selectedDistrict,
          town_id: selectedTown,
        },
      });
      console.log("Fetched land codes:", response.data); // Debug log
      setLandCodes(response.data.data);
    } catch (error) {
      console.error("Error fetching land codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!selectedState || !selectedDistrict || !selectedTown) return;

    try {
      const response = await axios.get(`${API_URL}/land-codes/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          state_id: selectedState,
          district_id: selectedDistrict,
          town_id: selectedTown,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEditClick = (code) => {
    setEditingCode(code.id);
    setEditForm({
      farmer_name: code.farmer_name || "",
      farmer_phone: code.farmer_phone || "",
      village_name: code.village_name || "", // Just village name
      status: code.status || "Available",
    });
  };

  const handleSaveEdit = async (codeId) => {
    try {
      const response = await axios.put(
        `${API_URL}/land-codes/${codeId}`,
        {
          farmer_name: editForm.farmer_name,
          farmer_phone: editForm.farmer_phone,
          village_name: editForm.village_name, // Just village name
          status: editForm.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data); // Debug log
      setEditingCode(null);
      fetchLandCodes();
      fetchStats();
      alert("Land code updated successfully");
    } catch (error) {
      console.error("Error updating land code:", error);
      alert("Failed to update land code");
    }
  };

  const handleCancelEdit = () => {
    setEditingCode(null);
    setEditForm({
      farmer_name: "",
      farmer_phone: "",
      village_name: "",
      status: "Available",
    });
  };

  const handleGenerateCodes = async () => {
    if (!generateForm.prefix || !generateForm.count) {
      alert("Please enter prefix and count");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/land-codes/generate`,
        {
          state_id: selectedState,
          district_id: selectedDistrict,
          town_id: selectedTown,
          prefix: generateForm.prefix,
          count: parseInt(generateForm.count),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowGenerateModal(false);
      setGenerateForm({ prefix: "", count: 10 });
      fetchLandCodes();
      fetchStats();
      alert("Land codes generated successfully");
    } catch (error) {
      console.error("Error generating codes:", error);
      alert(error.response?.data?.error || "Failed to generate land codes");
    }
  };

  const handleExportCSV = () => {
    if (landCodes.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Land Code",
      "Farmer Name",
      "Phone",
      "Village",
      "Status"
    ];
    const csvData = landCodes.map((code) => [
      code.land_code,
      code.farmer_name || "",
      code.farmer_phone || "",
      code.village_name || "",
      code.status
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `land-codes-${selectedTown}-${Date.now()}.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Reserved":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                                  <PanelRight className="h-5 w-5 text-white" />
                                </div>
                <h1 className="text-xl font-semibold">Land Code</h1>
              </div>
            </header>
      <div className="p-6">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Land Code Allotment
        </h1>
        <p className="text-gray-600 mt-2">
          Assign farmer details to pre-generated, town-specific land codes
        </p>
      </div>

      {/* Location Selection Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Select Location
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Town
            </label>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select a town</option>
              {towns.map((town) => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800">
                Total Codes
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {stats.total}
              </div>
            </div>
            {stats.stats.map((stat) => (
              <div
                key={stat.status}
                className="bg-gray-50 border border-gray-100 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-800">
                  {stat.status}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.count}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stat.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="text-gray-600">
          {selectedTown ? (
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <span>Showing land codes for selected town</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>
                Please select a state, district, and town to view codes
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              const state = states.find((s) => s.id == selectedState)?.name;
              const district = districts.find(
                (d) => d.id == selectedDistrict
              )?.name;
              const town = towns.find((t) => t.id == selectedTown)?.name;

              const autoPrefix = generatePrefix(state, district, town);

              setGenerateForm((prev) => ({
                ...prev,
                prefix: autoPrefix,
              }));

              setShowGenerateModal(true);
            }}
            disabled={!selectedTown}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Codes
          </button>
        </div>
      </div>

      {/* Land Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : landCodes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedTown ? "No land codes found" : "Select a location"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedTown
                ? 'No land codes have been generated for this town yet. Click "Generate Codes" to create new ones.'
                : "Please select a state, district, and town to view land codes."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Land Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Village
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {landCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {code.land_code}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {editingCode === code.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.farmer_name}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                farmer_name: e.target.value,
                              }))
                            }
                            placeholder="Farmer Name"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="tel"
                            value={editForm.farmer_phone}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                farmer_phone: e.target.value,
                              }))
                            }
                            placeholder="Phone Number"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {code.farmer_name || "Not Assigned"}
                          </div>
                          {code.farmer_phone && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {code.farmer_phone}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCode === code.id ? (
                        // SIMPLE TEXT INPUT - User can type ANY village name
                        <input
                          type="text"
                          value={editForm.village_name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              village_name: e.target.value,
                            }))
                          }
                          placeholder="Enter any village name"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {code.village_name || "N/A"}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCode === code.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            code.status
                          )}`}
                        >
                          {code.status === "Available" && (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {code.status === "Assigned" && (
                            <User className="w-3 h-3 inline mr-1" />
                          )}
                          {code.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingCode === code.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(code.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(code)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Codes Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Generate Land Codes
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefix (e.g., TEADAD for Telangana Adilabad Adilabad)
                </label>
                <input
                  type="text"
                  value={generateForm.prefix}
                  onChange={(e) =>
                    setGenerateForm((prev) => ({
                      ...prev,
                      prefix: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter prefix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Codes to Generate
                </label>
                <input
                  type="number"
                  value={generateForm.count}
                  onChange={(e) =>
                    setGenerateForm((prev) => ({
                      ...prev,
                      count: e.target.value,
                    }))
                  }
                  min="1"
                  max="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-4">
                  Codes will be generated as: {generateForm.prefix}01,{" "}
                  {generateForm.prefix}02, etc.
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateCodes}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Generate Codes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};