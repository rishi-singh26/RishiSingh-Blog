import { create } from 'zustand'
import { LocalStorageKeys } from '../utils/constants'

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface User {
    id: string;
    name: string;
    email: string;
    status: string;
}

const validateLocalStorageData = (data: string | null): boolean => {
    if (data === null || data === "null" || data === undefined || data === "undefined") {
        return false;
    }
    return true;
}

const isAuthenticated = (): { isValid: boolean, expiry: number | null } => {
    const accessTokenExpiry: string | null = localStorage.getItem(LocalStorageKeys.accessTokenExpiry);
    if (!validateLocalStorageData(accessTokenExpiry)) {
        return { isValid: false, expiry: null };
    }
    const validatedTokenExp: string = accessTokenExpiry ?? '';
    const parsedExpiry = parseInt(validatedTokenExp);
    if (typeof parsedExpiry !== "number" || isNaN(parsedExpiry)) {
        return { isValid: false, expiry: null };
    }
    if (new Date().getTime() >= parsedExpiry) {
        return { isValid: false, expiry: null };
    }
    return { isValid: true, expiry: parsedExpiry };
}

const getUserData = (): User | null => {
    const userDataString: string | null = localStorage.getItem(LocalStorageKeys.user);
    if (!validateLocalStorageData(userDataString)) {
        return null;
    }
    try {
        return JSON.parse(userDataString ?? '');
    } catch (error) {
        return null
    }
}

type AuthStore = {
    isAuth: boolean, // is Authorised
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    accessTokenExpiry: number | null,
    showLogoutConfirmDialog: boolean,
    setAuthenticated: (loginData: LoginResponse) => void,
    setUnAuthenticated: () => void,
    setLogoutConfirmDialog: (val: boolean) => void,
}

export const useAuthStore = create<AuthStore>()((set) => {
    const accessToken = localStorage.getItem(LocalStorageKeys.accessToken);
    const refreshToken = localStorage.getItem(LocalStorageKeys.refreshToken);
    const { isValid, expiry } = isAuthenticated();
    return {
        isAuth: isValid,
        user: getUserData(),
        accessToken,
        refreshToken,
        accessTokenExpiry: expiry,
        showLogoutConfirmDialog: false,
        setAuthenticated: (loginData: LoginResponse) => set((state) => {
            localStorage.setItem(LocalStorageKeys.accessToken, loginData.accessToken);
            localStorage.setItem(LocalStorageKeys.refreshToken, loginData.refreshToken);
            const expiryDate = new Date(new Date().getTime() + 2 * 60 * 60 * 1000).getTime();
            localStorage.setItem(LocalStorageKeys.accessTokenExpiry, expiryDate.toString());
            localStorage.setItem(LocalStorageKeys.user, JSON.stringify(loginData.user));
            return {
                isAuth: true,
                user: loginData.user,
                accessToken: loginData.accessToken,
                refreshToken: loginData.refreshToken,
                acessTokenExpiry: expiryDate
            }
        }),
        setUnAuthenticated: () => set((state) => {
            localStorage.removeItem(LocalStorageKeys.accessToken);
            localStorage.removeItem(LocalStorageKeys.refreshToken);
            localStorage.removeItem(LocalStorageKeys.accessTokenExpiry);
            localStorage.removeItem(LocalStorageKeys.user);
            return {
                isAuth: false,
                user: null,
                accessToken: null,
                refreshToken: null,
                acessTokenExpiry: null,
            }
        }),
        setLogoutConfirmDialog: (value: boolean) => set((state) => ({ ...state, showLogoutConfirmDialog: value })),
    }
})