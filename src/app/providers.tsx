"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactNode, useState } from "react";
import { ScrollProvider } from "@/providers/ScrollProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingWrapper } from "@/providers/LoadingProvider";
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <LoadingWrapper>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeProvider defaultTheme="dark" storageKey="survey-ai-theme">
              <ScrollProvider>
                <Toaster />
                <Sonner />
                {children}
              </ScrollProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </LoadingWrapper>
    </SessionProvider>
  );
}
