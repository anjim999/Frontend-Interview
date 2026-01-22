import { BookOpen } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 text-white shadow-lg">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--muted-foreground))] bg-clip-text text-transparent">
                            CA Monk Blog
                        </h1>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Finance, Tech & Career Insights
                        </p>
                    </div>
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                    Empowering CA Professionals
                </div>
            </div>
        </header>
    );
}
