import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/auth.service';
import { User } from '../types/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
