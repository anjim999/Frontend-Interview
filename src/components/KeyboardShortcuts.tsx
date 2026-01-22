import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    const shortcuts = [
        { keys: ["Ctrl", "K"], description: "Focus search" },
        { keys: ["Ctrl", "N"], description: "Create new blog" },
        { keys: ["↑", "↓"], description: "Navigate blogs" },
        { keys: ["Enter"], description: "Select blog" },
        { keys: ["Esc"], description: "Close modal/clear" },
        { keys: ["Ctrl", "D"], description: "Toggle dark mode" },
    ];

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                title="Keyboard shortcuts"
            >
                <Keyboard className="h-5 w-5" />
            </Button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-[hsl(var(--card))] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Keyboard className="h-5 w-5 text-[hsl(var(--primary))]" />
                            <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
                        </div>
                        <div className="space-y-3">
                            {shortcuts.map((shortcut, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-[hsl(var(--muted-foreground))]">
                                        {shortcut.description}
                                    </span>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((key, i) => (
                                            <kbd
                                                key={i}
                                                className="px-2 py-1 bg-[hsl(var(--muted))] rounded text-xs font-mono"
                                            >
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-4 text-center">
                            Press <kbd className="px-1 bg-[hsl(var(--muted))] rounded text-xs">Esc</kbd> to close
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
