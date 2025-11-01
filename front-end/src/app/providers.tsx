"use client";
import { AuthProvider } from "@/src/app/contexts/AuthContext";
import { ThemeProvider } from "@/src/app/contexts/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}