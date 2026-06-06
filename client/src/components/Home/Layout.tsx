import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useAuth } from "../../context/AuthContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/scheduler": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname.toLowerCase()] ?? "SocialAI";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-slate-950">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-56">
        <header className="sticky top-0 z-10 flex h-[58px] items-center gap-4 border-b border-slate-200/80 bg-white px-4 sm:px-6 md:px-7">
          <button
            type="button"
            className="-ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon className="size-6" />
          </button>

          <div>
            <h1 className="text-[15px] font-semibold text-slate-950">{title}</h1>
            <p className="hidden text-sm text-slate-400 sm:block">
              Manage and automate your social presence
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
