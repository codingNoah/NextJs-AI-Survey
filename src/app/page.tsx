"use client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  console.log(session, "data");
  return <Index />;
}
