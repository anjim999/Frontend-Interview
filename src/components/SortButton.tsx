import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortOrder = "newest" | "oldest" | "title";

interface SortButtonProps {
    sortOrder: SortOrder;
    onSort: (order: SortOrder) => void;
}

export function SortButton({ sortOrder, onSort }: SortButtonProps) {
    const cycleSort = () => {
        if (sortOrder === "newest") onSort("oldest");
        else if (sortOrder === "oldest") onSort("title");
        else onSort("newest");
    };

    const getIcon = () => {
        if (sortOrder === "newest") return <ArrowDown className="h-4 w-4" />;
        if (sortOrder === "oldest") return <ArrowUp className="h-4 w-4" />;
        return <ArrowUpDown className="h-4 w-4" />;
    };

    const getLabel = () => {
        if (sortOrder === "newest") return "Newest";
        if (sortOrder === "oldest") return "Oldest";
        return "A-Z";
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={cycleSort}
            className="gap-1 text-xs"
        >
            {getIcon()}
            {getLabel()}
        </Button>
    );
}
