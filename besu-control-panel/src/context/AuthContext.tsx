"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    role: 'admin' | 'user' | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);

    const login = (username: string, password: string) => {
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            setRole('admin');
            return true;
        }
        if (username === 'user' && password === 'user') {
            setIsAuthenticated(true);
            setRole('user');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 