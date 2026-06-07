import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  PlugZapIcon,
  WandSparklesIcon,
} from "lucide-react";

const steps = [
  {
    description:
      "Authorize each profile once and keep channel health visible on the Accounts screen.",
    icon: PlugZapIcon,
    step: "01",
    title: "Connect channels",
  },
  {
    description:
      "Write manually or ask AI for caption ideas, image direction, and hashtags.",
    icon: WandSparklesIcon,
    step: "02",
    title: "Create content",
  },
  {
    description:
      "Choose the channels, confirm media rules, and place the post into the queue.",
    icon: CalendarCheckIcon,
    step: "03",
    title: "Schedule confidently",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[var(--paper-warm)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-300/70 bg-white/55 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
              <CheckCircleIcon className="size-3.5 text-[var(--mint)]" />
              Workflow
            </div>
            <h2 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
              One clean loop from connection to calendar.
            </h2>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <article
                key={step.step}
                className="grid gap-4 rounded-lg border border-stone-300/70 bg-white/65 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="surface-inverse flex size-12 items-center justify-center rounded-lg">
                  <step.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-400">
                    {step.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 ? (
                  <ArrowRightIcon className="hidden size-5 text-stone-300 sm:block" />
                ) : (
                  <CheckCircleIcon className="hidden size-5 text-[var(--mint)] sm:block" />
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
