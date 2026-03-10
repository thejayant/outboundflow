"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "18px",
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--foreground)",
        },
      }}
    />
  );
}
