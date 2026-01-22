import { useState } from "react";
import { useCreateBlog } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import type { CreateBlogInput } from "@/types/blog";

interface BlogFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AVAILABLE_CATEGORIES = [
    "FINANCE",
    "TECH",
    "CAREER",
    "EDUCATION",
    "REGULATIONS",
    "LIFESTYLE",
];

export function BlogForm({ onClose, onSuccess }: BlogFormProps) {
    const [formData, setFormData] = useState<CreateBlogInput>({
        title: "",
        category: [],
        description: "",
        coverImage: "",
        content: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const createBlog = useCreateBlog();

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (formData.category.length === 0) {
            newErrors.category = "Select at least one category";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }
        if (!formData.coverImage.trim()) {
            newErrors.coverImage = "Cover image URL is required";
        }
        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createBlog.mutateAsync(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create blog:", error);
        }
    };

    const toggleCategory = (category: string) => {
        setFormData((prev) => ({
            ...prev,
            category: prev.category.includes(category)
                ? prev.category.filter((c) => c !== category)
                : [...prev.category, category],
        }));
        setErrors((prev) => ({ ...prev, category: "" }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[hsl(var(--card))] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
                    <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                        Create New Blog
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, title: e.target.value }));
                                setErrors((prev) => ({ ...prev, title: "" }));
                            }}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        <Label>Categories *</Label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_CATEGORIES.map((category) => (
                                <Badge
                                    key={category}
                                    variant={formData.category.includes(category) ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${formData.category.includes(category)
                                        ? "bg-[hsl(var(--primary))]"
                                        : "hover:bg-[hsl(var(--primary))]/10"
                                        }`}
                                    onClick={() => toggleCategory(category)}
                                >
                                    {formData.category.includes(category) ? (
                                        <X className="h-3 w-3 mr-1" />
                                    ) : (
                                        <Plus className="h-3 w-3 mr-1" />
                                    )}
                                    {category}
                                </Badge>
                            ))}
                        </div>
                        {errors.category && (
                            <p className="text-xs text-red-500">{errors.category}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="A brief summary of your blog"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, description: e.target.value }));
                                setErrors((prev) => ({ ...prev, description: "" }));
                            }}
                            className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image URL *</Label>
                        <Input
                            id="coverImage"
                            placeholder="https://example.com/image.jpg"
                            value={formData.coverImage}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, coverImage: e.target.value }));
                                setErrors((prev) => ({ ...prev, coverImage: "" }));
                            }}
                            className={errors.coverImage ? "border-red-500" : ""}
                        />
                        {errors.coverImage && (
                            <p className="text-xs text-red-500">{errors.coverImage}</p>
                        )}
                        {formData.coverImage && !errors.coverImage && (
                            <div className="mt-2 rounded-lg overflow-hidden h-32">
                                <img
                                    src={formData.coverImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your blog content here..."
                            value={formData.content}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, content: e.target.value }));
                                setErrors((prev) => ({ ...prev, content: "" }));
                            }}
                            className={`min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-500">{errors.content}</p>
                        )}
                    </div>

                    {/* Error message */}
                    {createBlog.isError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-sm text-red-500">
                                Failed to create blog. Please try again.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createBlog.isPending}>
                            {createBlog.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Blog
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
