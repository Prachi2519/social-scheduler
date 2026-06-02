import { useState } from "react";
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, XIcon } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import img1 from "../assets/img-1.jpg";
import img2 from "../assets/img-2.jpg";
import img3 from "../assets/img-3.jpg";
import img4 from "../assets/img-4.jpg";

const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

const channels = [
  { label: "Twitter / X", icon: SiX },
  { label: "LinkedIn", iconText: "in" },
  { label: "Facebook", icon: SiFacebook },
  { label: "Instagram", icon: SiInstagram },
];

const recentGenerations = [
  {
    date: "5/13/2026, 2:34:07 PM",
    prompt: "create a post for Job Hiring for Data Analyst",
    content:
      "Exciting Opportunity: Data Analyst!\n\nAre you a highly analytical professional passionate about transforming complex data into strategic insights? We're looking for a talented and experienced Data Analyst to join our innovative team and drive data-driven decisions.\n\nIn this role, you will leverage your expertise in SQL, Python/R, and cutting-edge data visualization tools to uncover key trends, build insightful reports, and inform critical business strategies.",
    image: img1,
  },
  {
    date: "5/13/2026, 1:55:53 PM",
    prompt: 'Post for launching a new "AI Web Development Course"',
    content: "Announcing the Future of Web Development! We are thrilled to launch our brand new AI Web Development Course, designed to equip you with the cutting-edge skills needed to thrive in the era of artificial intelligence.",
    image: img2,
  },
  {
    date: "5/12/2026, 6:55:32 PM",
    prompt: "Write a post about inflation in India in 2026.",
    content: "As we approach 2026, understanding India's inflation trajectory remains paramount for economic stability and growth. Projections suggest continued influence from global supply chain dynamics, energy costs, and robust domestic demand.",
    image: img3,
  },
  {
    date: "5/12/2026, 6:47:55 PM",
    prompt: "Create a post for launching a new shoes with comet design in white",
    content:
      "Introducing the 'Astral White' - our revolutionary new footwear that redefines modern elegance. Crafted in pristine white, these sneakers feature an innovative comet-inspired design, symbolizing dynamic movement and groundbreaking style.",
    image: img4,
  },
  {
    date: "5/12/2026, 6:43:59 PM",
    prompt: "Create a post for launching a new shoes with comet design",
    content:
      "We are thrilled to unveil our latest footwear innovation: The AstraGlide Collection. Inspired by the captivating velocity and radiant trails of comets, this collection merges groundbreaking design with superior craftsmanship. Experience a shoe engineered for dynamic performance and an aesthetic that transcends the ordinary. Elevate your journey and...",
  },
  {
    date: "5/12/2026, 1:01:33 PM",
    prompt: 'a post for my yt video "How to create a Grocery Delivery MERN Project"',
    content:
      "New YouTube Tutorial Alert! Elevate your full-stack development skills with our latest video: \"How to create a Grocery Delivery MERN Project.\" Learn to build a robust, real-world application from scratch using MongoDB, Express.js, React, and Node.js. In this comprehensive guide, you'll gain practical skills in: Database Schema Design RESTful...",
  },
  {
    date: "5/12/2026, 11:55:19 AM",
    prompt: "create a post for ai course",
    content:
      "Unlock your potential in the rapidly evolving world of Artificial Intelligence with practical projects, clear examples, and professional guidance...",
  },
  {
    date: "5/11/2026, 5:56:09 PM",
    prompt: "A post about greeting follower on social media",
    content:
      "A warm welcome to all our new and existing followers. We are delighted to have you join our professional community...",
  },
  {
    date: "5/11/2026, 5:24:05 PM",
    prompt: "create a post a about AI now a days",
    content:
      "Artificial Intelligence is no longer a futuristic concept; it's a transformative force reshaping our world today...",
  },
];

type Generation = (typeof recentGenerations)[number];

export default function AIComposer() {
  const [idea, setIdea] = useState("");
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [generationToSchedule, setGenerationToSchedule] = useState<Generation | null>(null);
  const [selectedChannels, setSelectedChannels] = useState(["LinkedIn", "Facebook", "Instagram"]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSchedulingGeneration, setIsSchedulingGeneration] = useState(false);

  const handleGenerate = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGeneratedPost("");

    window.setTimeout(() => {
      const subject = idea.trim() || "your next social media campaign";
      setGeneratedPost(
        `Here's a ${selectedTone.toLowerCase()} post idea for ${subject}: introduce the story with a strong hook, highlight the value for your audience, and close with a clear call to action.`,
      );
      setIsGenerating(false);
    }, 1200);
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((selected) =>
      selected.includes(channel) ? selected.filter((item) => item !== channel) : [...selected, channel],
    );
  };

  const handleScheduleGeneration = () => {
    if (isSchedulingGeneration) return;

    setIsSchedulingGeneration(true);
    window.setTimeout(() => setIsSchedulingGeneration(false), 2000);
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center py-20">
      <h2 className="text-center text-4xl font-semibold text-slate-950">What should we create today?</h2>

      <div className="mt-14 w-full max-w-6xl rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
          className="h-48 w-full resize-none rounded-t-2xl bg-transparent px-8 py-7 text-lg font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />

        <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2">
            <span className="text-sm font-semibold text-slate-800">AI Image</span>
            <button
              type="button"
              className={[
                "relative h-7 w-12 rounded-full transition",
                generateImage ? "bg-red-500" : "bg-slate-300",
              ].join(" ")}
              onClick={() => setGenerateImage((enabled) => !enabled)}
              aria-pressed={generateImage}
              aria-label="Toggle AI image generation"
            >
              <span
                className={[
                  "absolute top-1 size-5 rounded-full bg-white shadow-sm transition",
                  generateImage ? "left-6" : "left-1",
                ].join(" ")}
              />
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-80"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2Icon className="size-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate
                <ArrowRightIcon className="size-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        {tones.map((tone) => (
          <button
            key={tone}
            type="button"
            className={[
              "h-11 rounded-full border px-6 text-sm font-semibold transition",
              selectedTone === tone
                ? "border-red-500 bg-red-500 text-white shadow-sm shadow-red-500/25"
                : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-500",
            ].join(" ")}
            onClick={() => setSelectedTone(tone)}
          >
            {tone}
          </button>
        ))}
      </div>

      {generatedPost && (
        <div className="mt-8 w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-slate-400">Generated Post</p>
          <p className="mt-3 text-base font-medium leading-7 text-slate-700">{generatedPost}</p>
          {generateImage && <p className="mt-4 text-sm font-medium text-rose-500">AI image prompt included.</p>}
        </div>
      )}

      <div className="mt-24 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HistoryIcon className="size-6 text-slate-500" />
            <h3 className="text-2xl font-semibold text-slate-700">Recent Generations</h3>
          </div>
          <p className="text-base font-medium text-slate-500">9 total</p>
        </div>

        <div className="mt-7 grid items-stretch gap-8 md:grid-cols-3">
          {recentGenerations.map((generation) => (
            <article
              key={generation.date}
              className="flex h-full flex-col rounded-2xl border border-transparent bg-white p-6 text-left shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-400">{generation.date}</span>
                <span className="rounded-md bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-500">Professional</span>
              </div>

              <p className="mt-6 line-clamp-4 min-h-28 text-base font-medium leading-7 text-slate-600">{generation.content}</p>

              {generation.image && (
                <img
                  src={generation.image}
                  alt=""
                  className="mt-6 aspect-[16/9] w-full rounded-xl object-cover"
                />
              )}

              {!generation.image && (
                <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center text-sm font-medium text-slate-400">
                  Text-only generation
                </div>
              )}

              <button
                type="button"
                className="mt-6 h-12 w-full rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 transition hover:bg-red-500 hover:text-white hover:shadow-sm hover:shadow-red-500/25 focus-visible:bg-red-500 focus-visible:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 active:scale-[0.99]"
                onClick={() => setGenerationToSchedule(generation)}
              >
                Schedule Post
              </button>
            </article>
          ))}
        </div>
      </div>

      {generationToSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
              <h2 className="text-xl font-semibold text-slate-950">Schedule Generation</h2>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setGenerationToSchedule(null)}
                aria-label="Close schedule generation"
              >
                <XIcon className="size-6" />
              </button>
            </div>

            <div className="overflow-y-auto px-7 py-8">
              {generationToSchedule.image && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <img src={generationToSchedule.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
                </div>
              )}

              <div className={generationToSchedule.image ? "mt-5 rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium text-slate-800" : "rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium text-slate-800"}>
                {generationToSchedule.prompt}
              </div>

              <div className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium leading-8 text-slate-800">
                {generationToSchedule.content}
              </div>

              {!generationToSchedule.image && (
                <div className="mt-5 flex h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm font-medium text-slate-400">
                  No media attached
                </div>
              )}

              <div className="mt-9">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Select Channels</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {channels.map(({ label, icon: Icon, iconText }) => {
                    const isSelected = selectedChannels.includes(label);

                    return (
                      <button
                        key={label}
                        type="button"
                        className={[
                          "flex size-12 items-center justify-center rounded-lg border transition",
                          isSelected
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50",
                        ].join(" ")}
                        onClick={() => toggleChannel(label)}
                        aria-label={label}
                      >
                        {Icon ? <Icon className="size-6" /> : <span className="text-xl font-bold leading-none">{iconText}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                    className="h-14 w-full rounded-xl border border-slate-100 bg-slate-50 pl-12 pr-4 text-base font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                <div className="relative">
                  <ClockIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                    className="h-14 w-full rounded-xl border border-slate-100 bg-slate-50 pl-12 pr-4 text-base font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>
              </div>

              <button
                type="button"
                className={[
                  "mt-8 inline-flex h-16 w-full items-center justify-center gap-3 rounded-lg text-lg font-semibold shadow-sm transition",
                  scheduleDate && scheduleTime && selectedChannels.length > 0
                    ? "bg-red-500 text-white shadow-red-500/25 hover:bg-red-600"
                    : "bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white hover:shadow-red-500/25",
                ].join(" ")}
                onClick={handleScheduleGeneration}
                aria-disabled={!scheduleDate || !scheduleTime || selectedChannels.length === 0}
              >
                <TimerIcon className={["size-5", isSchedulingGeneration ? "animate-spin" : ""].join(" ")} />
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
