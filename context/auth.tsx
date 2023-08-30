import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner, { BiometryType, FingerprintScannerError } from 'react-native-fingerprint-scanner';

interface AuthContextType {
    isFingerprintEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const FingerprintProvider: React.FC = ({ children }) => {
    const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

    useEffect(() => {
        checkFingerprintAvailability();
    }, []);

    const checkFingerprintAvailability = async () => {
        try {
            const biometryType: BiometryType = await FingerprintScanner.isSensorAvailable();

            if (biometryType !== 'None') {
                setIsFingerprintEnabled(true);
            }
        } catch (error) {
            console.error('Error checking fingerprint availability:', error);
        }
    };

    const authenticateFingerprint = () => {
        FingerprintScanner.authenticate({
            title: 'Authenticate to enable fingerprint',
        })
            .then(() => {
                setIsFingerprintEnabled(true);
                AsyncStorage.setItem('isFingerprintEnabled', 'true');
            })
            .catch((error: FingerprintScannerError) => {
                console.error('Fingerprint authentication error:', error);
            });
    };

    return (
        <AuthContext.Provider value={{ isFingerprintEnabled, authenticateFingerprint }}>
            {children}
        </AuthContext.Provider>
    );
};
