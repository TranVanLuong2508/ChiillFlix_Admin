// app/providers.tsx
"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";

const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Use state to prevent QueryClient re-creation on render
  const [client] = useState(queryClient);

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <SidebarProvider>
          {children}
          <Toaster />
          <Sonner />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
