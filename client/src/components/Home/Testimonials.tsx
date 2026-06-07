import { StarIcon } from "lucide-react";

const testimonials = [
  {
    avatar: "S",
    quote:
      "Scheduler turned our weekly content meeting into a 20-minute queue review. The preview and channel checks save us from last-minute mistakes.",
    role: "Marketing Manager",
    tone: "bg-[var(--coral)]",
    user: "Sarah K.",
  },
  {
    avatar: "M",
    quote:
      "The AI desk gives me enough strong drafts to keep posting without sounding like every other creator in the feed.",
    role: "Indie Creator",
    tone: "bg-[var(--lilac)]",
    user: "Marcus L.",
  },
  {
    avatar: "P",
    quote:
      "I can finally see what is connected, what is scheduled, and what needs attention before anything goes live.",
    role: "Startup Founder",
    tone: "bg-[var(--mint)]",
    user: "Priya D.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--paper)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
              <StarIcon className="size-3.5 text-[#d89414]" />
              Teams and creators
            </div>
            <h2 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              Built for people who publish often.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-stone-600">
            A calmer workspace for busy feeds, campaign launches, and recurring
            content operations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.user}
              className="lift-card rounded-lg border border-stone-200 bg-white/80 p-5"
            >
              <p className="min-h-36 text-base font-medium leading-7 text-stone-700">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg text-sm font-semibold text-white ${testimonial.tone}`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-950">
                    {testimonial.user}
                  </p>
                  <p className="text-xs font-medium text-stone-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
