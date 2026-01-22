import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs, fetchBlogById, createBlog } from "@/lib/api";
import type { CreateBlogInput } from "@/types/blog";

// Query keys for cache management
export const blogKeys = {
    all: ["blogs"] as const,
    detail: (id: string) => ["blogs", id] as const,
};

// Hook to fetch all blogs
export function useBlogs() {
    return useQuery({
        queryKey: blogKeys.all,
        queryFn: fetchBlogs,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to fetch a single blog by ID
export function useBlog(id: string | null) {
    return useQuery({
        queryKey: blogKeys.detail(id ?? ""),
        queryFn: () => fetchBlogById(id!),
        enabled: !!id, // Only fetch when id is provided
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to create a new blog
export function useCreateBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (blog: CreateBlogInput) => createBlog(blog),
        onSuccess: () => {
            // Invalidate and refetch blogs list
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        },
    });
}
// Hook to update a blog
export function useUpdateBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<import('@/types/blog').Blog> }) => {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
            const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update blog");
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
            queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.id) });
        },
    });
}

// Hook to delete a blog
export function useDeleteBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
            const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete blog");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
        },
    });
}
