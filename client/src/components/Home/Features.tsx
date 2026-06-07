import {
  BarChart3Icon,
  CalendarDaysIcon,
  HashIcon,
  Share2Icon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

const features = [
  {
    accent: "bg-[#fff1de] text-[var(--amber)]",
    description:
      "Queue posts across platforms with date, time, media, and channel rules in one pass.",
    icon: CalendarDaysIcon,
    title: "Visual scheduling",
  },
  {
    accent: "bg-[#f1edff] text-[var(--lilac)]",
    description:
      "Generate captions and creative direction from a brief, then keep the strongest drafts.",
    icon: Wand2Icon,
    title: "AI creative desk",
  },
  {
    accent: "bg-[#e9f8f2] text-[var(--mint)]",
    description:
      "Track scheduled, published, and account activity without digging through tabs.",
    icon: BarChart3Icon,
    title: "Command dashboard",
  },
  {
    accent: "bg-[#edf4ff] text-[var(--sky)]",
    description:
      "Connect LinkedIn, Facebook, Instagram, and X into a single planning workspace.",
    icon: Share2Icon,
    title: "Multi-channel publishing",
  },
  {
    accent: "bg-[#ffeceb] text-[var(--coral)]",
    description:
      "Move from idea to ready post quickly with clear validation before anything ships.",
    icon: ZapIcon,
    title: "Fast publishing flow",
  },
  {
    accent: "surface-inverse",
    description:
      "Shape every post with stronger hashtags, tighter tone, and channel-aware copy.",
    icon: HashIcon,
    title: "Reach helpers",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-[var(--paper)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
            <ZapIcon className="size-3.5 text-[var(--coral)]" />
            Product system
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            Everything your social calendar needs to feel under control.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
            Scheduler blends creation, queue health, and account readiness into
            a workspace that is easy to scan and hard to lose track of.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="lift-card rounded-lg border border-stone-200 bg-white/80 p-5"
            >
              <div
                className={`mb-5 flex size-11 items-center justify-center rounded-lg ${feature.accent}`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
