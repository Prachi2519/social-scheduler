import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  RadioTowerIcon,
  SparklesIcon,
} from "lucide-react";
import imgOne from "../../assets/img-1.jpg";
import imgTwo from "../../assets/img-2.jpg";
import imgThree from "../../assets/img-3.jpg";

const week = [
  { day: "Mon", label: "Launch", tone: "bg-[var(--coral)]" },
  { day: "Tue", label: "Hiring", tone: "bg-[var(--sky)]" },
  { day: "Wed", label: "Reel", tone: "bg-[var(--mint)]" },
  { day: "Thu", label: "Thread", tone: "bg-[var(--amber)]" },
  { day: "Fri", label: "Recap", tone: "bg-[var(--lilac)]" },
];

export default function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-7rem)] overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:42px_42px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,21,19,0.94)_0%,rgba(23,21,19,0.72)_42%,rgba(23,21,19,0.36)_100%)]" />
      </div>

      <div className="absolute inset-y-0 right-8 hidden w-[50%] min-w-[690px] py-10 opacity-90 lg:block">
        <div className="grid h-full grid-cols-[0.82fr_1fr_0.72fr] gap-4">
          <div className="flex flex-col justify-center gap-4">
            <div className="micro-float rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase text-white/45">
                Queue health
              </p>
              <p className="mt-2 text-4xl font-semibold">92</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[92%] rounded-full bg-[#9be7cf]" />
              </div>
            </div>
            <img
              src={imgOne}
              alt=""
              className="h-60 rounded-lg object-cover shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
            />
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClockIcon className="size-4 text-[#ffd36e]" />
                  <p className="text-sm font-semibold">Publishing week</p>
                </div>
                <span className="text-xs font-semibold text-white/45">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {week.map((item) => (
                  <div key={item.day} className="rounded-lg bg-white/10 p-2">
                    <p className="text-xs font-semibold text-white/45">
                      {item.day}
                    </p>
                    <div className={`mt-8 h-1.5 rounded-full ${item.tone}`} />
                    <p className="mt-2 truncate text-xs font-semibold">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src={imgTwo}
                alt=""
                className="h-52 rounded-lg object-cover shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
              />
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <SparklesIcon className="size-5 text-[#c9b6ff]" />
                <p className="mt-16 text-sm font-semibold leading-6">
                  AI drafts tuned for every channel.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <img
              src={imgThree}
              alt=""
              className="h-56 rounded-lg object-cover shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
            />
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <RadioTowerIcon className="size-4 text-[#9be7cf]" />
                <p className="text-sm font-semibold">4 channels connected</p>
              </div>
              <div className="mt-4 space-y-2">
                {["LinkedIn", "Instagram", "Facebook"].map((channel) => (
                  <div
                    key={channel}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-white/75">
                      {channel}
                    </span>
                    <CheckCircle2Icon className="size-4 text-[#9be7cf]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <img
        src={imgOne}
        alt=""
        className="absolute bottom-14 right-4 h-44 w-44 rounded-lg object-cover opacity-20 lg:hidden"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase text-white/75 backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-[#ffd36e]" />
            AI social media scheduler
          </div>

          <h1 className="text-6xl font-semibold leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
            Scheduler
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
            Plan, generate, preview, and publish social content from one
            editorial command center built for creators, founders, and teams.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-6 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(239,93,79,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--coral-dark)]"
            >
              Start scheduling <ArrowRightIcon className="size-4" />
            </Link>
            <a
              href="#features"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Explore features
            </a>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              ["18", "queued posts"],
              ["4", "channels"],
              ["2m", "sync time"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs font-semibold text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
