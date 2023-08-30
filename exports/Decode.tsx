import jwt_decode from "jwt-decode";
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getToken from "./getToken";

export async function Deccode() {
    const userToken = await AsyncStorage.getItem('token') || null;

    if (!userToken) {
        throw new Error("Token não encontrado no AsyncStorage");
    }
    return jwt_decode(String(userToken));
}

export function removeToken() {
    return AsyncStorage.removeItem('token');
}

export function UserDataLoader({ children }) {
    const [userData, setUserData] = useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            const retrievedToken = await getToken();
            setUserData(retrievedToken);
        };

        fetchData();
    }, []);

    return children(userData);
}
