import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));

            fetchDoctors(token);
        }
        setLoading(false);
    }, []);

    const fetchDoctors = async (token) => {
        try {
            const res = await axios.get('https://clinikapp.onrender.com/doctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(res.data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        }
    };

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
        fetchDoctors(token); // fetch doctors after login
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        setDoctors([]);
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, doctors }}>
            {children}
        </AuthContext.Provider>
    );
};
