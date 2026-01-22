import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CategoryFilterProps {
    categories: string[];
    selectedCategories: string[];
    onToggle: (category: string) => void;
    onClear: () => void;
}

const categoryColors: Record<string, string> = {
    FINANCE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
    TECH: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
    CAREER: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20",
    EDUCATION: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
    REGULATIONS: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
    LIFESTYLE: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20",
};

export function CategoryFilter({
    categories,
    selectedCategories,
    onToggle,
    onClear,
}: CategoryFilterProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Filter by Category
                </span>
                {selectedCategories.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
                    >
                        <X className="h-3 w-3" />
                        Clear
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                        <Badge
                            key={category}
                            variant="outline"
                            className={`cursor-pointer transition-all text-xs ${categoryColors[category] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                } ${isSelected
                                    ? "ring-2 ring-[hsl(var(--primary))] ring-offset-1"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                            onClick={() => onToggle(category)}
                        >
                            {category}
                            {isSelected && <X className="h-3 w-3 ml-1" />}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}
