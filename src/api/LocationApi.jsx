// services/locationApi.js - FIXED VERSION
const API_BASE_URL = 'http://72.61.169.226/admin';

// Get token function (don't define token at module level, it might be undefined)
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

// Handle response with error checking
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

export const locationApi = {
  // States
  getStates: async () => {
    const response = await fetch(`${API_BASE_URL}/states`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  },

  addState: async (stateData) => {
    console.log('Adding state:', stateData); // Debug
    const response = await fetch(`${API_BASE_URL}/states`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stateData)
    });
    return handleResponse(response);
  },

  addMultipleStates: async (states) => {
    console.log('Adding multiple states:', states); // Debug
    const response = await fetch(`${API_BASE_URL}/states/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ states })
    });
    return handleResponse(response);
  },

  // Districts
  getDistrictsByState: async (stateId) => {
    const response = await fetch(`${API_BASE_URL}/states/${stateId}/districts`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addDistrict: async (districtData) => {
    console.log('Adding district:', districtData);
    const response = await fetch(`${API_BASE_URL}/districts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(districtData)
    });
    return handleResponse(response);
  },

  addMultipleDistricts: async (stateId, districts) => {
    console.log('Adding multiple districts:', districts);
    const response = await fetch(`${API_BASE_URL}/districts/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ state_id: stateId, districts })
    });
    return handleResponse(response);
  },

  // Mandals - FIXED: Remove .map() as backend expects array of strings
  getMandalsByDistrict: async (districtId) => {
    const response = await fetch(`${API_BASE_URL}/districts/${districtId}/mandals`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addMandal: async (mandalData) => {
    console.log('Adding mandal:', mandalData);
    const response = await fetch(`${API_BASE_URL}/mandals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mandalData)
    });
    return handleResponse(response);
  },

  addMultipleMandals: async (districtId, mandals) => {
    console.log('Adding multiple mandals:', mandals);
    const response = await fetch(`${API_BASE_URL}/mandals/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        district_id: districtId, 
        mandals: mandals // FIXED: Just pass array, no .map()
      })
    });
    return handleResponse(response);
  },

  // Sectors
  getSectorsByDistrict: async (districtId) => {
    const response = await fetch(`${API_BASE_URL}/districts/${districtId}/sectors`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addSector: async (sectorData) => {
    console.log('Adding sector:', sectorData);
    const response = await fetch(`${API_BASE_URL}/sectors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sectorData)
    });
    return handleResponse(response);
  },

  addMultipleSectors: async (districtId, sectors) => {
    console.log('Adding multiple sectors:', sectors);
    const response = await fetch(`${API_BASE_URL}/sectors/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        district_id: districtId, 
        sectors 
      })
    });
    return handleResponse(response);
  },

  // Towns - FIXED: Remove .map() as backend expects array of strings
  getTownsByDistrict: async (districtId) => {
    const response = await fetch(`${API_BASE_URL}/districts/${districtId}/towns`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addTown: async (townData) => {
    console.log('Adding town:', townData);
    const response = await fetch(`${API_BASE_URL}/towns`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(townData)
    });
    return handleResponse(response);
  },

  addMultipleTowns: async (districtId, towns) => {
    console.log('Adding multiple towns:', towns);
    const response = await fetch(`${API_BASE_URL}/towns/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        district_id: districtId, 
        towns: towns // FIXED: Just pass array, no .map()
      })
    });
    return handleResponse(response);
  },

  // Villages - Already correct
  getVillagesByMandal: async (mandalId) => {
    const response = await fetch(`${API_BASE_URL}/mandals/${mandalId}/villages`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getVillagesBySector: async (sectorId) => {
    const response = await fetch(`${API_BASE_URL}/sectors/${sectorId}/villages`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addVillageToMandal: async (mandalId, villageName) => {
    console.log('Adding village to mandal:', { mandalId, villageName });
    const response = await fetch(`${API_BASE_URL}/villages/mandal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mandal_id: mandalId, name: villageName })
    });
    return handleResponse(response);
  },

  addVillageToSector: async (sectorId, villageName) => {
    console.log('Adding village to sector:', { sectorId, villageName });
    const response = await fetch(`${API_BASE_URL}/villages/sector`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sector_id: sectorId, name: villageName })
    });
    return handleResponse(response);
  },

  addMultipleVillagesToMandal: async (mandalId, villages) => {
    console.log('Adding multiple villages to mandal:', { mandalId, villages });
    const response = await fetch(`${API_BASE_URL}/villages/mandal/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        mandal_id: mandalId, 
        villages: villages // Already correct
      })
    });
    return handleResponse(response);
  },

  addMultipleVillagesToSector: async (sectorId, villages) => {
    console.log('Adding multiple villages to sector:', { sectorId, villages });
    const response = await fetch(`${API_BASE_URL}/villages/sector/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        sector_id: sectorId, 
        villages: villages // Already correct
      })
    });
    return handleResponse(response);
  },

  deleteState: async (stateId) => {
    const response = await fetch(`${API_BASE_URL}/state/${stateId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete state');
    }
    return response.json();
  },

  deleteDistrict: async (districtId) => {
    const response = await fetch(`${API_BASE_URL}/district/${districtId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete district');
    }
    return response.json();
  },

  deleteSector: async (sectorId) => {
    const response = await fetch(`${API_BASE_URL}/sector/${sectorId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete sector');
    }
    return response.json();
  },

  deleteMandal: async (mandalId) => {
    const response = await fetch(`${API_BASE_URL}/mandal/${mandalId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete mandal');
    }
    return response.json();
  },

  deleteTown: async (townId) => {
    const response = await fetch(`${API_BASE_URL}/town/${townId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete town');
    }
    return response.json();
  },

  deleteVillage: async (villageId) => {
    const response = await fetch(`${API_BASE_URL}/village/${villageId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete village');
    }
    return response.json();
  },
};