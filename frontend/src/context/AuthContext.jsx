import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext =
    createContext(null);

// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const [loading, setLoading] =
        useState(true);


    // =================================================
    // CHECK CURRENT USER
    // =================================================

    const checkAuth = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/api/auth/me"
                );

            console.log(
                "Current user:",
                response.data
            );

            const userData =
                response.data.data;

            setUser(userData);

            setIsAuthenticated(true);

        } catch (error) {

            console.log(
                "No authenticated user"
            );

            setUser(null);

            setIsAuthenticated(false);

        } finally {

            setLoading(false);
        }
    };


    // =================================================
    // LOGIN
    // =================================================

    const login = async (
        email,
        password
    ) => {

        try {

            const response =
                await api.post(
                    "/api/auth/login",
                    {
                        email,
                        password,
                    }
                );

            console.log(
                "Login response:",
                response.data
            );

            // JWT cookie is created by backend.
            // Now get the current user.

            await checkAuth();

            return response.data;

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            throw error;
        }
    };


    // =================================================
    // LOGOUT
    // =================================================

    const logout = async () => {

        try {

            await api.post(
                "/api/auth/logout"
            );

            setUser(null);

            setIsAuthenticated(false);

            console.log(
                "Logout successful"
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            throw error;
        }
    };


    // =================================================
    // CHECK AUTH ON APPLICATION START
    // =================================================

    useEffect(() => {

        checkAuth();

    }, []);


    // =================================================
    // PROVIDER
    // =================================================

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAuth = () => {

    return useContext(
        AuthContext
    );
};