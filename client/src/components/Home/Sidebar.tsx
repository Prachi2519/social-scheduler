import { NavLink } from "react-router-dom";
import { BotIcon, CalendarDaysIcon, LayoutDashboardIcon, LinkIcon, LogOutIcon, XIcon } from "lucide-react";

type SidebarProps = {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
};

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { to: "/accounts", label: "Accounts", icon: LinkIcon },
  { to: "/scheduler", label: "Scheduler", icon: CalendarDaysIcon },
  { to: "/ai-composer", label: "AI Composer", icon: BotIcon },
];

export default function Sidebar({ isMobileMenuOpen = false, onCloseMobileMenu }: SidebarProps) {
  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onCloseMobileMenu}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-200 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-8 flex items-center justify-between gap-2 px-2">
          <NavLink to="/" className="flex items-center gap-2" onClick={onCloseMobileMenu}>
            <img src="/logo.svg" alt="Scheduler" className="size-7" />
            <span className="text-xl font-semibold">Scheduler</span>
          </NavLink>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={onCloseMobileMenu}
            aria-label="Close navigation"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobileMenu}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/login"
          onClick={onCloseMobileMenu}
          className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </NavLink>
      </aside>
    </>
  );
}
