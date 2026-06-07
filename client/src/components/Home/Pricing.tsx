import { CheckIcon, CircleCheckBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    cta: "Get started free",
    description:
      "A compact workspace for creators validating their publishing rhythm.",
    features: [
      "2 social accounts",
      "10 scheduled posts/month",
      "5 AI credits/month",
      "Basic command dashboard",
    ],
    highlight: false,
    name: "Starter",
    period: "",
    price: "Free",
  },
  {
    cta: "Start Pro",
    description:
      "More queue depth, more AI help, and no friction for regular publishing.",
    features: [
      "Unlimited accounts",
      "Unlimited scheduling",
      "200 AI credits/month",
      "Priority support",
    ],
    highlight: true,
    name: "Pro",
    period: "/month",
    price: "$29",
  },
  {
    cta: "Contact sales",
    description:
      "Team-ready controls for agencies and brands managing many calendars.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Unlimited AI credits",
      "Custom AI personas",
      "Dedicated support",
    ],
    highlight: false,
    name: "Agency",
    period: "/month",
    price: "$79",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[var(--paper-warm)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-300/70 bg-white/55 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
            <CircleCheckBigIcon className="size-3.5 text-[var(--mint)]" />
            Pricing
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            Start small, scale when the calendar gets serious.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "lift-card flex rounded-lg border p-5",
                plan.highlight
                  ? "surface-inverse border-stone-950"
                  : "border-stone-300/70 bg-white/70 text-stone-950",
              ].join(" ")}
            >
              <div className="flex w-full flex-col">
                <div>
                  <div
                    className={[
                      "text-sm font-semibold",
                      plan.highlight ? "text-[#ffd36e]" : "text-[var(--coral)]",
                    ].join(" ")}
                  >
                    {plan.name}
                  </div>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span
                      className={[
                        "mb-1.5 text-sm",
                        plan.highlight ? "text-white/55" : "text-stone-500",
                      ].join(" ")}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={[
                      "mt-3 text-sm leading-6",
                      plan.highlight ? "text-white/68" : "text-stone-600",
                    ].join(" ")}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div
                        className={[
                          "flex size-5 shrink-0 items-center justify-center rounded-md",
                          plan.highlight
                            ? "bg-white/15 text-white"
                            : "bg-[#e9f8f2] text-[var(--mint)]",
                        ].join(" ")}
                      >
                        <CheckIcon className="size-3" />
                      </div>
                      <span
                        className={
                          plan.highlight ? "text-white/82" : "text-stone-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={[
                    "focus-ring mt-8 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition hover:-translate-y-0.5",
                    plan.highlight
                      ? "bg-white text-stone-950 hover:bg-[#fff8ec]"
                      : "bg-[var(--coral)] text-white hover:bg-[var(--coral-dark)]",
                  ].join(" ")}
                >
                  {plan.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
