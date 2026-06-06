import { useEffect, useState } from "react";
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, XIcon } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import toast from "react-hot-toast";
import api from "../api/axios";

const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

const channels = [
  { id: "twitter", label: "Twitter / X", icon: SiX },
  { id: "linkedin", label: "LinkedIn", iconText: "in" },
  { id: "facebook", label: "Facebook", icon: SiFacebook },
  { id: "instagram", label: "Instagram", icon: SiInstagram },
];

interface Generation {
  _id: string;
  createdAt?: string;
  prompt: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  tone?: string;
}

const getErrorMessage = (error: any, fallback: string) => {
  const message = error?.response?.data?.message || error?.message;

  if (typeof message !== "string") return fallback;

  try {
    const parsed = JSON.parse(message);
    return parsed?.error?.message || parsed?.message || fallback;
  } catch {
    if (message.includes("503") || message.toLowerCase().includes("high demand")) {
      return "AI generation is busy right now. Please wait a moment and try again.";
    }

    return message || fallback;
  }
};

export default function AIComposer() {
  const [idea, setIdea] = useState("");
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [generationToSchedule, setGenerationToSchedule] = useState<Generation | null>(null);
  const [selectedChannels, setSelectedChannels] = useState(["linkedin", "facebook", "instagram"]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSchedulingGeneration, setIsSchedulingGeneration] = useState(false);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setRecentGenerations(data);
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to load generations"));
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (!idea.trim()) {
      toast.error("Enter an idea first");
      return;
    }

    setIsGenerating(true);
    setGeneratedPost("");

    try {
      const { data } = await api.post("/api/posts/generate", {
        prompt: idea,
        tone: selectedTone,
        generateImage,
      });
      setGeneratedPost(data.content);
      await fetchGenerations();
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to generate post"));
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((selected) =>
      selected.includes(channel) ? selected.filter((item) => item !== channel) : [...selected, channel],
    );
  };

  const handleScheduleGeneration = async () => {
    if (isSchedulingGeneration) return;

    if (!generationToSchedule) return;

    if (selectedChannels.length === 0) {
      toast.error("Select at least one channel");
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      toast.error("Select date and time");
      return;
    }

    if (selectedChannels.includes("instagram") && !generationToSchedule.mediaUrl) {
      toast.error("Instagram requires an image or video");
      return;
    }

    setIsSchedulingGeneration(true);

    try {
      await api.post("/api/posts", {
        content: generationToSchedule.content,
        platforms: selectedChannels,
        scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString(),
        status: "scheduled",
        mediaUrl: generationToSchedule.mediaUrl,
        mediaType: generationToSchedule.mediaType,
      });

      toast.success("Post scheduled!");
      setGenerationToSchedule(null);
      setScheduleDate("");
      setScheduleTime("");
      setSelectedChannels(["linkedin", "facebook", "instagram"]);
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to schedule post"));
    } finally {
      setIsSchedulingGeneration(false);
    }
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
          <p className="text-base font-medium text-slate-500">{recentGenerations.length} total</p>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="mt-7 flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center text-sm font-medium text-slate-400">
            No recent generations yet
          </div>
        ) : (
        <div className="mt-7 grid items-stretch gap-8 md:grid-cols-3">
          {recentGenerations.map((generation) => (
            <article
              key={generation._id}
              className="flex h-full flex-col rounded-2xl border border-transparent bg-white p-6 text-left shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-400">
                  {generation.createdAt ? new Date(generation.createdAt).toLocaleString() : ""}
                </span>
                <span className="rounded-md bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-500">
                  {generation.tone || "Professional"}
                </span>
              </div>

              <p className="mt-6 line-clamp-4 min-h-28 text-base font-medium leading-7 text-slate-600">{generation.content}</p>

              {generation.mediaUrl && (
                <img
                  src={generation.mediaUrl}
                  alt=""
                  className="mt-6 aspect-[16/9] w-full rounded-xl object-cover"
                />
              )}

              {!generation.mediaUrl && (
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
        )}
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
              {generationToSchedule.mediaUrl && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <img src={generationToSchedule.mediaUrl} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
                </div>
              )}

              <div className={generationToSchedule.mediaUrl ? "mt-5 rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium text-slate-800" : "rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium text-slate-800"}>
                {generationToSchedule.prompt}
              </div>

              <div className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 px-7 py-8 text-base font-medium leading-8 text-slate-800">
                {generationToSchedule.content}
              </div>

              {!generationToSchedule.mediaUrl && (
                <div className="mt-5 flex h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm font-medium text-slate-400">
                  No media attached
                </div>
              )}

              <div className="mt-9">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Select Channels</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {channels.map(({ id, label, icon: Icon, iconText }) => {
                    const isSelected = selectedChannels.includes(id);

                    return (
                      <button
                        key={id}
                        type="button"
                        className={[
                          "flex size-12 items-center justify-center rounded-lg border transition",
                          isSelected
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50",
                        ].join(" ")}
                        onClick={() => toggleChannel(id)}
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
