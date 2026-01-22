import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div
                className="bg-[hsl(var(--card))] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-[hsl(var(--border))]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                        {title}
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                        {description}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
