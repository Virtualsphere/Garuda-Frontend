// /api/proxy.js
export default async function handler(req, res) {
  try {
    // Determine backend base URL
    const BACKEND_API = "http://72.61.169.226";
    
    // Get the full path
    const path = req.url;
    
    // Map route prefixes to backend endpoints
    let backendPath = path;
    
    if (path.startsWith('/api/')) {
      backendPath = path.replace('/api/', '/api/');
    } else if (path.startsWith('/auth/')) {
      backendPath = path.replace('/auth/', '/auth/');
    } else if (path.startsWith('/admin/')) {
      backendPath = path.replace('/admin/', '/admin/');
    } else if (path.startsWith('/field-executive/')) {
      backendPath = path.replace('/field-executive/', '/field-executive/');
    } else if (path.startsWith('/public/')) {
      backendPath = path;
    }
    
    // Full backend URL
    const backendUrl = `${BACKEND_API}${backendPath}`;
    
    // Prepare headers
    const headers = { ...req.headers };
    
    // Remove problematic headers
    delete headers['host'];
    delete headers['content-length'];
    delete headers['accept-encoding'];
    
    // Add CORS headers for the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Prepare fetch options
    const options = {
      method: req.method,
      headers: headers,
    };
    
    // Only send body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      if (headers['content-type'] && headers['content-type'].includes('multipart/form-data')) {
        // Handle multipart/form-data (file uploads)
        options.body = req.body;
      } else {
        options.body = JSON.stringify(req.body);
        headers['Content-Type'] = 'application/json';
      }
    }
    
    // Call backend
    const response = await fetch(backendUrl, options);
    
    // Get content type
    const contentType = response.headers.get('content-type');
    
    // Copy headers from backend response
    response.headers.forEach((value, name) => {
      if (name !== 'content-encoding' && name !== 'content-length') {
        res.setHeader(name, value);
      }
    });
    
    // Return appropriate response
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else if (contentType && contentType.includes('image/')) {
      // Handle images
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.status(response.status).send(Buffer.from(buffer));
    } else if (contentType && contentType.includes('video/')) {
      // Handle videos
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    } else {
      // Return as buffer
      const buffer = await response.arrayBuffer();
      return res.status(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Proxy Server Error', 
      details: error.message,
      url: req.url
    });
  }
}