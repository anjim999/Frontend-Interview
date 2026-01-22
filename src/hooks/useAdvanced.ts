import { useState, useEffect, useCallback } from "react";

// Hook for localStorage persistence
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

// Hook for keyboard shortcuts
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { ctrl = false, shift = false, alt = false } = modifiers;

            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                event.ctrlKey === ctrl &&
                event.shiftKey === shift &&
                event.altKey === alt
            ) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [key, callback, modifiers]);
}

// Hook for debounced search
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Hook for reading progress
export function useReadingProgress() {
    const [progress, setProgress] = useState(0);

    const handleScroll = useCallback(() => {
        const scrollContainer = document.getElementById("blog-detail-container");
        if (!scrollContainer) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const windowHeight = scrollHeight - clientHeight;
        const scrollProgress = (scrollTop / windowHeight) * 100;

        setProgress(Math.min(100, Math.max(0, scrollProgress)));
    }, []);

    useEffect(() => {
        const scrollContainer = document.getElementById("blog-detail-container");
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            return () => scrollContainer.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    return progress;
}
