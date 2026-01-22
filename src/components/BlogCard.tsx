import type { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface BlogCardProps {
    blog: Blog;
    isSelected: boolean;
    onClick: () => void;
}

export function BlogCard({ blog, isSelected, onClick }: BlogCardProps) {
    // Color mapping for categories
    const categoryColors: Record<string, string> = {
        FINANCE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        TECH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        CAREER: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        EDUCATION: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        REGULATIONS: "bg-red-500/10 text-red-600 border-red-500/20",
        LIFESTYLE: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    };

    return (
        <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isSelected
                ? "ring-2 ring-[hsl(var(--primary))] shadow-lg border-[hsl(var(--primary))]"
                : "hover:border-[hsl(var(--primary))]/50"
                }`}
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex gap-2 flex-wrap">
                        {blog.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className={`text-xs font-medium ${categoryColors[cat] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                    }`}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.date)}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-[hsl(var(--foreground))]">
                    {blog.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {blog.description}
                </p>
            </CardContent>
        </Card>
    );
}
