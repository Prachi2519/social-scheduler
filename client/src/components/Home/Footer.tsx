import { Link } from "react-router-dom";

const footerLinks = {
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
  Product: ["Features", "Workflow", "Pricing", "Changelog"],
};

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              to="/"
              onClick={() => scrollTo(0, 0)}
              className="inline-flex items-center gap-3"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-stone-950">
                <img src="/logo.svg" alt="Scheduler" className="size-5" />
              </span>
              <span className="text-xl font-semibold text-stone-950">
                Scheduler
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-stone-600">
              AI-assisted social scheduling for teams that need better
              planning, cleaner previews, and fewer missed posts.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="mb-4 text-xs font-semibold uppercase text-stone-400">
                {category}
              </div>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-medium text-stone-500 hover:text-stone-950"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-stone-200 pt-6 text-xs font-medium text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Scheduler. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-stone-700">
              Privacy
            </a>
            <a href="#" className="hover:text-stone-700">
              Terms
            </a>
            <Link to="/login" className="hover:text-stone-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
