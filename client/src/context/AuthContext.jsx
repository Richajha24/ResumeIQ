
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
API.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext();


const getErrorMessage = (err, fallback) => {
  return err.response?.data?.error || err.response?.data?.message || err.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('resumeiq_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('resumeiq_token', token);
      fetchCurrentUser();
    } else {
      delete API.defaults.headers.common['Authorization'];
      localStorage.removeItem('resumeiq_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get('/api/auth/me');

      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Failed to verify token, clearing session:', err.message);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/api/auth/login', { email, password });

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
      }

      throw new Error(res.data.error || 'Login failed');
    } catch (err) {
      const error = new Error(getErrorMessage(err, 'Login failed'));
      error.code = err.response?.data?.code;
      throw error;
    }
  };

  // Registration now creates an account but does not log the user in.
  const register = async (fullName, email, password, mobile) => {
    try {
      const res = await API.post('/api/auth/register', {
        fullName,
        email,
        password,
        mobile
      });

      return res.data;
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Registration failed'));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('resumeiq_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
