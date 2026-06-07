import { NavLink } from "react-router-dom";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  RadioTowerIcon,
  SparklesIcon,
  UsersIcon,
  WandSparklesIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const links = [
  { to: "/dashboard", label: "Command", icon: LayoutDashboardIcon },
  { to: "/accounts", label: "Channels", icon: UsersIcon },
  { to: "/scheduler", label: "Planner", icon: CalendarDaysIcon },
  { to: "/ai-composer", label: "AI Desk", icon: WandSparklesIcon },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { logout, user } = useAuth();
  const displayName = user?.name || "Prachi Gupta";
  const displayEmail = user?.email || "prachi639220@gmail.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="mobile-nav-overlay fixed inset-0 z-30 bg-stone-950/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`chrome-surface fixed inset-y-0 left-0 z-40 flex h-full w-64 transform flex-col border-r px-3 py-4 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <NavLink
            to="/"
            className="focus-ring logo-lockup group flex items-center gap-3 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <span className="surface-inverse relative flex size-10 items-center justify-center rounded-lg shadow-[0_10px_22px_rgba(23,21,19,0.16)] transition group-hover:-translate-y-0.5">
              <img src="/logo.svg" alt="Scheduler logo" className="size-5" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[var(--surface)] bg-[var(--mint)]" />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none text-stone-950">
                Scheduler
              </span>
              <span className="text-xs font-medium text-stone-500">
                Social operations
              </span>
            </span>
          </NavLink>

          <button
            type="button"
            className="focus-ring rounded-lg p-2 text-stone-500 transition hover:bg-stone-950/5 hover:text-stone-950 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="flow-score-card panel mb-4 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-stone-400">
                Flow score
              </p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">92</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#e9f8f2] text-[var(--mint)]">
              <RadioTowerIcon className="size-5" />
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200">
            <div className="flow-score-bar h-full w-[92%] rounded-full bg-[var(--mint)]" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-stone-500">
              4 channels ready for publishing
            </p>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e9f8f2] px-1.5 py-1 text-[11px] font-semibold text-[var(--mint)]">
              <CheckCircle2Icon className="size-3" />
              Ready
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {["X", "in", "f", "ig"].map((label) => (
              <span
                key={label}
                className="rounded-md border border-stone-200 bg-white/70 py-1 text-center text-[10px] font-bold text-stone-500"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-3 pb-2 text-[11px] font-semibold uppercase text-stone-400">
          Workspace
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  "sidebar-link focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "sidebar-link--active surface-inverse shadow-[0_12px_24px_rgba(23,21,19,0.14)]"
                    : "text-stone-600 hover:bg-white/70 hover:text-stone-950",
                ].join(" ")
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span
                    className={[
                      "flex size-8 items-center justify-center rounded-lg transition",
                      isActive
                        ? "inverse-icon"
                        : "bg-stone-950/5 text-stone-500 group-hover:text-stone-950",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                  {isActive ? (
                    <SparklesIcon className="ml-auto size-4 text-[#ffd36e]" />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card panel rounded-lg p-3">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--coral)] text-sm font-semibold text-white">
              {initial}
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[var(--surface)] bg-[var(--mint)]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-950">
                {displayName}
              </p>
              <p className="truncate text-xs text-stone-500">{displayEmail}</p>
            </div>
          </div>

          <NavLink
            to="/login"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="focus-ring flex h-10 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white/70 text-sm font-semibold text-stone-600 transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </NavLink>
        </div>
      </aside>
    </>
  );
}
