import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calculator, Check, ChevronDown, Loader, Search, User, Filter } from 'lucide-react';

export const AgentForm = ({ agent, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    phone: '',
    email: '',
    deposit: '0.00',
    preferred_districts: [],
    preferred_mandals: {},
    preferred_villages: {},
    attach_lands: []
  });

  const [allLands, setAllLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [selectedLands, setSelectedLands] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [landLoading, setLandLoading] = useState(false);
  const [totalWorth, setTotalWorth] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [userSearch, setUserSearch] = useState('');

  const API_URL = 'http://72.61.169.226/admin';

  useEffect(() => {
    if (agent) {
      fetchAgentDetails();
    } else {
      setFormData({
        user_id: '',
        name: '',
        phone: '',
        email: '',
        deposit: '0.00',
        preferred_districts: [],
        preferred_mandals: {},
        preferred_villages: {},
        attach_lands: []
      });
    }
    
    fetchAllUsers();
    fetchAllLands();
  }, []);

  useEffect(() => {
    calculateTotalWorth();
  }, [selectedLands]);

  useEffect(() => {
    filterLandsByPreferences();
  }, [formData.preferred_districts, formData.preferred_mandals, formData.preferred_villages, allLands]);

  useEffect(() => {
    if (userSearch.trim()) {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.phone.includes(userSearch)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [userSearch, allUsers]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/personal/details`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      // Filter only agent role users
      const agentUsers = response.data.users.filter(user => 
        user.role === 'agent' && !user.unique_id.includes('admin')
      );
      
      setAllUsers(agentUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllLands = async () => {
    try {
      setLandLoading(true);
      const response = await axios.get(`${API_URL}/land`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      const lands = response.data.data;
      setAllLands(lands);
      
      // Extract unique districts from all lands
      const uniqueDistricts = [...new Set(lands.map(land => 
        land.land_location?.district
      ).filter(Boolean))];
      setDistricts(uniqueDistricts.sort());
      
    } catch (error) {
      console.error('Error fetching all lands:', error);
      setAllLands([]);
    } finally {
      setLandLoading(false);
    }
  };

  const filterLandsByPreferences = () => {
    if (allLands.length === 0) {
      setFilteredLands([]);
      return;
    }

    let filtered = [...allLands];

    // Filter by districts
    if (formData.preferred_districts.length > 0) {
      filtered = filtered.filter(land => 
        formData.preferred_districts.includes(land.land_location?.district)
      );
    }

    // Filter by mandals
    const allMandals = Object.values(formData.preferred_mandals).flat();
    if (allMandals.length > 0) {
      filtered = filtered.filter(land =>
        allMandals.includes(land.land_location?.mandal)
      );
    }

    // Filter by villages
    const allVillages = Object.values(formData.preferred_villages).flat();
    if (allVillages.length > 0) {
      filtered = filtered.filter(land =>
        allVillages.includes(land.land_location?.village)
      );
    }

    setFilteredLands(filtered);
  };

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/agents/${agent.agent_id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      const agentData = response.data.data;
      const userData = response.data.user;
      
      // Transform preferences data
      const preferences = agentData.preferences || [];
      const districts = [...new Set(preferences.map(p => p.district).filter(Boolean))];
      
      const mandalsObj = {};
      preferences.forEach(pref => {
        if (pref.district && pref.mandal) {
          if (!mandalsObj[pref.district]) {
            mandalsObj[pref.district] = [];
          }
          if (!mandalsObj[pref.district].includes(pref.mandal)) {
            mandalsObj[pref.district].push(pref.mandal);
          }
        }
      });

      const villagesObj = {};
      preferences.forEach(pref => {
        if (pref.mandal && pref.village) {
          if (!villagesObj[pref.mandal]) {
            villagesObj[pref.mandal] = [];
          }
          if (!villagesObj[pref.mandal].includes(pref.village)) {
            villagesObj[pref.mandal].push(pref.village);
          }
        }
      });

      // Get attached lands
      const landsResponse = await axios.get(`${API_URL}/agents/${agent.agent_id}/lands`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const attachedLands = landsResponse.data.data || [];
      const landIds = attachedLands.map(land => land.land_id);

      setFormData({
        user_id: agentData.user_id,
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        deposit: agentData.deposit?.toString() || '0.00',
        preferred_districts: districts,
        preferred_mandals: mandalsObj,
        preferred_villages: villagesObj,
        attach_lands: landIds
      });

      setSelectedLands(landIds);
      setTotalWorth(agentData.total_land_worth || 0);

    } catch (error) {
      console.error('Error fetching agent details:', error);
      alert('Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setFormData({
      ...formData,
      user_id: user.unique_id,
      name: user.name,
      phone: user.phone || '',
      email: user.email || ''
    });
    setUserSearch(user.name);
    setShowUserDropdown(false);
    setFilteredUsers([]);
  };

  const handleDistrictChange = (district) => {
    const updatedDistricts = formData.preferred_districts.includes(district)
      ? formData.preferred_districts.filter(d => d !== district)
      : [...formData.preferred_districts, district];

    const updatedMandals = { ...formData.preferred_mandals };
    const updatedVillages = { ...formData.preferred_villages };
    
    if (!updatedDistricts.includes(district)) {
      delete updatedMandals[district];
      // Remove villages associated with this district's mandals
      Object.keys(updatedVillages).forEach(mandal => {
        if (updatedMandals[district]?.includes(mandal)) {
          delete updatedVillages[mandal];
        }
      });
    }

    setFormData(prev => ({
      ...prev,
      preferred_districts: updatedDistricts,
      preferred_mandals: updatedMandals,
      preferred_villages: updatedVillages
    }));

    // Update mandals list based on selected districts
    updateMandalsList(updatedDistricts);
  };

  const updateMandalsList = (selectedDistricts) => {
    if (selectedDistricts.length === 0) {
      setMandals([]);
      setVillages([]);
      return;
    }

    const mandalsFromLands = [...new Set(
      allLands
        .filter(land => selectedDistricts.includes(land.land_location?.district))
        .map(land => land.land_location?.mandal)
        .filter(Boolean)
    )].sort();

    setMandals(mandalsFromLands);
  };

  const handleMandalChange = (district, mandal) => {
    const updatedMandals = { ...formData.preferred_mandals };
    
    if (!updatedMandals[district]) {
      updatedMandals[district] = [];
    }
    
    if (updatedMandals[district].includes(mandal)) {
      updatedMandals[district] = updatedMandals[district].filter(m => m !== mandal);
      
      // Remove villages associated with this mandal
      const updatedVillages = { ...formData.preferred_villages };
      delete updatedVillages[mandal];
      setFormData(prev => ({
        ...prev,
        preferred_villages: updatedVillages
      }));
    } else {
      updatedMandals[district] = [...updatedMandals[district], mandal];
    }

    setFormData(prev => ({
      ...prev,
      preferred_mandals: updatedMandals
    }));

    // Update villages list based on selected mandals
    updateVillagesList(Object.values(updatedMandals).flat());
  };

  const updateVillagesList = (selectedMandals) => {
    if (selectedMandals.length === 0) {
      setVillages([]);
      return;
    }

    const villagesFromLands = [...new Set(
      allLands
        .filter(land => selectedMandals.includes(land.land_location?.mandal))
        .map(land => land.land_location?.village)
        .filter(Boolean)
    )].sort();

    setVillages(villagesFromLands);
  };

  const handleVillageChange = (mandal, village) => {
    const updatedVillages = { ...formData.preferred_villages };
    
    if (!updatedVillages[mandal]) {
      updatedVillages[mandal] = [];
    }
    
    if (updatedVillages[mandal].includes(village)) {
      updatedVillages[mandal] = updatedVillages[mandal].filter(v => v !== village);
    } else {
      updatedVillages[mandal] = [...updatedVillages[mandal], village];
    }

    setFormData(prev => ({
      ...prev,
      preferred_villages: updatedVillages
    }));
  };

  const handleLandSelection = (landId) => {
    const isSelected = selectedLands.includes(landId);
    const updatedLands = isSelected
      ? selectedLands.filter(id => id !== landId)
      : [...selectedLands, landId];

    setSelectedLands(updatedLands);
    setFormData(prev => ({
      ...prev,
      attach_lands: updatedLands
    }));
  };

  const calculateTotalWorth = () => {
    const total = selectedLands.reduce((sum, landId) => {
      const land = allLands.find(l => l.land_id === landId);
      return sum + (land ? parseFloat(land.land_details?.total_land_price) || 0 : 0);
    }, 0);
    setTotalWorth(total);
    
    // Auto-calculate deposit as 0.5% of total worth
    const depositAmount = (total * 0.005).toFixed(2);
    setFormData(prev => ({ ...prev, deposit: depositAmount }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.user_id) errors.user = 'Please select an agent from the list';
    if (formData.preferred_districts.length === 0) errors.districts = 'Select at least one preferred district';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        user_id: formData.user_id,
        deposit: parseFloat(formData.deposit) || 0,
        preferred_districts: formData.preferred_districts,
        preferred_mandals: formData.preferred_mandals,
        preferred_villages: formData.preferred_villages,
        attach_lands: selectedLands
      };

      let response;
      if (agent) {
        response = await axios.put(`${API_URL}/agents/${agent.agent_id}`, submitData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        alert('Agent updated successfully');
      } else {
        response = await axios.post(`${API_URL}/agents`, submitData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        alert('Agent created successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving agent:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save agent';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '¥');
  };

  const getFilterStats = () => {
    const totalLands = allLands.length;
    const filteredLandsCount = filteredLands.length;
    const selectedCount = selectedLands.length;
    
    return {
      totalLands,
      filteredLandsCount,
      selectedCount
    };
  };

  const stats = getFilterStats();

  if (loading && agent) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {agent ? 'Edit Agent' : 'Add New Agent'}
          </h2>
          <p className="text-gray-600 mt-1">Select an existing user as agent and configure their settings.</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Agent Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Agent *</h3>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Agent by Name or Phone
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setShowUserDropdown(true);
                  if (formErrors.user) setFormErrors(prev => ({ ...prev, user: null }));
                }}
                onFocus={() => setShowUserDropdown(true)}
                onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.user ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Type agent name or phone number..."
                disabled={!!agent}
              />
            </div>
            
            {showUserDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.unique_id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.phone} • {user.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {formData.user_id && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{formData.name}</div>
                    <div className="text-sm text-gray-600">
                      {formData.phone} • {formData.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {formErrors.user && (
              <p className="mt-1 text-sm text-red-600">{formErrors.user}</p>
            )}
          </div>
        </div>

        {/* Deposit */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Calculated Deposit (¥)</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={formData.deposit}
                onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calculator className="w-4 h-4" />
              <span>Auto-calculated (0.5% of total land worth)</span>
            </div>
          </div>
        </div>

        {/* Preferred Locations - Filters */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Filter Lands by Location *</h3>
            {formErrors.districts && (
              <p className="text-sm text-red-600">{formErrors.districts}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Districts ({districts.length} available)
            </label>
            {districts.length === 0 ? (
              <div className="text-gray-500 text-sm">Loading districts...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {districts.map((district, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDistrictChange(district)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center ${
                      formData.preferred_districts.includes(district)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{district}</span>
                    {formData.preferred_districts.includes(district) && (
                      <Check className="w-4 h-4 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {formData.preferred_districts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mandals ({mandals.length} available)
              </label>
              <div className="flex flex-wrap gap-2">
                {mandals.map((mandal, index) => {
                  // Find the district for this mandal
                  const districtForMandal = districts.find(d => 
                    allLands.some(land => 
                      land.land_location?.district === d && 
                      land.land_location?.mandal === mandal
                    )
                  );

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => districtForMandal && handleMandalChange(districtForMandal, mandal)}
                      className={`px-4 py-2 rounded-lg border transition-colors flex items-center ${
                        Object.values(formData.preferred_mandals).flat().includes(mandal)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{mandal}</span>
                      {Object.values(formData.preferred_mandals).flat().includes(mandal) && (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(formData.preferred_mandals).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Villages ({villages.length} available)
              </label>
              <div className="flex flex-wrap gap-2">
                {villages.map((village, index) => {
                  // Find the mandal for this village
                  const mandalForVillage = Object.keys(formData.preferred_mandals).find(m =>
                    allLands.some(land => 
                      land.land_location?.mandal === m && 
                      land.land_location?.village === village
                    )
                  );

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => mandalForVillage && handleVillageChange(mandalForVillage, village)}
                      className={`px-4 py-2 rounded-lg border transition-colors flex items-center ${
                        Object.values(formData.preferred_villages).flat().includes(village)
                          ? 'bg-purple-100 border-purple-500 text-purple-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{village}</span>
                      {Object.values(formData.preferred_villages).flat().includes(village) && (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Attach Lands */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Available Lands</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>Total: {stats.totalLands} lands</span>
                <Filter className="w-4 h-4" />
                <span>Filtered: {stats.filteredLandsCount} lands</span>
                <span>Selected: {stats.selectedCount} lands</span>
              </div>
            </div>
            <div className="text-lg font-semibold text-blue-600">
              Total Worth: {formatCurrency(totalWorth)}
            </div>
          </div>

          {landLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : allLands.length === 0 ? (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <p className="text-gray-500">No land data available</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredLands.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No lands match your filters</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formData.preferred_districts.length === 0 
                      ? "Select districts to filter lands"
                      : "Try selecting different locations or clear filters"}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Land Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLands.map((land) => (
                      <tr 
                        key={land.land_id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedLands.includes(land.land_id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleLandSelection(land.land_id)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedLands.includes(land.land_id)}
                            onChange={() => handleLandSelection(land.land_id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {land.farmer_details?.name || 'Unknown Farmer'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {land.land_id}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Area: {land.land_details?.land_area || 'N/A'} acres
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {land.land_location?.village || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {land.land_location?.mandal || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {land.land_location?.district || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-red-600">
                            {formatCurrency(land.land_details?.total_land_price || 0)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {land.land_details?.price_per_acre 
                              ? `${formatCurrency(land.land_details.price_per_acre)}/acre`
                              : 'Price N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </span>
            ) : agent ? 'Update Agent' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  );
};