import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { BlogList } from "@/components/BlogList";
import { BlogDetail } from "@/components/BlogDetail";
import { BlogForm } from "@/components/BlogForm";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortButton, type SortOrder } from "@/components/SortButton";
import { BlogStats } from "@/components/BlogStats";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useBlogs";
import { useDebounce, useLocalStorage, useReadingProgress } from "@/hooks/useAdvanced";
import { useTheme } from "@/context/ThemeContext";
import { Plus, PenLine, Sparkles } from "lucide-react";
// Toast import removed
import "./index.css";

function App() {
  // State management
  const [selectedBlogId, setSelectedBlogId] = useLocalStorage<string | null>("selectedBlogId", null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Refs for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { data: blogs = [] } = useBlogs();
  const debouncedSearch = useDebounce(searchQuery, 300);
  const readingProgress = useReadingProgress();
  const { toggleTheme } = useTheme();

  // Get all unique categories from blogs
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    blogs.forEach((blog) => {
      blog.category.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [blogs]);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.description.toLowerCase().includes(searchLower) ||
          blog.content.toLowerCase().includes(searchLower) ||
          blog.category.some((cat) => cat.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((blog) =>
        selectedCategories.some((cat) => blog.category.includes(cat))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [blogs, debouncedSearch, selectedCategories, sortOrder]);

  // Category toggle handler
  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K - Focus search
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Ctrl + N - New blog
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        setIsFormOpen(true);
      }

      // Ctrl + D - Toggle dark mode
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        toggleTheme();
      }

      // Escape - Close form or clear search
      if (e.key === "Escape") {
        if (isFormOpen) {
          setIsFormOpen(false);
        } else if (searchQuery) {
          setSearchQuery("");
        }
      }

      // Arrow navigation for blogs
      if ((e.key === "ArrowUp" || e.key === "ArrowDown") && filteredBlogs.length > 0) {
        e.preventDefault();
        const currentIndex = filteredBlogs.findIndex((b) => b.id === selectedBlogId);

        if (e.key === "ArrowDown") {
          const nextIndex = currentIndex < filteredBlogs.length - 1 ? currentIndex + 1 : 0;
          setSelectedBlogId(filteredBlogs[nextIndex].id);
        } else {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredBlogs.length - 1;
          setSelectedBlogId(filteredBlogs[prevIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen, searchQuery, filteredBlogs, selectedBlogId, setSelectedBlogId, toggleTheme]);

  // Handle blog creation success
  const handleBlogCreated = () => {
    // Toast is handled in BlogForm
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] transition-colors duration-300">
      {/* Reading Progress Bar */}
      {selectedBlogId && <ReadingProgress progress={readingProgress} />}

      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Blog List */}
          <aside className="lg:col-span-5 xl:col-span-4 pl-4 md:pl-2">
            <div className="sticky top-20 space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
                    Latest Articles
                    <Sparkles className="h-4 w-4 text-[hsl(var(--primary))] animate-pulse-slow" />
                  </h2>
                  <BlogStats totalBlogs={blogs.length} filteredBlogs={filteredBlogs.length} />
                </div>
                <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              </div>

              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search blogs... (Ctrl+K)"
              />

              {/* Category Filter */}
              <CategoryFilter
                categories={allCategories}
                selectedCategories={selectedCategories}
                onToggle={handleCategoryToggle}
                onClear={() => setSelectedCategories([])}
              />

              {/* Sort Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {filteredBlogs.length} result{filteredBlogs.length !== 1 ? "s" : ""}
                </span>
                <SortButton sortOrder={sortOrder} onSort={setSortOrder} />
              </div>

              {/* Blog List - Scrollable */}
              <div className="max-h-[calc(100vh-380px)] overflow-y-auto space-y-3">
                <BlogList
                  blogs={filteredBlogs}
                  selectedBlogId={selectedBlogId}
                  onSelectBlog={setSelectedBlogId}
                  searchQuery={debouncedSearch}
                />
              </div>
            </div>
          </aside>

          {/* Right Panel - Blog Detail */}
          <section className="lg:col-span-7 xl:col-span-8">
            <div
              id="blog-detail-container"
              className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm min-h-[calc(100vh-180px)] max-h-[calc(100vh-120px)] overflow-y-auto transition-all duration-300"
            >
              {selectedBlogId ? (
                <div className="p-6 animate-fade-in">
                  <BlogDetail
                    key={selectedBlogId}
                    blogId={selectedBlogId}
                    onDelete={() => setSelectedBlogId(null)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-8">
                  <div className="rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 p-8 mb-6 animate-bounce-slow">
                    <PenLine className="h-12 w-12 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="font-semibold text-2xl mb-3 text-[hsl(var(--foreground))]">
                    Welcome to CA Monk Blog
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-6">
                    Select an article from the list to read its content, or create a new blog to share your insights with the community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setIsFormOpen(true)} variant="default">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Blog
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => filteredBlogs[0] && setSelectedBlogId(filteredBlogs[0].id)}
                      disabled={filteredBlogs.length === 0}
                    >
                      Read First Article
                    </Button>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-6">
                    💡 Tip: Use <kbd className="px-1.5 py-0.5 bg-[hsl(var(--muted))] rounded text-xs">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[hsl(var(--muted))] rounded text-xs">↓</kbd> to navigate blogs
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
          <p>Built with ❤️ using React, TypeScript, TanStack Query, Tailwind CSS & shadcn/ui</p>
          <p className="mt-1 text-xs">© 2026 CA Monk Blog. All rights reserved.</p>
        </div>
      </footer>

      {/* Create Blog Modal */}
      {isFormOpen && (
        <BlogForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleBlogCreated}
        />
      )}
    </div>
  );
}

export default App;
