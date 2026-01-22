import type { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
    blog: Blog;
    isSelected: boolean;
    onClick: () => void;
    searchQuery?: string;
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
    FINANCE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    TECH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    CAREER: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    EDUCATION: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    REGULATIONS: "bg-red-500/10 text-red-600 border-red-500/20",
    LIFESTYLE: "bg-pink-500/10 text-pink-600 border-pink-500/20",
};

// Highlight search matches in text
function highlightText(text: string, query?: string): React.ReactNode {
    if (!query || !query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

export function BlogCard({ blog, isSelected, onClick, searchQuery }: BlogCardProps) {
    const readingTime = getReadingTime(blog.content);

    return (
        <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group ${isSelected
                ? "ring-2 ring-[hsl(var(--primary))] shadow-lg border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                : "hover:border-[hsl(var(--primary))]/50"
                }`}
            onClick={onClick}
        >
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1.5 flex-wrap">
                            {blog.category.slice(0, 2).map((cat) => (
                                <Badge
                                    key={cat}
                                    variant="outline"
                                    className={`text-[10px] font-medium px-2 py-0.5 ${categoryColors[cat] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                        }`}
                                >
                                    {cat}
                                </Badge>
                            ))}
                            {blog.category.length > 2 && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                    +{blog.category.length - 2}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))] shrink-0">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime}m
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(blog.date)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 px-4">
                <h3 className="font-semibold text-base mb-1.5 line-clamp-2 text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                    {highlightText(blog.title, searchQuery)}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {highlightText(blog.description, searchQuery)}
                </p>
            </CardContent>


        </Card>
    );
}
