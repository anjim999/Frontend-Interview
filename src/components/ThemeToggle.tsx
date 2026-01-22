import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            <Sun
                className={`h-5 w-5 transition-all duration-300 ${theme === "dark"
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    }`}
            />
            <Moon
                className={`absolute h-5 w-5 transition-all duration-300 ${theme === "dark"
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                    }`}
            />
        </Button>
    );
}
