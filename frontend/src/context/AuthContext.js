import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000"; // ✅ ADD THIS

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.baseURL = API; // ✅ IMPORTANT
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      axios.defaults.baseURL = API; // ✅ ALSO HERE
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    axios.defaults.baseURL = API; // ✅ ADD

    const res = await axios.post('/api/auth/login', { email, password });

    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    setUser(res.data.user); // ✅ FIX (important)
    return res.data;
  };

  const register = async (data) => {
    axios.defaults.baseURL = API; // ✅ ADD

    const res = await axios.post('/api/auth/register', data);

    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    setUser(res.data.user); // ✅ FIX
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);