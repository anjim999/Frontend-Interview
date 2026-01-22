import { useBlog } from "@/hooks/useBlogs";
import { Badge } from "@/components/ui/badge";
import { BlogDetailSkeleton } from "@/components/BlogSkeleton";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface BlogDetailProps {
    blogId: string | null;
}

export function BlogDetail({ blogId }: BlogDetailProps) {
    const { data: blog, isLoading, isError, error } = useBlog(blogId);

    // Color mapping for categories
    const categoryColors: Record<string, string> = {
        FINANCE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        TECH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        CAREER: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        EDUCATION: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        REGULATIONS: "bg-red-500/10 text-red-600 border-red-500/20",
        LIFESTYLE: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    };

    if (!blogId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 p-8 mb-6">
                    <div className="text-6xl">📖</div>
                </div>
                <h3 className="font-semibold text-xl mb-2 text-[hsl(var(--foreground))]">
                    Select a blog to read
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] max-w-sm">
                    Choose a blog from the list on the left to view its full content here
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <BlogDetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="rounded-full bg-red-500/10 p-4 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Failed to load blog</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {error instanceof Error ? error.message : "An unexpected error occurred"}
                </p>
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    const readingTime = getReadingTime(blog.content);

    return (
        <article className="animate-fade-in">
            {/* Cover Image */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-xl mb-6">
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))] leading-tight">
                    {blog.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-2">
                        {blog.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className={`${categoryColors[cat] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                    }`}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(blog.date)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {readingTime} min read
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-lg text-[hsl(var(--muted-foreground))] italic border-l-4 border-[hsl(var(--primary))] pl-4">
                    {blog.description}
                </p>

                {/* Divider */}
                <hr className="border-[hsl(var(--border))]" />

                {/* Main Content */}
                <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                    {blog.content.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags/Categories at bottom */}
                <div className="pt-6 border-t border-[hsl(var(--border))]">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Tags:</span>
                        {blog.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant="secondary"
                                className="text-xs"
                            >
                                #{cat.toLowerCase()}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
