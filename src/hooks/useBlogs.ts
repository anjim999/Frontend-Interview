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
