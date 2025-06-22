import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios with base URL
axios.defaults.baseURL = 'https://shelearns.onrender.com';
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setUser(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem('token', jwt);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
  };

  const signup = (jwt) => {
    setToken(jwt);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 