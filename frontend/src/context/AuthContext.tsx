import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    login: (token: string, role: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        // Initialize from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setUser({ username: 'User', role }); // username not stored, generic for now
        }

        // Listen for LOGIN_REQUIRED event from request.ts
        const handleLoginRequired = () => {
            setIsLoginModalOpen(true);
        };

        window.addEventListener('LOGIN_REQUIRED', handleLoginRequired);
        return () => {
            window.removeEventListener('LOGIN_REQUIRED', handleLoginRequired);
        };
    }, []);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const login = (token: string, role: string, username: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ username, role });
        closeLoginModal();
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
