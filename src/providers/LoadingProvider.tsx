"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
