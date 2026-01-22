import { useBlogs } from "@/hooks/useBlogs";
import { BlogCard } from "@/components/BlogCard";
import { BlogCardSkeleton } from "@/components/BlogSkeleton";
import { AlertCircle, FileText } from "lucide-react";

interface BlogListProps {
    selectedBlogId: string | null;
    onSelectBlog: (id: string) => void;
}

export function BlogList({ selectedBlogId, onSelectBlog }: BlogListProps) {
    const { data: blogs, isLoading, isError, error } = useBlogs();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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

    if (!blogs || blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
        <div className="space-y-4">
            {blogs.map((blog) => (
                <BlogCard
                    key={blog.id}
                    blog={blog}
                    isSelected={selectedBlogId === blog.id}
                    onClick={() => onSelectBlog(blog.id)}
                />
            ))}
        </div>
    );
}
