import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AgentForm } from "./AgentForm";
import { PanelRight, UserPlus, Search, Filter, X, Plus, Edit, Trash2, Eye } from "lucide-react";

export const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filters, setFilters] = useState({
    search_name: "",
    search_phone: "",
    district_filter: "All Districts",
    mandal_filter: "All Mandals",
    village_filter: "All Villages",
  });
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [totalAgents, setTotalAgents] = useState(0);

  const navigate = useNavigate();
  const API_URL = "http://72.61.169.226/admin";

  useEffect(() => {
    fetchAgents();
    fetchLocationFilters();
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [filters]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search_name)
        params.append("search_name", filters.search_name);
      if (filters.search_phone)
        params.append("search_phone", filters.search_phone);
      if (filters.district_filter !== "All Districts")
        params.append("district_filter", filters.district_filter);
      if (filters.mandal_filter !== "All Mandals")
        params.append("mandal_filter", filters.mandal_filter);
      if (filters.village_filter !== "All Villages")
        params.append("village_filter", filters.village_filter);

      const response = await axios.get(`${API_URL}/agents?${params}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setAgents(response.data.data);
      setTotalAgents(response.data.count);
    } catch (error) {
      console.error("Error fetching agents:", error);
      alert("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationFilters = async () => {
    try {
      // First fetch from land data to get all districts, mandals, villages
      const response = await axios.get(`${API_URL}/land`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const lands = response.data.data;

      // Extract unique values
      const uniqueDistricts = [
        ...new Set(
          lands.map((land) => land.land_location.district).filter(Boolean)
        ),
      ];
      const uniqueMandals = [
        ...new Set(
          lands.map((land) => land.land_location.mandal).filter(Boolean)
        ),
      ];
      const uniqueVillages = [
        ...new Set(
          lands.map((land) => land.land_location.village).filter(Boolean)
        ),
      ];

      setDistricts(uniqueDistricts.sort());
      setMandals(uniqueMandals.sort());
      setVillages(uniqueVillages.sort());
    } catch (error) {
      console.error("Error fetching location filters:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search_name: "",
      search_phone: "",
      district_filter: "All Districts",
      mandal_filter: "All Mandals",
      village_filter: "All Villages",
    });
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setShowForm(true);
  };

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm("Are you sure you want to deactivate this agent?")) {
      try {
        await axios.delete(`${API_URL}/agents/${agentId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        alert("Agent deactivated successfully");
        fetchAgents();
      } catch (error) {
        console.error("Error deleting agent:", error);
        alert("Failed to deactivate agent");
      }
    }
  };

  const handleViewDetails = (agentId) => {
    navigate(`/agents/${agentId}/details`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "¥");
  };

  if (loading && agents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b border-gray-200 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <PanelRight className="h-5 w-5 text-white" />
          </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Agent List</h1>
              <p className="text-sm text-gray-500">
                A list of all external agents and their details
              </p>
              {totalAgents > 0 && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {totalAgents} agent{totalAgents !== 1 ? "s" : ""} found
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Agent</span>
          </button>
        </header>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.search_name}
                  onChange={(e) =>
                    handleFilterChange("search_name", e.target.value)
                  }
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by phone..."
                  value={filters.search_phone}
                  onChange={(e) =>
                    handleFilterChange("search_phone", e.target.value)
                  }
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={filters.district_filter}
                onChange={(e) =>
                  handleFilterChange("district_filter", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Districts">All Districts</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mandal
              </label>
              <select
                value={filters.mandal_filter}
                onChange={(e) =>
                  handleFilterChange("mandal_filter", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Mandals">All Mandals</option>
                {mandals.map((mandal, index) => (
                  <option key={index} value={mandal}>
                    {mandal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village (Town)
              </label>
              <select
                value={filters.village_filter}
                onChange={(e) =>
                  handleFilterChange("village_filter", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Villages">All Villages</option>
                {villages.map((village, index) => (
                  <option key={index} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Districts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mandals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deposit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attached Lands
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Land Worth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          No agents found
                        </p>
                        <p className="text-gray-600">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {agent.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {agent.districts}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {agent.mandals}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {formatCurrency(agent.deposit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {agent.attached_lands_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-red-600">
                          {formatCurrency(agent.total_land_worth)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(agent.agent_id)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Manage
                          </button>
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="inline-flex items-center px-3 py-1.5 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent.agent_id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>

      {/* Agent Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AgentForm
              agent={selectedAgent}
              onClose={() => {
                setShowForm(false);
                setSelectedAgent(null);
              }}
              onSuccess={() => {
                setShowForm(false);
                setSelectedAgent(null);
                fetchAgents();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
