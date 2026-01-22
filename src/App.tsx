import { useState } from "react";
import { Header } from "@/components/Header";
import { BlogList } from "@/components/BlogList";
import { BlogDetail } from "@/components/BlogDetail";
import { BlogForm } from "@/components/BlogForm";
import { Button } from "@/components/ui/button";
import { Plus, PenLine } from "lucide-react";
import "./index.css";

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Blog List */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    Latest Articles
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Browse our collection
                  </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Blog
                </Button>
              </div>

              {/* Blog List - Scrollable */}
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 space-y-4">
                <BlogList
                  selectedBlogId={selectedBlogId}
                  onSelectBlog={setSelectedBlogId}
                />
              </div>
            </div>
          </aside>

          {/* Right Panel - Blog Detail */}
          <section className="lg:col-span-7 xl:col-span-8">
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-sm min-h-[calc(100vh-180px)]">
              {selectedBlogId ? (
                <div className="p-6">
                  <BlogDetail blogId={selectedBlogId} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-8">
                  <div className="rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 p-8 mb-6">
                    <PenLine className="h-12 w-12 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="font-semibold text-2xl mb-3 text-[hsl(var(--foreground))]">
                    Welcome to CA Monk Blog
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-6">
                    Select an article from the list to read its content, or create a new blog to share your insights with the community.
                  </p>
                  <Button onClick={() => setIsFormOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Blog
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Create Blog Modal */}
      {isFormOpen && (
        <BlogForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            // Optionally select the new blog
          }}
        />
      )}
    </div>
  );
}

export default App;
