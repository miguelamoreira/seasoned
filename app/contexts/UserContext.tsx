import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";

interface User {
    user_id: number;
}

interface UserContextType {
    user: User | null;
    token: string | null;
    setUserData: (user: User, token: string) => void;
    setToken: (token: string | null) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
            setUserState(JSON.parse(storedUser));
            setTokenState(storedToken);
        }
        };
        loadUserData();
    }, []);

    const setUserData = async (user: User, token: string) => {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        setUserState(user);
        setTokenState(token);
    };

    const clearUser = async () => {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        setUserState(null);
        setTokenState(null);
    };

    const setToken = (token: string | null) => {
        if (token) {
        AsyncStorage.setItem("token", token);
        } else {
        AsyncStorage.removeItem("token");
        }
        setTokenState(token);
    };

    return (
        <UserContext.Provider value={{ user, token, setUserData, setToken, clearUser }}>
        {children}
        </UserContext.Provider>
    );
}

const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export { UserContext, useUserContext };
