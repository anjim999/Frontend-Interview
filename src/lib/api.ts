import type { Blog, CreateBlogInput } from "@/types/blog";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchBlogs(): Promise<Blog[]> {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    if (!response.ok) {
        throw new Error("Failed to fetch blogs");
    }
    return response.json();
}

export async function fetchBlogById(id: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch blog");
    }
    return response.json();
}

export async function createBlog(blog: CreateBlogInput): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...blog,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to create blog");
    }
    return response.json();
}
