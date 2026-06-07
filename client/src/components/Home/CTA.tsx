import { Link } from "react-router-dom";
import { ArrowRightIcon, CalendarClockIcon } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-stone-950 py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase text-white/65">
            <CalendarClockIcon className="size-3.5 text-[#ffd36e]" />
            Ready queue
          </div>
          <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Build a calmer social calendar this week.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
            Open the workspace, connect your channels, and schedule the posts
            your audience should see next.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            to="/login"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-6 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(239,93,79,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--coral-dark)]"
          >
            Start free <ArrowRightIcon className="size-4" />
          </Link>
          <a
            href="#pricing"
            className="focus-ring inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/10 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Compare plans
          </a>
        </div>
      </div>
    </section>
  );
}
