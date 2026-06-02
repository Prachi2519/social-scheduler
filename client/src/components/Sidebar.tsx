import { NavLink } from "react-router-dom";
import { CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, UsersIcon, WandSparklesIcon, XIcon } from "lucide-react";

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
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <NavLink to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <img src="/logo.svg" alt="Logo" className="size-6" />
            <span className="text-xl font-semibold text-slate-950">Scheduler</span>
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

        <nav className="flex-1 space-y-1 px-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-red-50 text-red-600 shadow-sm shadow-red-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-5 flex items-center gap-3 px-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-400 text-sm font-semibold text-white">
              P
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Prachi Gupta</p>
              <p className="truncate text-xs text-slate-400">prachi639220@gmail.com</p>
            </div>
          </div>

          <NavLink
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </NavLink>
        </div>
      </aside>
    </>
  );
}
