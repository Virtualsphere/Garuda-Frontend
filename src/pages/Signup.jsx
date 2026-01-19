import React, { useState, useEffect } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://72.61.169.226/admin/roles", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Fetched roles:", data.roles);
          setRoles(data.roles || []);
          
          // If roles are fetched, set default role to first one if exists
          if (data.roles && data.roles.length > 0) {
            setFormData(prev => ({
              ...prev,
              role: data.roles[0].name // Keep original case
            }));
          }
        } else {
          setError(data.error || "Failed to load roles");
          console.error("Error fetching roles:", data.error);
        }
      } catch (err) {
        console.error("Network error fetching roles:", err);
        setError("Network error. Please check your connection.");
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agree) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    const { name, email, phone, password, role } = formData;

    setLoading(true);
    
    try {
      const response = await fetch("http://72.61.169.226/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          password, 
          role: role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("Registered user:", data.user);
        // Reset form after successful registration
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: roles.length > 0 ? roles[0].name : "",
          agree: false,
        });
      } else {
        alert(`Error: ${data.error || "Registration failed"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            New here? Signing up is easy. It only takes a few steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              {error && (
                <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
            </div>
            
            {rolesLoading ? (
              <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                <svg className="animate-spin h-5 w-5 mr-3 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading roles...</span>
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center p-3 border border-yellow-300 rounded-lg bg-yellow-50">
                <p className="text-yellow-700 text-sm">
                  No roles found. Please create roles first in Access Controls.
                </p>
              </div>
            ) : (
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 bg-white"
                required
              >
                <option value="">-- Select a Role --</option>
                {roles.map((role) => (
                  <option 
                    key={role.id || role.name} 
                    value={role.name}
                    title={role.description || "No description"}
                  >
                    {role.name}
                    {role.description && ` - ${role.description}`}
                  </option>
                ))}
              </select>
            )}
            
            {roles.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {roles.length} role(s) loaded from database
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              required
              minLength="6"
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 rounded transition duration-200"
              required
            />
            <label htmlFor="agree" className="text-gray-600 text-sm">
              I agree to all Terms & Conditions and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || rolesLoading || !formData.role}
            className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${(loading || rolesLoading || !formData.role) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "CREATE ACCOUNT"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;