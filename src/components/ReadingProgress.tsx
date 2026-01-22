interface ReadingProgressProps {
    progress: number;
}

export function ReadingProgress({ progress }: ReadingProgressProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[hsl(var(--muted))]">
            <div
                className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
