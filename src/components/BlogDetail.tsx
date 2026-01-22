import { useBlog, useDeleteBlog } from "@/hooks/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogDetailSkeleton } from "@/components/BlogSkeleton";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Calendar, Clock, AlertCircle, Share2, BookOpen, ArrowUp, Trash2, PenLine } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BlogForm } from "./BlogForm";
import { ConfirmationModal } from "./ConfirmationModal";

interface BlogDetailProps {
    blogId: string | null;
    onDelete?: () => void;
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

export function BlogDetail({ blogId, onDelete }: BlogDetailProps) {
    const { data: blog, isLoading, isError, error } = useBlog(blogId);
    const deleteBlog = useDeleteBlog();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Reset image loaded state when blog changes
    // Handle scroll to show/hide scroll-to-top button
    useEffect(() => {
        const container = document.getElementById("blog-detail-container");
        if (!container) return;

        const handleScroll = () => {
            setShowScrollTop(container.scrollTop > 300);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        const container = document.getElementById("blog-detail-container");
        container?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (!blogId) return;

        try {
            await deleteBlog.mutateAsync(blogId);
            toast.success("Blog deleted successfully");
            setIsDeleteOpen(false);
            if (onDelete) onDelete();
        } catch {
            toast.error("Failed to delete blog");
        }
    };

    const handleShare = async () => {
        if (!blog) return;

        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    if (!blogId) {
        return null;
    }

    if (isLoading) {
        return <BlogDetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
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
    const wordCount = blog.content.trim().split(/\s+/).length;

    return (
        <article className="animate-fade-in relative">
            {/* Cover Image */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-xl mb-6 -mx-6 -mt-6">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-shimmer bg-[hsl(var(--muted))]" />
                )}
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                        onClick={handleShare}
                    >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <PenLine className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90 text-white border-0"
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {blog.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant="secondary"
                                className="bg-white/20 backdrop-blur-sm text-white border-0"
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                        {blog.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6 px-0">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-[hsl(var(--border))]">
                    <div className="flex gap-2">
                        {blog.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className={categoryColors[cat] || "bg-gray-500/10 text-gray-600 border-gray-500/20"}
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
                        <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {wordCount.toLocaleString()} words
                        </div>
                    </div>
                </div>

                {/* Description */}
                <blockquote className="text-lg text-[hsl(var(--muted-foreground))] italic border-l-4 border-[hsl(var(--primary))] pl-4 py-2 bg-[hsl(var(--primary))]/5 rounded-r-lg">
                    {blog.description}
                </blockquote>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                    {blog.content.split("\n\n").map((paragraph, index) => (
                        <p
                            key={index}
                            className="mb-4 leading-relaxed text-[hsl(var(--foreground))] animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags/Categories at bottom */}
                <div className="pt-6 border-t border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between flex-wrap gap-4">
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
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Article
                        </Button>
                    </div>
                </div>

                {/* Article stats */}
                <div className="flex items-center justify-center gap-6 py-4 bg-[hsl(var(--muted))]/50 rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                    <div className="text-center">
                        <p className="font-semibold text-[hsl(var(--foreground))]">{readingTime}</p>
                        <p className="text-xs">min read</p>
                    </div>
                    <div className="w-px h-8 bg-[hsl(var(--border))]" />
                    <div className="text-center">
                        <p className="font-semibold text-[hsl(var(--foreground))]">{wordCount.toLocaleString()}</p>
                        <p className="text-xs">words</p>
                    </div>
                    <div className="w-px h-8 bg-[hsl(var(--border))]" />
                    <div className="text-center">
                        <p className="font-semibold text-[hsl(var(--foreground))]">{blog.category.length}</p>
                        <p className="text-xs">categories</p>
                    </div>
                </div>
            </div>

            {/* Scroll to top button */}
            {showScrollTop && (
                <Button
                    variant="secondary"
                    size="icon"
                    className="fixed bottom-6 right-6 rounded-full shadow-lg animate-fade-in z-40"
                    onClick={scrollToTop}
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>
            )}

            {/* Edit Modal */}
            {isEditOpen && blog && (
                <BlogForm
                    blog={blog}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={() => {
                        setIsEditOpen(false);
                    }}
                />
            )}

            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Blog Post?"
                description="Are you sure you want to delete this blog? This action cannot be undone."
                isLoading={deleteBlog.isPending}
            />
        </article>
    );
}
