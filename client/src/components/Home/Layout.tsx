import { useState } from "react";
import {
  ArrowUpRightIcon,
  CheckCircle2Icon,
  MenuIcon,
  RadioIcon,
  SparklesIcon,
} from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

const pageMeta: Record<string, { title: string; kicker: string }> = {
  "/dashboard": {
    title: "Command Center",
    kicker: "Today’s publishing rhythm",
  },
  "/accounts": {
    title: "Channel Studio",
    kicker: "Connection health and reach",
  },
  "/scheduler": {
    title: "Content Planner",
    kicker: "Compose, preview, and ship",
  },
  "/ai-composer": {
    title: "AI Creative Desk",
    kicker: "Prompt to campaign-ready drafts",
  },
};

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const meta =
    pageMeta[location.pathname.toLowerCase()] ?? {
      title: "SocialAI",
      kicker: "Unified publishing workspace",
    };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="app-surface flex h-screen items-center justify-center">
        <div className="panel flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-stone-700">
          <div className="size-5 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
          Opening workspace
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-surface flex min-h-screen text-stone-950">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="chrome-surface sticky top-0 z-20 border-b px-4 sm:px-6 md:px-8">
          <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center gap-4">
            <button
              type="button"
              className="focus-ring -ml-2 rounded-lg p-2 text-stone-500 transition hover:bg-stone-950/5 hover:text-stone-950 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <MenuIcon className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase text-stone-500">
                <RadioIcon className="size-3.5 text-[var(--mint)]" />
                {meta.kicker}
              </p>
              <h1 className="truncate text-xl font-semibold text-stone-950 sm:text-2xl">
                {meta.title}
              </h1>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="header-status rounded-lg border border-stone-200 bg-white/70 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-stone-400">
                  Queue
                </p>
                <p className="text-sm font-semibold text-stone-800">
                  Synced now
                </p>
              </div>
              <div className="header-status rounded-lg border border-stone-200 bg-white/70 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-stone-400">
                  Channels
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                  <CheckCircle2Icon className="size-3.5 text-[var(--mint)]" />
                  4 ready
                </p>
              </div>
              <Link
                to="/ai-composer"
                className="header-create surface-inverse focus-ring inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-[0_12px_24px_rgba(23,21,19,0.18)] transition hover:-translate-y-0.5"
              >
                <SparklesIcon className="size-4 text-[#ffd36e]" />
                Create
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
