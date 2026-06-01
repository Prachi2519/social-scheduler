import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/scheduler": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname.toLowerCase()] ?? "Dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-950">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 md:px-8">
          <button
            type="button"
            className="-ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon className="size-6" />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="hidden text-sm text-slate-400 sm:block">Manage and automate your social presence</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
