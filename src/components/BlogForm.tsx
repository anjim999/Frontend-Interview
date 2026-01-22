import { useState } from "react";
import { useCreateBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, ImageIcon, FileText, Tag, PenLine } from "lucide-react";
import type { CreateBlogInput, Blog } from "@/types/blog";
import toast from "react-hot-toast";

// Duplicate interface removed

const AVAILABLE_CATEGORIES = [
    "FINANCE",
    "TECH",
    "CAREER",
    "EDUCATION",
    "REGULATIONS",
    "LIFESTYLE",
];

const categoryColors: Record<string, string> = {
    FINANCE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
    TECH: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
    CAREER: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20",
    EDUCATION: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
    REGULATIONS: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
    LIFESTYLE: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20",
};

interface BlogFormProps {
    onClose: () => void;
    onSuccess: () => void;
    blog?: Blog; // Optional blog for editing
}

// ... imports and constants remain the same ...

export function BlogForm({ onClose, onSuccess, blog }: BlogFormProps) {
    const [formData, setFormData] = useState<CreateBlogInput>({
        title: blog?.title || "",
        category: blog?.category || [],
        description: blog?.description || "",
        coverImage: blog?.coverImage || "",
        content: blog?.content || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadMode, setUploadMode] = useState<"url" | "file">("url");

    const createBlog = useCreateBlog();
    const updateBlog = useUpdateBlog();
    const isEditing = !!blog;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        if (formData.category.length === 0) {
            newErrors.category = "Select at least one category";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length < 20) {
            newErrors.description = "Description must be at least 20 characters";
        }

        if (!formData.coverImage.trim()) {
            newErrors.coverImage = "Cover image is required";
        } else if (uploadMode === "url" && !formData.coverImage.startsWith("http")) {
            newErrors.coverImage = "Enter a valid URL starting with http";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        } else if (formData.content.length < 50) {
            newErrors.content = "Content must be at least 50 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the form errors");
            return;
        }

        try {
            if (isEditing && blog) {
                await updateBlog.mutateAsync({ id: blog.id, data: formData });
                toast.success("Blog updated successfully! 🎉");
            } else {
                await createBlog.mutateAsync(formData);
                toast.success("Blog created successfully! 🎉");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(isEditing ? "Failed to update blog" : "Failed to create blog");
            console.error("Operation failed:", error);
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

    const handleInputChange = (field: keyof CreateBlogInput, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));

        if (field === "coverImage") {
            // Reset image state if needed
        }
    };

    // Character count helpers
    const charCount = {
        title: formData.title.length,
        description: formData.description.length,
        content: formData.content.length,
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-[hsl(var(--card))] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[hsl(var(--primary))]/10">
                            <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                                {isEditing ? "Edit Blog" : "Create New Blog"}
                            </h2>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {isEditing ? "Update your article content" : "Share your knowledge with the community"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Title */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="title">Title *</Label>
                            <span className={`text-xs ${charCount.title < 5 ? "text-red-500" : "text-[hsl(var(--muted-foreground))]"}`}>
                                {charCount.title}/100
                            </span>
                        </div>
                        <Input
                            id="title"
                            placeholder="Enter an engaging blog title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className={errors.title ? "border-red-500 focus:ring-red-500" : ""}
                            maxLength={100}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <X className="h-3 w-3" />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            <Label>Categories * <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">(select up to 3)</span></Label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_CATEGORIES.map((category) => {
                                const isSelected = formData.category.includes(category);
                                const isDisabled = !isSelected && formData.category.length >= 3;

                                return (
                                    <Badge
                                        key={category}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer transition-all ${isDisabled ? "opacity-40 cursor-not-allowed" : ""
                                            } ${isSelected
                                                ? "bg-[hsl(var(--primary))] text-white"
                                                : categoryColors[category]
                                            }`}
                                        onClick={() => !isDisabled && toggleCategory(category)}
                                    >
                                        {isSelected ? (
                                            <X className="h-3 w-3 mr-1" />
                                        ) : (
                                            <Plus className="h-3 w-3 mr-1" />
                                        )}
                                        {category}
                                    </Badge>
                                );
                            })}
                        </div>
                        {errors.category && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <X className="h-3 w-3" />
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description">Description *</Label>
                            <span className={`text-xs ${charCount.description < 20 ? "text-red-500" : "text-[hsl(var(--muted-foreground))]"}`}>
                                {charCount.description}/200
                            </span>
                        </div>
                        <Textarea
                            id="description"
                            placeholder="Write a brief summary that captures the essence of your blog"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className={`min-h-[80px] resize-none ${errors.description ? "border-red-500" : ""}`}
                            maxLength={200}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <X className="h-3 w-3" />
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Cover Image *</Label>
                            <div className="flex bg-[hsl(var(--muted))] p-1 rounded-lg">
                                <button
                                    type="button"
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === "url"
                                        ? "bg-[hsl(var(--background))] shadow text-[hsl(var(--foreground))]"
                                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                                        }`}
                                    onClick={() => setUploadMode("url")}
                                >
                                    URL
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === "file"
                                        ? "bg-[hsl(var(--background))] shadow text-[hsl(var(--foreground))]"
                                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                                        }`}
                                    onClick={() => setUploadMode("file")}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {uploadMode === "url" ? (
                            <Input
                                id="coverImage"
                                placeholder="https://images.pexels.com/photos/..."
                                value={formData.coverImage.startsWith("data:") ? "" : formData.coverImage}
                                onChange={(e) => handleInputChange("coverImage", e.target.value)}
                                className={errors.coverImage ? "border-red-500" : ""}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${errors.coverImage
                                        ? "border-red-500 bg-red-500/5 hover:bg-red-500/10"
                                        : "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 hover:bg-[hsl(var(--muted))]/50"
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-8 h-8 mb-2 text-[hsl(var(--muted-foreground))]" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            <span className="font-semibold text-[hsl(var(--primary))]">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                            PNG, JPG or GIF (max 2MB)
                                        </p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    toast.error("Image size must be less than 2MB");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    handleInputChange("coverImage", reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        )}

                        {errors.coverImage && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <X className="h-3 w-3" />
                                {errors.coverImage}
                            </p>
                        )}

                        {formData.coverImage && !errors.coverImage && (
                            <div className="mt-2 rounded-lg overflow-hidden h-40 bg-[hsl(var(--muted))] relative group border border-[hsl(var(--border))]">
                                <img
                                    src={formData.coverImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    onClick={() => handleInputChange("coverImage", "")}
                                    title="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="content">Content *</Label>
                            <span className={`text-xs ${charCount.content < 50 ? "text-red-500" : "text-[hsl(var(--muted-foreground))]"}`}>
                                {charCount.content} characters
                            </span>
                        </div>
                        <Textarea
                            id="content"
                            placeholder="Write your blog content here. Use paragraphs to organize your thoughts..."
                            value={formData.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            className={`min-h-[180px] ${errors.content ? "border-red-500" : ""}`}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <X className="h-3 w-3" />
                                {errors.content}
                            </p>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createBlog.isPending || updateBlog.isPending}>
                        {createBlog.isPending || updateBlog.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {isEditing ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                {isEditing ? <PenLine className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                {isEditing ? "Update Blog" : "Create Blog"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
