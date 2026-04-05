"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gray-50">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onNavigate={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-green-700">OnlyCampus</p>
            <p className="truncate text-[11px] text-gray-500">IERT Portal</p>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
