// app/providers.tsx
"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {children}
        <Toaster />
        <Sonner />
      </SidebarProvider>
    </TooltipProvider>
  );
}
