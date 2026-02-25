'use client'
import { useIsMobile } from "@/hooks/use-mobile";

export const MobileWarning = () => {
    const isMobile = useIsMobile();

    if (!isMobile) return;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-background border rounded-lg p-6 max-w-sm text-center space-y-4">
                <h2 className="text-xl font-semibold">Desktop Only</h2>
                <p className="text-muted-foreground">This website is optimized for desktop devices and doesn&apos;t support mobile phones.</p>
                <p className="text-sm text-muted-foreground">Please visit us on a desktop or laptop computer.</p>
            </div>
        </div>
    );
};