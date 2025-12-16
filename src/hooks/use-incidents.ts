import { useState, useEffect } from "react";

export interface Incident {
    id: string;
    type: string; // mapped from categories e.g. "Hate Speech"
    severity: "none" | "low" | "medium" | "high" | "critical";
    platform: string;
    content: string;
    detectedAt: string;
    status: "pending" | "reported" | "resolved";
    confidence: number;
}

const STORAGE_KEY = "cyberguard-incidents";

export const useIncidents = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setIncidents(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse incidents", e);
            }
        }
    }, []);

    const addIncident = (incident: Omit<Incident, "id" | "detectedAt" | "status">) => {
        const newIncident: Incident = {
            ...incident,
            id: `INC-${Date.now().toString().slice(-6)}`,
            detectedAt: new Date().toLocaleString(),
            status: "pending",
        };

        setIncidents((prev) => {
            const updated = [newIncident, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newIncident;
    };

    const clearIncidents = () => {
        setIncidents([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        incidents,
        addIncident,
        clearIncidents,
    };
};
