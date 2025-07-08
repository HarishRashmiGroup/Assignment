import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../services/api/authApi';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token && location && location.pathname != "/auth") {
                console.log(location)
                navigate("/auth");
                return;
            }

            try {
                const response = await getUser();
                setUser(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem("token");
                        if (!location || location.pathname != '/auth')
                            navigate("/auth");
                    } else {
                        toast({
                            title: "Error fetching user credentials.",
                            description: error.response.data.message || "Something went wrong. Please try again.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                } else if (error.request) {
                    toast({
                        title: "Network Error",
                        description: "Please check your internet connection and try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "An unexpected error occurred.",
                        description: error.message || "Please try again later.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, location]);
    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
