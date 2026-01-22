import { FileText, TrendingUp } from "lucide-react";

interface BlogStatsProps {
    totalBlogs: number;
    filteredBlogs: number;
}

export function BlogStats({ totalBlogs, filteredBlogs }: BlogStatsProps) {
    const isFiltered = filteredBlogs !== totalBlogs;

    return (
        <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>
                    {isFiltered ? (
                        <>
                            <span className="font-medium text-[hsl(var(--foreground))]">{filteredBlogs}</span>
                            {" of "}
                            {totalBlogs}
                        </>
                    ) : (
                        <>
                            <span className="font-medium text-[hsl(var(--foreground))]">{totalBlogs}</span>
                            {" blogs"}
                        </>
                    )}
                </span>
            </div>
            {isFiltered && (
                <div className="flex items-center gap-1 text-[hsl(var(--primary))]">
                    <TrendingUp className="h-3 w-3" />
                    <span>Filtered</span>
                </div>
            )}
        </div>
    );
}
