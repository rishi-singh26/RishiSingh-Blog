import { create } from 'zustand'

type AppStore = {
    darkMode: boolean,
    toggleThemeMode: () => void,
    setDarkMode: () => void,
    setLightMode: () => void,
}

export const useAppStore = create<AppStore>()((set) => ({
    darkMode: false,
    toggleThemeMode: () => set((state) => ({ darkMode: !state.darkMode })),
    setDarkMode: () => set((state) => ({ darkMode: true })),
    setLightMode: () => set((state) => ({ darkMode: false })),
}))