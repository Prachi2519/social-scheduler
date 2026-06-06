import { NavLink } from "react-router-dom";
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
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
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { to: "/accounts", label: "Accounts", icon: UsersIcon },
  { to: "/scheduler", label: "Scheduler", icon: CalendarDaysIcon },
  { to: "/ai-composer", label: "AI Composer", icon: WandSparklesIcon },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { logout, user } = useAuth();
  const fallbackName = "Prachi Gupta";
  const displayName = user?.name || fallbackName;
  const displayEmail = user?.email || "prachi639220@gmail.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-56 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-6 pt-7">
          <NavLink
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <img src="/logo.svg" alt="Logo" className="size-5" />
            <span className="text-lg font-semibold text-slate-950">
              Scheduler
            </span>
          </NavLink>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="px-6 pb-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Menu
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              {({ isActive }: { isActive: boolean }) =>
                (
                  <>
                    <Icon className="size-4" />
                    {label}
                    {isActive ? (
                      <span className="absolute right-3 h-5 w-1 rounded-full bg-red-500" />
                    ) : null}
                  </>
                )
              }
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-400 text-sm font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-400">{displayEmail}</p>
            </div>
          </div>

          <NavLink
            to="/login"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 rounded-lg px-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </NavLink>
        </div>
      </aside>
    </>
  );
}
