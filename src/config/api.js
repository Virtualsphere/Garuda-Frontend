// Determine if we're in development or production
const isLocal = ['localhost', '127.0.0.1', '192.168.'].some(host => 
  window.location.hostname.includes(host)
);

export const API_BASE = isLocal
  ? 'http://72.61.169.226'  // Local backend
  : '';  // In production, rely on Vercel's rewrites

// Helper function to ensure consistent URL format
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // For local development, use full URL
  if (isLocal) {
    return `${API_BASE}${cleanEndpoint}`;
  }
  
  // For production, use relative URL (will be rewritten by Vercel)
  return cleanEndpoint;
};

// Special function for image URLs (since they might be absolute in database)
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // If URL is already absolute (from database), return as-is
  if (url.startsWith('http')) {
    // Convert HTTP to relative for production
    if (!isLocal && url.includes('72.61.169.226')) {
      return url.replace('http://72.61.169.226', '');
    }
    return url;
  }
  
  // For relative paths
  if (url.startsWith('/')) {
    return url;
  }
  
  // Assume it's an image filename
  return `/public/images/${url}`;
};