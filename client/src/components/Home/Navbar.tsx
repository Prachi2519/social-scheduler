import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="chrome-surface sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => scrollTo(0, 0)}
          className="group flex items-center gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-stone-950 transition group-hover:-translate-y-0.5">
            <img src="/logo.svg" alt="Scheduler" className="size-5" />
          </span>
          <span className="text-xl font-semibold text-stone-950">
            Scheduler
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-stone-500 md:flex">
          <a href="#features" className="hover:text-stone-950">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-stone-950">
            Workflow
          </a>
          <a href="#pricing" className="hover:text-stone-950">
            Pricing
          </a>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="surface-inverse focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              Dashboard <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-stone-600 hover:text-stone-950 sm:block"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--coral)] px-4 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(239,93,79,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--coral-dark)]"
            >
              Get started <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
