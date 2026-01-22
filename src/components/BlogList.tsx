import type { Blog } from "@/types/blog";
import { BlogCard } from "@/components/BlogCard";
import { BlogCardSkeleton } from "@/components/BlogSkeleton";
import { AlertCircle, FileText, SearchX } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";

interface BlogListProps {
    blogs: Blog[];
    selectedBlogId: string | null;
    onSelectBlog: (id: string) => void;
    searchQuery?: string;
}

export function BlogList({ blogs, selectedBlogId, onSelectBlog, searchQuery }: BlogListProps) {
    const { isLoading, isError, error } = useBlogs();

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`animate-fade-in stagger-${i + 1}`}>
                        <BlogCardSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="rounded-full bg-red-500/10 p-4 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Failed to load blogs</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm">
                    {error instanceof Error ? error.message : "An unexpected error occurred"}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                    Make sure the JSON server is running on port 3001
                </p>
            </div>
        );
    }

    if (blogs.length === 0 && searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="rounded-full bg-[hsl(var(--muted))] p-4 mb-4">
                    <SearchX className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No results found</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No blogs match "{searchQuery}"
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="rounded-full bg-[hsl(var(--muted))] p-4 mb-4">
                    <FileText className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No blogs yet</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Create your first blog to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 px-2 py-2">
            {blogs.map((blog, index) => (
                <div
                    key={blog.id}
                    className={`animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <BlogCard
                        blog={blog}
                        isSelected={selectedBlogId === blog.id}
                        onClick={() => onSelectBlog(blog.id)}
                        searchQuery={searchQuery}
                    />
                </div>
            ))}
        </div>
    );
}
