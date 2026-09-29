import { createContext, useState, useEffect, useContext } from "react";
import { BASE_URL } from "./api/apigen";

export const userContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/logout`, { method: 'POST', credentials: 'include' });
            if (!res.ok) {
                throw new Error('Logout failed');
            }

            setUser(null);
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    };

    const fetchUser = () => {
        setLoading(true);
        return fetch(`${BASE_URL}/me`, { credentials: 'include' })
            .then(res => {
                console.log("Raw response:", res);
                console.log("Response ok?", res.ok);
                return res.ok ? res.json() : null;
            })
            .then(data => {
                console.log("Parsed user data:", data);
                setUser(data);
            })
            .catch(err => {
                console.error("Fetch failed:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <userContext.Provider value={{ user, setUser, loading, refetchUser: fetchUser, logout }}>
            {children}
        </userContext.Provider>
    );
}

export function useUser() {
    return useContext(userContext);
}