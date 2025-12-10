import React, { useState, useEffect } from "react";
import {
  PanelRight,
  MapPin,
  Filter,
  Search,
  X,
  Globe,
  Landmark,
  Building,
  Target,
  Home,
  Navigation,
  Users,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { locationApi } from "../api/LocationApi";

export const Location = () => {
  const tabs = [
    { name: "States", icon: <Globe className="h-4 w-4" /> },
    { name: "Districts", icon: <Landmark className="h-4 w-4" /> },
    { name: "Sectors", icon: <Target className="h-4 w-4" /> },
    { name: "Towns", icon: <Building className="h-4 w-4" /> },
    { name: "Mandals", icon: <Navigation className="h-4 w-4" /> },
    { name: "Villages (Mandal)", icon: <Home className="h-4 w-4" /> },
    { name: "Villages (Sector)", icon: <Users className="h-4 w-4" /> },
  ];

  const [activeTab, setActiveTab] = useState("States");
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // cards or table

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      {/* HEADER */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Location Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage geographical hierarchy and regions
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New</span>
        </button>
      </header>

      <div className="p-6">
        {/* MAIN CONTENT CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* HEADER SECTION */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Geographical Hierarchy
                </h2>
                <p className="text-gray-600">
                  Manage states, districts, sectors, towns, mandals, and
                  villages
                </p>
              </div>

              {/* VIEW TOGGLE */}
              <div className="flex items-center gap-2 mt-4 lg:mt-0 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === "cards"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                      <div
                        className={`rounded-sm ${
                          viewMode === "cards" ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`rounded-sm ${
                          viewMode === "cards" ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`rounded-sm ${
                          viewMode === "cards" ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`rounded-sm ${
                          viewMode === "cards" ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="w-4 h-4">
                    <div
                      className={`h-0.5 ${
                        viewMode === "table" ? "bg-green-600" : "bg-gray-400"
                      } mb-1`}
                    ></div>
                    <div
                      className={`h-0.5 ${
                        viewMode === "table" ? "bg-green-600" : "bg-gray-400"
                      } mb-1`}
                    ></div>
                    <div
                      className={`h-0.5 ${
                        viewMode === "table" ? "bg-green-600" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <span>Table</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.name
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-8">
            {activeTab === "States" && (
              <StatesPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Districts" && (
              <DistrictsPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Sectors" && (
              <SectorsPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Towns" && (
              <TownsPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Mandals" && (
              <MandalsPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Villages (Mandal)" && (
              <VillagesByMandalPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
            {activeTab === "Villages (Sector)" && (
              <VillagesBySectorPage
                viewMode={viewMode}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Page Components -------------------- */

function PageHeader({
  title,
  count,
  onAddClick,
  onSearch,
  searchValue,
  onSearchChange,
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-1">
            Manage and organize {title.toLowerCase()} in the system
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={onSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-full lg:w-64 transition-all"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={onAddClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
          {count} {title.toLowerCase()} found
        </div>
      </div>
    </div>
  );
}

const fetchMandals = async (districtId) => {
  setLoading(true);
  try {
    const data = await locationApi.getMandalsByDistrict(districtId);
    // Parse mandal names if they're stored as JSON strings
    const parsedData = data.map(mandal => ({
      ...mandal,
      name: parseJsonName(mandal.name)
    }));
    setMandals(parsedData);
  } catch (error) {
    toast.error("Failed to load mandals");
  } finally {
    setLoading(false);
  }
};

// Helper function to parse JSON string names
const parseJsonName = (name) => {
  try {
    if (typeof name === 'string' && name.startsWith('{')) {
      const parsed = JSON.parse(name);
      return parsed.name || name;
    }
    return name;
  } catch (e) {
    return name;
  }
};

function StatesPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newStates, setNewStates] = useState([{ code: "", name: "" }]);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const data = await locationApi.getStates();
      setStates(data);
    } catch (error) {
      toast.error("Failed to load states");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStateField = () => {
    setNewStates([...newStates, { code: "", name: "" }]);
  };

  const handleRemoveStateField = (index) => {
    if (newStates.length > 1) {
      const updated = newStates.filter((_, i) => i !== index);
      setNewStates(updated);
    }
  };

  const handleStateChange = (index, field, value) => {
    const updated = [...newStates];
    updated[index][field] = value;
    setNewStates(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validStates = newStates.filter((s) => s.code.trim() && s.name.trim());
    if (validStates.length === 0) {
      toast.error("Please enter at least one valid state");
      return;
    }

    try {
      if (validStates.length === 1) {
        await locationApi.addState(validStates[0]);
      } else {
        await locationApi.addMultipleStates(validStates);
      }

      toast.success("State(s) added successfully");
      setNewStates([{ code: "", name: "" }]);
      setIsAdding(false);
      fetchStates();
    } catch (error) {
      toast.error(error.message || "Failed to add state(s)");
    }
  };

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="States"
        count={filteredStates.length}
        onAddClick={() => setIsAdding(!isAdding)}
        onSearch={fetchStates}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {isAdding && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add New State(s)
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newStates.map((state, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={state.code}
                        onChange={(e) =>
                          handleStateChange(
                            index,
                            "code",
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="State Code"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        maxLength="2"
                        required
                      />
                      <span className="absolute right-3 top-3 text-sm text-gray-500 font-medium">
                        {state.code.length}/2
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) =>
                        handleStateChange(index, "name", e.target.value)
                      }
                      placeholder="State Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newStates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStateField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddStateField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewStates([{ code: "", name: "" }]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save State(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading states data...</p>
        </div>
      ) : filteredStates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No states found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : "Add your first state to get started"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First State
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStates.map((state) => (
            <CardItem key={state.id} item={state} type="state" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  State Code
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  State Name
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStates.map((state) => (
                <tr
                  key={state.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                      <span className="font-bold text-emerald-700">
                        {state.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <h4 className="font-semibold text-gray-800">
                      {state.name}
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DistrictsPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDistricts, setNewDistricts] = useState([""]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    setLoading(true);
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
    } catch (error) {
      toast.error("Failed to load districts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDistrictField = () => {
    setNewDistricts([...newDistricts, ""]);
  };

  const handleRemoveDistrictField = (index) => {
    if (newDistricts.length > 1) {
      const updated = newDistricts.filter((_, i) => i !== index);
      setNewDistricts(updated);
    }
  };

  const handleDistrictChange = (index, value) => {
    const updated = [...newDistricts];
    updated[index] = value;
    setNewDistricts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedState) {
      toast.error("Please select a state first");
      return;
    }

    const validDistricts = newDistricts.filter((d) => d.trim());
    if (validDistricts.length === 0) {
      toast.error("Please enter at least one district name");
      return;
    }

    const districtsArray = validDistricts.map((name) => ({
      code: name.substring(0, 2).toUpperCase(),
      name,
    }));

    try {
      await locationApi.addMultipleDistricts(selectedState, districtsArray);
      toast.success("District(s) added successfully");
      setNewDistricts([""]);
      setIsAdding(false);
      fetchDistricts(selectedState);
    } catch (error) {
      toast.error(error.message || "Failed to add district(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Districts"
        count={filteredDistricts.length}
        onAddClick={() => selectedState && setIsAdding(!isAdding)}
        onSearch={() => fetchDistricts(selectedState)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* STATE SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select State</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={`p-4 rounded-xl border transition-all ${
                selectedState === state.id
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-500 shadow-md"
                  : "bg-white border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-lg font-bold ${
                    selectedState === state.id
                      ? "text-white"
                      : "text-emerald-700"
                  }`}
                >
                  {state.code}
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedState === state.id
                      ? "text-emerald-100"
                      : "text-gray-600"
                  }`}
                >
                  {state.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isAdding && selectedState && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add District(s) to {selectedStateName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newDistricts.map((district, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={district}
                      onChange={(e) =>
                        handleDistrictChange(index, e.target.value)
                      }
                      placeholder="District Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        {district.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {newDistricts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDistrictField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddDistrictField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewDistricts([""]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save District(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedState ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No state selected
          </h3>
          <p className="text-gray-500">
            Please select a state to view districts
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading districts...</p>
        </div>
      ) : filteredDistricts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Landmark className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No districts found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No districts found for ${selectedStateName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First District
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDistricts.map((district) => (
            <CardItem key={district.id} item={district} type="district" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District Code
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District Name
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDistricts.map((district) => (
                <tr
                  key={district.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <span className="font-bold text-blue-700">
                        {district.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <h4 className="font-semibold text-gray-800">
                      {district.name}
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectorsPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSectors, setNewSectors] = useState([{ code: "", name: "" }]);

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
      fetchSectors(selectedDistrict);
    } else {
      setSectors([]);
    }
  }, [selectedDistrict]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const fetchSectors = async (districtId) => {
    setLoading(true);
    try {
      const data = await locationApi.getSectorsByDistrict(districtId);
      setSectors(data);
    } catch (error) {
      toast.error("Failed to load sectors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSectorField = () => {
    setNewSectors([...newSectors, { code: "", name: "" }]);
  };

  const handleRemoveSectorField = (index) => {
    if (newSectors.length > 1) {
      const updated = newSectors.filter((_, i) => i !== index);
      setNewSectors(updated);
    }
  };

  const handleSectorChange = (index, field, value) => {
    const updated = [...newSectors];
    updated[index][field] = value;
    setNewSectors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDistrict) {
      toast.error("Please select a district first");
      return;
    }

    const validSectors = newSectors.filter(
      (s) => s.code.trim() && s.name.trim()
    );
    if (validSectors.length === 0) {
      toast.error("Please enter at least one valid sector");
      return;
    }

    try {
      await locationApi.addMultipleSectors(selectedDistrict, validSectors);
      toast.success("Sector(s) added successfully");
      setNewSectors([{ code: "", name: "" }]);
      setIsAdding(false);
      fetchSectors(selectedDistrict);
    } catch (error) {
      toast.error(error.message || "Failed to add sector(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const selectedDistrictName = districts.find(
    (d) => d.id == selectedDistrict
  )?.name;
  const filteredSectors = sectors.filter(
    (sector) =>
      sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sector.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Sectors"
        count={filteredSectors.length}
        onAddClick={() => selectedDistrict && setIsAdding(!isAdding)}
        onSearch={() => fetchSectors(selectedDistrict)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* LOCATION SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAdding && selectedDistrict && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add Sector(s) to {selectedDistrictName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newSectors.map((sector, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={sector.code}
                      onChange={(e) =>
                        handleSectorChange(
                          index,
                          "code",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Sector Code"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      maxLength="10"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={sector.name}
                      onChange={(e) =>
                        handleSectorChange(index, "name", e.target.value)
                      }
                      placeholder="Sector Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newSectors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSectorField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddSectorField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewSectors([{ code: "", name: "" }]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Sector(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedDistrict ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a district
          </h3>
          <p className="text-gray-500">
            Please select a state and district to view sectors
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading sectors...</p>
        </div>
      ) : filteredSectors.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No sectors found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No sectors found for ${selectedDistrictName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Sector
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSectors.map((sector) => (
            <CardItem key={sector.id} item={sector} type="sector" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Sector Code
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Sector Name
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSectors.map((sector) => (
                <tr
                  key={sector.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                      <span className="font-bold text-purple-700">
                        {sector.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <h4 className="font-semibold text-gray-800">
                      {sector.name}
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CardItem({ item, type }) {
  const getTypeStyles = (type) => {
    switch (type) {
      case "state":
        return {
          bg: "from-blue-50 to-cyan-50",
          border: "border-blue-100",
          text: "text-blue-700",
          icon: <Globe className="h-5 w-5" />,
        };
      case "district":
        return {
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-100",
          text: "text-emerald-700",
          icon: <Landmark className="h-5 w-5" />,
        };
      case "sector":
        return {
          bg: "from-purple-50 to-violet-50",
          border: "border-purple-100",
          text: "text-purple-700",
          icon: <Target className="h-5 w-5" />,
        };
      case "town":
        return {
          bg: "from-amber-50 to-orange-50",
          border: "border-amber-100",
          text: "text-amber-700",
          icon: <Building className="h-5 w-5" />,
        };
      case "mandal":
        return {
          bg: "from-indigo-50 to-blue-50",
          border: "border-indigo-100",
          text: "text-indigo-700",
          icon: <Navigation className="h-5 w-5" />,
        };
      case "village":
        return {
          bg: "from-rose-50 to-pink-50",
          border: "border-rose-100",
          text: "text-rose-700",
          icon: <Home className="h-5 w-5" />,
        };
      default:
        return {
          bg: "from-gray-50 to-gray-100",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Home className="h-5 w-5" />,
        };
    }
  };

  const styles = getTypeStyles(type);
  const displayName = parseJsonName(item.name);

  return (
    <div
      className={`group border ${styles.border} rounded-2xl p-6 bg-gradient-to-r ${styles.bg} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${styles.text} bg-white rounded-xl`}>
            {styles.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
              {displayName}
            </h3>
            {item.code && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-medium ${styles.text}`}>
                  Code: {item.code}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TownsPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTowns, setNewTowns] = useState([""]);

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
    }
  }, [selectedDistrict]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const fetchTowns = async (districtId) => {
    setLoading(true);
    try {
      const data = await locationApi.getTownsByDistrict(districtId);
      // Parse town names if they're stored as JSON strings
      const parsedData = data.map(town => ({
        ...town,
        name: parseJsonName(town.name)
      }));
      setTowns(parsedData);
    } catch (error) {
      toast.error("Failed to load towns");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTownField = () => {
    setNewTowns([...newTowns, ""]);
  };

  const handleRemoveTownField = (index) => {
    if (newTowns.length > 1) {
      const updated = newTowns.filter((_, i) => i !== index);
      setNewTowns(updated);
    }
  };

  const handleTownChange = (index, value) => {
    const updated = [...newTowns];
    updated[index] = value;
    setNewTowns(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDistrict) {
      toast.error("Please select a district first");
      return;
    }

    const validTowns = newTowns.filter((t) => t.trim());
    if (validTowns.length === 0) {
      toast.error("Please enter at least one town name");
      return;
    }

    try {
      await locationApi.addMultipleTowns(selectedDistrict, validTowns);
      toast.success("Town(s) added successfully");
      setNewTowns([""]);
      setIsAdding(false);
      fetchTowns(selectedDistrict);
    } catch (error) {
      toast.error(error.message || "Failed to add town(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const selectedDistrictName = districts.find(
    (d) => d.id == selectedDistrict
  )?.name;
  const filteredTowns = towns.filter((town) =>
    town.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Towns"
        count={filteredTowns.length}
        onAddClick={() => selectedDistrict && setIsAdding(!isAdding)}
        onSearch={() => fetchTowns(selectedDistrict)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* LOCATION SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAdding && selectedDistrict && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add Town(s) to {selectedDistrictName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newTowns.map((town, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={town}
                      onChange={(e) => handleTownChange(index, e.target.value)}
                      placeholder="Town Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newTowns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTownField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddTownField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTowns([""]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Town(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedDistrict ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a district
          </h3>
          <p className="text-gray-500">
            Please select a state and district to view towns
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading towns...</p>
        </div>
      ) : filteredTowns.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No towns found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No towns found for ${selectedDistrictName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Town
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTowns.map((town) => (
            <CardItem key={town.id} item={town} type="town" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Town Name
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTowns.map((town) => (
                <tr
                  key={town.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                        <Building className="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {town.name}
                      </h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedDistrictName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MandalsPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMandals, setNewMandals] = useState([""]);

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
      fetchMandals(selectedDistrict);
    } else {
      setMandals([]);
    }
  }, [selectedDistrict]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const fetchMandals = async (districtId) => {
    setLoading(true);
    try {
      const data = await locationApi.getMandalsByDistrict(districtId);
      setMandals(data);
    } catch (error) {
      toast.error("Failed to load mandals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMandalField = () => {
    setNewMandals([...newMandals, ""]);
  };

  const handleRemoveMandalField = (index) => {
    if (newMandals.length > 1) {
      const updated = newMandals.filter((_, i) => i !== index);
      setNewMandals(updated);
    }
  };

  const handleMandalChange = (index, value) => {
    const updated = [...newMandals];
    updated[index] = value;
    setNewMandals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDistrict) {
      toast.error("Please select a district first");
      return;
    }

    const validMandals = newMandals.filter((m) => m.trim());
    if (validMandals.length === 0) {
      toast.error("Please enter at least one mandal name");
      return;
    }

    try {
      await locationApi.addMultipleMandals(selectedDistrict, validMandals);
      toast.success("Mandal(s) added successfully");
      setNewMandals([""]);
      setIsAdding(false);
      fetchMandals(selectedDistrict);
    } catch (error) {
      toast.error(error.message || "Failed to add mandal(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const selectedDistrictName = districts.find(
    (d) => d.id == selectedDistrict
  )?.name;
  const filteredMandals = mandals.filter((mandal) =>
    mandal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Mandals"
        count={filteredMandals.length}
        onAddClick={() => selectedDistrict && setIsAdding(!isAdding)}
        onSearch={() => fetchMandals(selectedDistrict)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* LOCATION SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAdding && selectedDistrict && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add Mandal(s) to {selectedDistrictName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newMandals.map((mandal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={mandal}
                      onChange={(e) => handleMandalChange(index, e.target.value)}
                      placeholder="Mandal Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newMandals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMandalField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddMandalField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewMandals([""]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Mandal(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedDistrict ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Navigation className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a district
          </h3>
          <p className="text-gray-500">
            Please select a state and district to view mandals
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading mandals...</p>
        </div>
      ) : filteredMandals.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Navigation className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No mandals found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No mandals found for ${selectedDistrictName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Mandal
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMandals.map((mandal) => (
            <CardItem key={mandal.id} item={mandal} type="mandal" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Mandal Name
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMandals.map((mandal) => (
                <tr
                  key={mandal.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                        <Navigation className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {mandal.name}
                      </h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedDistrictName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VillagesByMandalPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVillages, setNewVillages] = useState([""]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
      setSelectedDistrict("");
      setMandals([]);
      setSelectedMandal("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchMandals(selectedDistrict);
    } else {
      setMandals([]);
      setSelectedMandal("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedMandal) {
      fetchVillages(selectedMandal);
    } else {
      setVillages([]);
    }
  }, [selectedMandal]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const fetchMandals = async (districtId) => {
    try {
      const data = await locationApi.getMandalsByDistrict(districtId);
      // Parse mandal names if they're stored as JSON strings
      const parsedData = data.map(mandal => ({
        ...mandal,
        name: parseJsonName(mandal.name)
      }));
      setMandals(parsedData);
      if (parsedData.length > 0) {
        setSelectedMandal(parsedData[0].id);
      }
    } catch (error) {
      toast.error("Failed to load mandals");
    }
  };

  const fetchVillages = async (mandalId) => {
    setLoading(true);
    try {
      const data = await locationApi.getVillagesByMandal(mandalId);
      // Parse village names if they're stored as JSON strings
      const parsedData = data.map(village => ({
        ...village,
        name: parseJsonName(village.name)
      }));
      setVillages(parsedData);
    } catch (error) {
      toast.error("Failed to load villages");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVillageField = () => {
    setNewVillages([...newVillages, ""]);
  };

  const handleRemoveVillageField = (index) => {
    if (newVillages.length > 1) {
      const updated = newVillages.filter((_, i) => i !== index);
      setNewVillages(updated);
    }
  };

  const handleVillageChange = (index, value) => {
    const updated = [...newVillages];
    updated[index] = value;
    setNewVillages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMandal) {
      toast.error("Please select a mandal first");
      return;
    }

    const validVillages = newVillages.filter((v) => v.trim());
    if (validVillages.length === 0) {
      toast.error("Please enter at least one village name");
      return;
    }

    try {
      await locationApi.addMultipleVillagesToMandal(selectedMandal, validVillages);
      toast.success("Village(s) added successfully");
      setNewVillages([""]);
      setIsAdding(false);
      fetchVillages(selectedMandal);
    } catch (error) {
      toast.error(error.message || "Failed to add village(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const selectedDistrictName = districts.find(
    (d) => d.id == selectedDistrict
  )?.name;
  const selectedMandalName = parseJsonName(mandals.find((m) => m.id == selectedMandal)?.name || "");
  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Villages (by Mandal)"
        count={filteredVillages.length}
        onAddClick={() => selectedMandal && setIsAdding(!isAdding)}
        onSearch={() => fetchVillages(selectedMandal)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* LOCATION SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
              Mandal
            </label>
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              disabled={!selectedDistrict}
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedDistrict ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a mandal</option>
              {mandals.map((mandal) => (
                <option key={mandal.id} value={mandal.id}>
                  {mandal.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAdding && selectedMandal && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add Village(s) to {selectedMandalName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newVillages.map((village, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => handleVillageChange(index, e.target.value)}
                      placeholder="Village Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newVillages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVillageField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddVillageField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewVillages([""]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Village(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedMandal ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a mandal
          </h3>
          <p className="text-gray-500">
            Please select a state, district, and mandal to view villages
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading villages...</p>
        </div>
      ) : filteredVillages.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No villages found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No villages found for ${selectedMandalName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Village
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVillages.map((village) => (
            <CardItem key={village.id} item={village} type="village" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Village Name
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Mandal
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVillages.map((village) => (
                <tr
                  key={village.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                        <Home className="h-5 w-5 text-rose-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {village.name}
                      </h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedMandalName}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedDistrictName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VillagesBySectorPage({ viewMode, isAdding, setIsAdding }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVillages, setNewVillages] = useState([""]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
      setSelectedDistrict("");
      setSectors([]);
      setSelectedSector("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchSectors(selectedDistrict);
    } else {
      setSectors([]);
      setSelectedSector("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      fetchVillages(selectedSector);
    } else {
      setVillages([]);
    }
  }, [selectedSector]);

  const fetchStates = async () => {
    try {
      const data = await locationApi.getStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load states");
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await locationApi.getDistrictsByState(stateId);
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const fetchSectors = async (districtId) => {
    try {
      const data = await locationApi.getSectorsByDistrict(districtId);
      setSectors(data);
      if (data.length > 0) {
        setSelectedSector(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load sectors");
    }
  };

  const fetchVillages = async (sectorId) => {
    setLoading(true);
    try {
      const data = await locationApi.getVillagesBySector(sectorId);
      // Parse village names if they're stored as JSON strings
      const parsedData = data.map(village => ({
        ...village,
        name: parseJsonName(village.name)
      }));
      setVillages(parsedData);
    } catch (error) {
      toast.error("Failed to load villages");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVillageField = () => {
    setNewVillages([...newVillages, ""]);
  };

  const handleRemoveVillageField = (index) => {
    if (newVillages.length > 1) {
      const updated = newVillages.filter((_, i) => i !== index);
      setNewVillages(updated);
    }
  };

  const handleVillageChange = (index, value) => {
    const updated = [...newVillages];
    updated[index] = value;
    setNewVillages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSector) {
      toast.error("Please select a sector first");
      return;
    }

    const validVillages = newVillages.filter((v) => v.trim());
    if (validVillages.length === 0) {
      toast.error("Please enter at least one village name");
      return;
    }

    try {
      await locationApi.addMultipleVillagesToSector(selectedSector, validVillages);
      toast.success("Village(s) added successfully");
      setNewVillages([""]);
      setIsAdding(false);
      fetchVillages(selectedSector);
    } catch (error) {
      toast.error(error.message || "Failed to add village(s)");
    }
  };

  const selectedStateName = states.find((s) => s.id == selectedState)?.name;
  const selectedDistrictName = districts.find(
    (d) => d.id == selectedDistrict
  )?.name;
  const selectedSectorName = sectors.find((s) => s.id == selectedSector)?.name;
  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Villages (by Sector)"
        count={filteredVillages.length}
        onAddClick={() => selectedSector && setIsAdding(!isAdding)}
        onSearch={() => fetchVillages(selectedSector)}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* LOCATION SELECTOR */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Select Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedState ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              disabled={!selectedDistrict}
              className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                !selectedDistrict ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a sector</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAdding && selectedSector && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg">
              Add Village(s) to {selectedSectorName}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-emerald-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {newVillages.map((village, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => handleVillageChange(index, e.target.value)}
                      placeholder="Village Name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  {newVillages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVillageField(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-emerald-200">
              <button
                type="button"
                onClick={handleAddVillageField}
                className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Another</span>
              </button>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewVillages([""]);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Save Village(s)
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!selectedSector ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a sector
          </h3>
          <p className="text-gray-500">
            Please select a state, district, and sector to view villages
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading villages...</p>
        </div>
      ) : filteredVillages.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No villages found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try a different search"
              : `No villages found for ${selectedSectorName}`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Village
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVillages.map((village) => (
            <CardItem key={village.id} item={village} type="village" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Village Name
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Sector
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  District
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVillages.map((village) => (
                <tr
                  key={village.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                        <Users className="h-5 w-5 text-teal-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {village.name}
                      </h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedSectorName}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600">{selectedDistrictName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}