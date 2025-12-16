import { useState, useEffect } from "react";

const STORAGE_KEY = "cyberguard-settings";

interface Settings {
    enableHateSpeech: boolean;
    enableThreat: boolean;
    enableHarassment: boolean;
    enableToxic: boolean;
    sensitivity: number;
}

const defaultSettings: Settings = {
    enableHateSpeech: true,
    enableThreat: true,
    enableHarassment: true,
    enableToxic: true,
    sensitivity: 3,
};

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return {
        settings,
        updateSettings,
    };
};
