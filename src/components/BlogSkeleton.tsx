import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BlogCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-5 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    );
}

export function BlogDetailSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4 p-6">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}
