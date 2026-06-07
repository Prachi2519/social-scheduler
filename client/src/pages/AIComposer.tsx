import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  CopyIcon,
  HistoryIcon,
  ImageIcon,
  Loader2Icon,
  SparklesIcon,
  TimerIcon,
  WandSparklesIcon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";

const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

interface Generation {
  _id: string;
  content: string;
  createdAt?: string;
  imageError?: string;
  imageStatus?: "skipped" | "generated" | "failed";
  mediaType?: string;
  mediaUrl?: string;
  prompt: string;
  tone?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const maybeError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };
  const message = maybeError.response?.data?.message || maybeError.message;

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

const formatDateTime = (value?: string) => {
  if (!value) return "";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AIComposer() {
  const [idea, setIdea] = useState("");
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(
    null,
  );
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [generationToSchedule, setGenerationToSchedule] =
    useState<Generation | null>(null);
  const [selectedChannels, setSelectedChannels] = useState([
    "linkedin",
    "facebook",
    "instagram",
  ]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSchedulingGeneration, setIsSchedulingGeneration] = useState(false);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setRecentGenerations(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load generations"));
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchGenerations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (!idea.trim()) {
      toast.error("Enter an idea first");
      return;
    }

    setIsGenerating(true);
    setCurrentGeneration(null);

    try {
      const { data } = await api.post("/api/posts/generate", {
        generateImage,
        prompt: idea,
        tone: selectedTone,
      });
      setCurrentGeneration(data);

      if (generateImage && !data.mediaUrl) {
        toast.error(
          data.imageError ||
            "Post copy was generated, but the image could not be created.",
        );
      }

      await fetchGenerations();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to generate post"));
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((selected) =>
      selected.includes(channel)
        ? selected.filter((item) => item !== channel)
        : [...selected, channel],
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
        mediaType: generationToSchedule.mediaType,
        mediaUrl: generationToSchedule.mediaUrl,
        platforms: selectedChannels,
        scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString(),
        status: "scheduled",
      });

      toast.success("Post scheduled");
      setGenerationToSchedule(null);
      setScheduleDate("");
      setScheduleTime("");
      setSelectedChannels(["linkedin", "facebook", "instagram"]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to schedule post"));
    } finally {
      setIsSchedulingGeneration(false);
    }
  };

  const latestGeneration = recentGenerations[0];
  const previewGeneration = currentGeneration || latestGeneration;
  const displayOutput = previewGeneration?.content || "";
  const displayImageUrl = previewGeneration?.mediaUrl || "";
  const previewTone =
    previewGeneration?.tone || currentGeneration?.tone || selectedTone;

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
        <div className="panel reveal-up rounded-lg p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
                <WandSparklesIcon className="size-3.5 text-[var(--lilac)]" />
                Creative desk
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-stone-950 sm:text-5xl">
                Turn a raw idea into a campaign-ready post.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                Pick a tone, request visual support, then schedule the best
                generation without leaving the desk.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white/75 p-4">
              <p className="text-sm font-semibold text-stone-500">
                Generations
              </p>
              <p className="mt-2 text-4xl font-semibold text-stone-950">
                {recentGenerations.length}
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-stone-200 bg-white/80">
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Launch idea, product update, event recap, audience insight..."
              className="focus-ring h-48 w-full resize-none rounded-t-lg bg-transparent px-5 py-5 text-lg font-medium leading-8 text-stone-800 outline-none placeholder:text-stone-400"
            />

            <div className="grid gap-4 border-t border-stone-200 px-4 py-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    className={[
                      "focus-ring h-10 rounded-lg border px-3 text-sm font-semibold transition",
                      selectedTone === tone
                        ? "surface-inverse border-stone-950"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-950",
                    ].join(" ")}
                    onClick={() => setSelectedTone(tone)}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="focus-ring flex h-11 items-center justify-between gap-3 rounded-lg border border-stone-200 bg-[#fff8ec] px-3 text-sm font-semibold text-stone-800"
                onClick={() => setGenerateImage((enabled) => !enabled)}
                aria-pressed={generateImage}
              >
                <ImageIcon className="size-4 text-[var(--amber)]" />
                AI image
                <span
                  className={[
                    "relative h-5 w-9 rounded-full transition",
                    generateImage ? "bg-[var(--coral)]" : "bg-stone-300",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-1 size-3 rounded-full bg-white transition",
                      generateImage ? "left-5" : "left-1",
                    ].join(" ")}
                  />
                </span>
              </button>

              <button
                type="button"
                className="focus-ring inline-flex h-11 min-w-40 items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-5 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(239,93,79,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--coral-dark)] disabled:translate-y-0 disabled:opacity-70"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2Icon className="size-5 animate-spin" />
                    Generating
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
        </div>

        <div className="panel-solid reveal-up delay-100 rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-stone-400">
                Output
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-stone-950">
                Draft preview
              </h3>
            </div>
            <SparklesIcon className="size-5 text-[#d89414]" />
          </div>

          <div className="min-h-80 rounded-lg border border-stone-200 bg-white/75 p-4">
            {displayOutput ? (
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-950/[0.04] px-2 py-1 text-xs font-semibold text-stone-600">
                    <WandSparklesIcon className="size-3.5" />
                    {previewTone}
                  </span>
                  <button
                    type="button"
                    className="focus-ring rounded-lg p-2 text-stone-400 transition hover:bg-stone-950/5 hover:text-stone-950"
                    onClick={() => navigator.clipboard.writeText(displayOutput)}
                    aria-label="Copy generated post"
                  >
                    <CopyIcon className="size-4" />
                  </button>
                </div>
                <p className="whitespace-pre-line text-sm font-medium leading-7 text-stone-800">
                  {displayOutput}
                </p>
                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt=""
                    className="mt-5 aspect-[16/10] w-full rounded-lg object-cover"
                  />
                ) : previewGeneration?.imageStatus === "failed" ? (
                  <div className="mt-5 flex aspect-[16/10] w-full flex-col items-center justify-center rounded-lg border border-dashed border-amber-200 bg-[#fff8ec] px-5 text-center text-sm font-semibold text-stone-600">
                    <ImageIcon className="mb-2 size-5 text-[var(--amber)]" />
                    Image not created
                    <span className="mt-1 line-clamp-2 text-xs font-medium text-stone-500">
                      {previewGeneration.imageError ||
                        "Check Hugging Face token or provider access."}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-80 flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-stone-950/[0.04] text-stone-400">
                  <SparklesIcon className="size-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-stone-600">
                  No draft yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="panel-solid reveal-up delay-200 rounded-lg">
        <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <HistoryIcon className="size-5 text-[var(--sky)]" />
            <div>
              <h3 className="text-xl font-semibold text-stone-950">
                Generation history
              </h3>
              <p className="text-sm text-stone-500">
                {recentGenerations.length} saved drafts
              </p>
            </div>
          </div>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center px-6 py-12 text-center">
            <p className="text-sm font-semibold text-stone-500">
              No recent generations yet
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {recentGenerations.map((generation) => (
              <article
                key={generation._id}
                className="lift-card flex h-full flex-col rounded-lg border border-stone-200 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-950">
                      {generation.prompt}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-stone-400">
                      {formatDateTime(generation.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-md bg-stone-950/[0.04] px-2 py-1 text-xs font-semibold text-stone-600">
                    {generation.tone || "Professional"}
                  </span>
                </div>

                <p className="mt-4 line-clamp-5 min-h-28 text-sm font-medium leading-6 text-stone-700">
                  {generation.content}
                </p>

                {generation.mediaUrl ? (
                  <img
                    src={generation.mediaUrl}
                    alt=""
                    className="mt-4 aspect-[16/10] w-full rounded-lg object-cover"
                  />
                ) : generation.imageStatus === "failed" ? (
                  <div className="mt-4 flex aspect-[16/10] w-full flex-col items-center justify-center rounded-lg border border-dashed border-amber-200 bg-[#fff8ec] px-5 text-center text-sm font-semibold text-stone-600">
                    <ImageIcon className="mb-2 size-5 text-[var(--amber)]" />
                    Image not created
                    <span className="mt-1 line-clamp-2 text-xs font-medium text-stone-500">
                      {generation.imageError ||
                        "Check Hugging Face token or provider access."}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-950/[0.03] px-5 text-center text-sm font-semibold text-stone-400">
                    Text only
                  </div>
                )}

                <button
                  type="button"
                  className="surface-inverse focus-ring mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition hover:-translate-y-0.5"
                  onClick={() => setGenerationToSchedule(generation)}
                >
                  <CalendarDaysIcon className="size-4" />
                  Schedule
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {generationToSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <div className="panel-solid flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg shadow-[0_24px_80px_rgba(23,21,19,0.24)]">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-400">
                  Schedule generation
                </p>
                <h2 className="text-xl font-semibold text-stone-950">
                  Pick channels and time
                </h2>
              </div>
              <button
                type="button"
                className="focus-ring rounded-lg p-2 text-stone-400 transition hover:bg-stone-950/5 hover:text-stone-700"
                onClick={() => setGenerationToSchedule(null)}
                aria-label="Close schedule generation"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="grid min-h-0 gap-0 overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-stone-200 p-5 lg:border-b-0 lg:border-r">
                {generationToSchedule.mediaUrl ? (
                  <img
                    src={generationToSchedule.mediaUrl}
                    alt=""
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-950/[0.03] text-sm font-semibold text-stone-400">
                    No media attached
                  </div>
                )}

                <div className="mt-4 rounded-lg border border-stone-200 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase text-stone-400">
                    Prompt
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-stone-700">
                    {generationToSchedule.prompt}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="max-h-52 overflow-y-auto rounded-lg border border-stone-200 bg-white/80 p-4">
                  <p className="whitespace-pre-line text-sm font-medium leading-7 text-stone-800">
                    {generationToSchedule.content}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold uppercase text-stone-400">
                    Channels
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PLATFORMS.map(({ id, name, icon: Icon }) => {
                      const isSelected = selectedChannels.includes(id);

                      return (
                        <button
                          key={id}
                          type="button"
                          className={[
                            "focus-ring flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition",
                            isSelected
                              ? "surface-inverse border-stone-950"
                              : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-950",
                          ].join(" ")}
                          onClick={() => toggleChannel(id)}
                          aria-pressed={isSelected}
                          title={name}
                        >
                          <Icon className="size-4" />
                          <span className="hidden sm:inline">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(event) => setScheduleDate(event.target.value)}
                      className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/75 pl-10 pr-3 text-sm font-semibold text-stone-800 transition focus:border-[var(--coral)]"
                    />
                  </div>

                  <div className="relative">
                    <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(event) => setScheduleTime(event.target.value)}
                      className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/75 pl-10 pr-3 text-sm font-semibold text-stone-800 transition focus:border-[var(--coral)]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className={[
                    "focus-ring mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg text-base font-semibold shadow-sm transition",
                    scheduleDate && scheduleTime && selectedChannels.length > 0
                      ? "bg-[var(--coral)] text-white shadow-[0_14px_26px_rgba(239,93,79,0.24)] hover:-translate-y-0.5 hover:bg-[var(--coral-dark)]"
                      : "bg-stone-200 text-stone-500",
                  ].join(" ")}
                  onClick={handleScheduleGeneration}
                  aria-disabled={
                    !scheduleDate ||
                    !scheduleTime ||
                    selectedChannels.length === 0
                  }
                >
                  {isSchedulingGeneration ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    <TimerIcon className="size-5" />
                  )}
                  Schedule post
                </button>

                {selectedChannels.includes("instagram") &&
                  !generationToSchedule.mediaUrl && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-[#fff8ec] px-3 py-2 text-sm font-semibold text-stone-700">
                      <CheckCircle2Icon className="size-4 text-[var(--amber)]" />
                      Instagram needs media before scheduling.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
