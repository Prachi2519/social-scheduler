import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  AlertCircleIcon,
  BookmarkIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  HeartIcon,
  ImageIcon,
  Layers3Icon,
  ListChecksIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  Repeat2Icon,
  SendIcon,
  Share2Icon,
  ThumbsUpIcon,
  TimerResetIcon,
  UploadCloudIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";

type Post = {
  _id: string;
  content?: string;
  createdAt?: string;
  mediaType?: string;
  mediaUrl?: string;
  platforms?: string[] | string;
  scheduledFor?: string;
  status?: "scheduled" | "published" | string;
};

type QueueMode = "scheduled" | "published";
type MediaState = "idle" | "dragging" | "loading" | "success" | "error";
type ScheduleState = "idle" | "success" | "error";

const PLATFORM_RULES = {
  twitter: {
    accent: "text-stone-950",
    captionLimit: 280,
    handle: "@scheduler",
    label: "Twitter / X",
    meta: "Tweet",
    name: "Scheduler Studio",
    ratio: "aspect-[16/9]",
  },
  linkedin: {
    accent: "text-[#0a66c2]",
    captionLimit: 3000,
    handle: "Scheduler Studio",
    label: "LinkedIn",
    meta: "Company post",
    name: "Scheduler Studio",
    ratio: "aspect-[1.91/1]",
  },
  facebook: {
    accent: "text-[#1877f2]",
    captionLimit: 63206,
    handle: "Scheduler Studio",
    label: "Facebook",
    meta: "Page post",
    name: "Scheduler Studio",
    ratio: "aspect-[4/3]",
  },
  instagram: {
    accent: "text-[#e4405f]",
    captionLimit: 2200,
    handle: "scheduler.studio",
    label: "Instagram",
    meta: "Feed post",
    name: "scheduler.studio",
    ratio: "aspect-square",
  },
} as const;

const DEFAULT_PLATFORM_ID = "twitter";
const MAX_MEDIA_SIZE = 15 * 1024 * 1024;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const maybeError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  return maybeError.response?.data?.message || maybeError.message || fallback;
};

const toDateInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const toTimeInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(11, 16);
};

const getPostPlatformIds = (post: Post) =>
  Array.isArray(post.platforms)
    ? post.platforms
    : post.platforms
      ? [post.platforms]
      : [];

const getRule = (platformId: string) =>
  PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES] ||
  PLATFORM_RULES[DEFAULT_PLATFORM_ID];

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Scheduler() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activePreviewPlatform, setActivePreviewPlatform] =
    useState(DEFAULT_PLATFORM_ID);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaState, setMediaState] = useState<MediaState>("idle");
  const [mediaError, setMediaError] = useState("");
  const [quickLabel, setQuickLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduleState, setScheduleState] = useState<ScheduleState>("idle");
  const [queueMode, setQueueMode] = useState<QueueMode>("scheduled");

  const mediaPreviewUrl = useMemo(
    () => (mediaFile ? URL.createObjectURL(mediaFile) : ""),
    [mediaFile],
  );

  const activePlatformId = selectedPlatforms.includes(activePreviewPlatform)
    ? activePreviewPlatform
    : selectedPlatforms[0] || activePreviewPlatform || DEFAULT_PLATFORM_ID;
  const activeRule = getRule(activePlatformId);

  const effectiveCaptionLimit =
    selectedPlatforms.length > 0
      ? Math.min(
          ...selectedPlatforms.map(
            (platformId) => getRule(platformId).captionLimit,
          ),
        )
      : PLATFORM_RULES.twitter.captionLimit;
  const captionText = content.slice(0, effectiveCaptionLimit);

  const captionProgress = Math.min(
    100,
    Math.round((captionText.length / effectiveCaptionLimit) * 100),
  );
  const captionTone =
    captionProgress >= 96
      ? "danger"
      : captionProgress >= 82
        ? "warning"
        : "good";

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load posts"));
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchPosts();
    }, 0);
    const interval = window.setInterval(fetchPosts, 10000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(
    () => () => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    },
    [mediaPreviewUrl],
  );

  const scheduled = posts.filter((post) => post.status === "scheduled");
  const published = posts.filter((post) => post.status === "published");
  const activePosts = queueMode === "scheduled" ? scheduled : published;

  const hasContent = captionText.trim().length > 0;
  const hasChannels = selectedPlatforms.length > 0;
  const hasSchedule = Boolean(scheduledDate && scheduledTime);
  const instagramNeedsMedia =
    selectedPlatforms.includes("instagram") && !mediaFile;
  const readyToSchedule =
    hasContent && hasChannels && hasSchedule && !instagramNeedsMedia;

  const disabledReason = !hasChannels
    ? "Choose at least one channel"
    : !hasContent
      ? "Add a caption"
      : !hasSchedule
        ? "Pick a date and time"
        : instagramNeedsMedia
          ? "Instagram needs media"
          : "";

  const togglePlatform = (id: string) => {
    setScheduleState("idle");
    setSelectedPlatforms((prev) => {
      const next = prev.includes(id)
        ? prev.filter((platform) => platform !== id)
        : [...prev, id];

      if (!prev.includes(id)) {
        setActivePreviewPlatform(id);
      }

      return next;
    });
  };

  const formatDate = (value?: string) => {
    if (!value) return "Not scheduled";

    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlatform = (platformId?: string) =>
    PLATFORMS.find((platform) => platform.id === platformId);

  const setQuickTime = (label: string, hoursFromNow: number) => {
    const quickDate = new Date();
    quickDate.setHours(quickDate.getHours() + hoursFromNow);
    quickDate.setMinutes(Math.ceil(quickDate.getMinutes() / 15) * 15, 0, 0);
    setScheduledDate(toDateInputValue(quickDate));
    setScheduledTime(toTimeInputValue(quickDate));
    setQuickLabel(label);
    setScheduleState("idle");
  };

  const handleMediaFile = (file?: File | null) => {
    setMediaError("");
    setScheduleState("idle");

    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setMediaState("error");
      setMediaError("Upload an image or video file.");
      return;
    }

    if (file.size > MAX_MEDIA_SIZE) {
      setMediaState("error");
      setMediaError("Keep media under 15 MB for reliable publishing.");
      return;
    }

    setMediaState("loading");

    window.setTimeout(() => {
      setMediaFile(file);
      setMediaState("success");
    }, 240);
  };

  const handleMediaInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleMediaFile(event.target.files?.[0]);
  };

  const handleMediaDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setMediaState("idle");
    handleMediaFile(event.dataTransfer.files?.[0]);
  };

  const handleSchedule = async (event: FormEvent) => {
    event.preventDefault();

    if (!hasContent) {
      toast.error("Add post content");
      return;
    }

    if (!hasChannels) {
      toast.error("Select at least one platform");
      return;
    }

    if (!hasSchedule) {
      toast.error("Select date and time");
      return;
    }

    if (instagramNeedsMedia) {
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(
      `${scheduledDate}T${scheduledTime}`,
    ).toISOString();
    const formData = new FormData();
    formData.append("content", captionText);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));

    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    setLoading(true);
    setScheduleState("idle");

    try {
      await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post scheduled");
      setScheduleState("success");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      setMediaState("idle");
      setQuickLabel("");
      await fetchPosts();
      window.setTimeout(() => setScheduleState("idle"), 1600);
    } catch (error) {
      setScheduleState("error");
      toast.error(getErrorMessage(error, "Failed to schedule post"));
    } finally {
      setLoading(false);
    }
  };

  const readiness = [
    {
      complete: hasChannels,
      detail: hasChannels
        ? `${selectedPlatforms.length} channel${
            selectedPlatforms.length === 1 ? "" : "s"
          } selected`
        : "Pick channels for preview rules",
      label: "Channels selected",
    },
    {
      complete: hasContent,
      detail: hasContent
        ? `${captionText.length}/${effectiveCaptionLimit} characters`
        : "Write the first line of the post",
      label: "Caption ready",
    },
    {
      complete: hasSchedule,
      detail: hasSchedule
        ? formatDate(`${scheduledDate}T${scheduledTime}`)
        : "Choose when this should publish",
      label: "Time selected",
    },
    {
      complete: !instagramNeedsMedia,
      detail: instagramNeedsMedia
        ? "Instagram feed posts need media"
        : mediaFile
          ? `${mediaFile.type.startsWith("video/") ? "Video" : "Image"} ready`
          : "No platform-specific media blockers",
      label: "Media rules clear",
    },
  ];

  const renderMediaPreview = ({
    ratio = activeRule.ratio,
    compact = false,
  }: {
    compact?: boolean;
    ratio?: string;
  }) => {
    if (mediaPreviewUrl) {
      return mediaFile?.type.startsWith("video/") ? (
        <video
          src={mediaPreviewUrl}
          className={`${ratio} w-full object-cover`}
          controls
        />
      ) : (
        <img
          src={mediaPreviewUrl}
          alt={mediaFile?.name || "Selected media"}
          className={`${ratio} w-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${ratio} media-preview-empty flex w-full flex-col items-center justify-center px-6 text-center`}
      >
        <ImageIcon
          className={compact ? "size-6 text-stone-400" : "size-8 text-stone-400"}
        />
        <p className="mt-3 text-sm font-semibold text-stone-500">
          Media preview
        </p>
      </div>
    );
  };

  const renderPlatformAvatar = ({
    className = "size-10",
    platformId = activePlatformId,
  }: {
    className?: string;
    platformId?: string;
  }) => {
    const platform = getPlatform(platformId);
    const Icon = platform?.icon;

    return (
      <div
        className={`${className} surface-inverse flex shrink-0 items-center justify-center rounded-lg`}
      >
        {Icon ? <Icon className="size-4" /> : <span className="text-xs">S</span>}
      </div>
    );
  };

  const renderPlatformPreview = () => {
    const caption = captionText || "Your caption will appear here as you write.";
    const scheduledLabel =
      scheduledDate && scheduledTime
        ? formatDate(`${scheduledDate}T${scheduledTime}`)
        : "Not scheduled";

    if (activePlatformId === "instagram") {
      return (
        <div className="preview-swap mx-auto max-w-md overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_40px_rgba(41,33,24,0.09)]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {renderPlatformAvatar({ platformId: "instagram" })}
              <div>
                <p className="text-sm font-semibold text-stone-950">
                  {PLATFORM_RULES.instagram.name}
                </p>
                <p className="text-xs font-medium text-stone-500">
                  Original post
                </p>
              </div>
            </div>
            <MoreHorizontalIcon className="size-5 text-stone-500" />
          </div>
          {renderMediaPreview({ ratio: PLATFORM_RULES.instagram.ratio })}
          <div className="space-y-3 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-stone-900">
                <HeartIcon className="size-5" />
                <MessageCircleIcon className="size-5" />
                <SendIcon className="size-5" />
              </div>
              <BookmarkIcon className="size-5 text-stone-900" />
            </div>
            <p className="text-sm font-semibold text-stone-950">128 likes</p>
            <p className="whitespace-pre-line text-sm leading-6 text-stone-800">
              <span className="font-semibold">{PLATFORM_RULES.instagram.name}</span>{" "}
              {caption}
            </p>
            <p className="text-xs font-semibold uppercase text-stone-400">
              {scheduledLabel}
            </p>
          </div>
        </div>
      );
    }

    if (activePlatformId === "linkedin") {
      return (
        <div className="preview-swap mx-auto max-w-xl overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_40px_rgba(41,33,24,0.09)]">
          <div className="flex items-start justify-between gap-3 px-4 py-4">
            <div className="flex items-start gap-3">
              {renderPlatformAvatar({
                platformId: "linkedin",
                className: "size-12",
              })}
              <div>
                <p className="text-sm font-semibold text-stone-950">
                  {PLATFORM_RULES.linkedin.name}
                </p>
                <p className="text-xs font-medium text-stone-500">
                  Social operations platform · 12,482 followers
                </p>
                <p className="mt-0.5 text-xs font-medium text-stone-400">
                  {scheduledLabel} · Public
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm font-semibold text-[#0a66c2] hover:bg-[#edf4ff]"
            >
              Follow
            </button>
          </div>
          <p className="whitespace-pre-line px-4 pb-4 text-sm font-medium leading-7 text-stone-800">
            {caption}
          </p>
          {renderMediaPreview({ ratio: PLATFORM_RULES.linkedin.ratio })}
          <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3 text-xs font-semibold text-stone-500">
            <span>42 reactions</span>
            <span>8 comments · 3 reposts</span>
          </div>
          <div className="grid grid-cols-4 border-t border-stone-100 px-2 py-1 text-sm font-semibold text-stone-600">
            {["Like", "Comment", "Repost", "Send"].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-md py-2 hover:bg-stone-950/[0.04]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activePlatformId === "facebook") {
      return (
        <div className="preview-swap mx-auto max-w-lg overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_40px_rgba(41,33,24,0.09)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              {renderPlatformAvatar({ platformId: "facebook" })}
              <div>
                <p className="text-sm font-semibold text-stone-950">
                  {PLATFORM_RULES.facebook.name}
                </p>
                <p className="text-xs font-medium text-stone-500">
                  {scheduledLabel} · Friends of followers
                </p>
              </div>
            </div>
            <MoreHorizontalIcon className="size-5 text-stone-500" />
          </div>
          <p className="whitespace-pre-line px-4 pb-3 text-sm font-medium leading-6 text-stone-800">
            {caption}
          </p>
          {renderMediaPreview({ ratio: PLATFORM_RULES.facebook.ratio })}
          <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-stone-500">
            <span className="inline-flex items-center gap-1">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
                <ThumbsUpIcon className="size-3" />
              </span>
              86
            </span>
            <span>14 comments · 5 shares</span>
          </div>
          <div className="grid grid-cols-3 border-t border-stone-100 px-2 py-1 text-sm font-semibold text-stone-600">
            {["Like", "Comment", "Share"].map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-md py-2 hover:bg-stone-950/[0.04]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="preview-swap mx-auto max-w-lg rounded-lg border border-stone-200 bg-white p-4 shadow-[0_18px_40px_rgba(41,33,24,0.09)]">
        <div className="grid grid-cols-[auto_1fr_auto] gap-3">
          {renderPlatformAvatar({ platformId: "twitter" })}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1">
              <p className="text-sm font-semibold text-stone-950">
                {PLATFORM_RULES.twitter.name}
              </p>
              <span className="text-sm text-stone-400">
                {PLATFORM_RULES.twitter.handle}
              </span>
              <span className="text-sm text-stone-400">· now</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-[15px] font-medium leading-6 text-stone-800">
              {caption}
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-stone-200">
              {renderMediaPreview({
                ratio: PLATFORM_RULES.twitter.ratio,
                compact: true,
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-stone-500">
              <span>{scheduledLabel}</span>
              <span>
                {captionText.length}/{PLATFORM_RULES.twitter.captionLimit}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-4 text-stone-500">
              <MessageCircleIcon className="size-4" />
              <Repeat2Icon className="size-4" />
              <HeartIcon className="size-4" />
              <Share2Icon className="size-4" />
            </div>
          </div>
          <MoreHorizontalIcon className="size-5 text-stone-400" />
        </div>
      </div>
    );
  };

  const renderPostRow = (post: Post, status: QueueMode) => {
    const platformIds = getPostPlatformIds(post);

    return (
      <article
        key={post._id}
        className="queue-row grid gap-4 border-b border-stone-100 px-5 py-4 last:border-b-0 md:grid-cols-[auto_1fr_auto]"
      >
        <div className="flex -space-x-2">
          {platformIds.slice(0, 3).map((platformId) => {
            const platform = getPlatform(platformId);
            const PlatformIcon = platform?.icon;

            return (
              <div
                key={platformId}
                className="surface-inverse flex size-9 items-center justify-center rounded-lg border border-white"
                title={platform?.name || platformId}
              >
                {PlatformIcon ? (
                  <PlatformIcon className="size-4" />
                ) : (
                  <span className="text-xs font-bold">?</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {post.mediaUrl && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-950/[0.04] px-2 py-1 text-xs font-semibold text-stone-600">
                <ImageIcon className="size-3.5" />
                {post.mediaType === "video" ? "Video" : "Image"}
              </span>
            )}
            {status === "published" && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#e9f8f2] px-2 py-1 text-xs font-semibold text-[var(--mint)]">
                <CheckCircle2Icon className="size-3.5" />
                Published
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm font-medium leading-6 text-stone-700">
            {post.content || "Untitled post"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-stone-500 md:justify-end">
          <ClockIcon className="size-4 text-[var(--coral)]" />
          {formatDate(post.scheduledFor || post.createdAt)}
        </div>
      </article>
    );
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(380px,0.8fr)_minmax(560px,1.2fr)]">
      <form
        onSubmit={handleSchedule}
        className="panel-solid reveal-up rounded-lg p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-stone-400">
              Composer
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-950">
              Build a post
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-500">
              Channel rules, preview layout, and readiness update as you work.
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1de] text-[var(--amber)]">
            <ZapIcon className="size-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase text-stone-400">
              Platforms
            </p>
            <span className="text-xs font-semibold text-stone-500">
              Preview: {activeRule.label}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
            {PLATFORMS.map(({ id, name, icon: Icon }) => {
              const isSelected = selectedPlatforms.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  className={[
                    "platform-chip focus-ring flex h-12 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                    isSelected
                      ? "platform-chip--selected surface-inverse border-stone-950 shadow-[0_10px_22px_rgba(23,21,19,0.14)]"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-950",
                  ].join(" ")}
                  onClick={() => togglePlatform(id)}
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4" />
                  <span className="truncate">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <label
              htmlFor="post-content"
              className="text-sm font-semibold uppercase text-stone-400"
            >
              Caption
            </label>
            <span
              className={[
                "text-xs font-semibold",
                captionTone === "danger"
                  ? "text-[var(--danger)]"
                  : captionTone === "warning"
                    ? "text-[var(--warning)]"
                    : "text-stone-500",
              ].join(" ")}
            >
              {effectiveCaptionLimit === PLATFORM_RULES.facebook.captionLimit
                ? `${captionText.length.toLocaleString()} chars`
                : `${captionText.length}/${effectiveCaptionLimit}`}
            </span>
          </div>
          <textarea
            id="post-content"
            value={captionText}
            onChange={(event) => {
              setContent(event.target.value.slice(0, effectiveCaptionLimit));
              setScheduleState("idle");
            }}
            placeholder="Write the version your audience should see first."
            className={[
              "focus-ring mt-3 h-40 w-full resize-none rounded-lg border bg-white/75 px-4 py-4 text-sm font-medium leading-6 text-stone-800 transition placeholder:text-stone-400 focus:border-[var(--coral)]",
              captionTone === "danger"
                ? "border-[var(--danger)]"
                : captionTone === "warning"
                  ? "border-amber-200"
                  : "border-stone-200",
            ].join(" ")}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  captionTone === "danger"
                    ? "bg-[var(--danger)]"
                    : captionTone === "warning"
                      ? "bg-[var(--warning)]"
                      : "bg-[var(--coral)]",
                ].join(" ")}
                style={{ width: `${captionProgress}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-stone-500">
              {selectedPlatforms.length
                ? "Strictest selected limit"
                : "Twitter-safe start"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase text-stone-400">
            Media
          </p>
          {mediaFile && mediaPreviewUrl ? (
            <div className="media-drop mt-3 overflow-hidden rounded-lg border border-stone-200 bg-white">
              <div className="relative aspect-video bg-stone-100">
                {mediaFile.type.startsWith("video/") ? (
                  <video
                    src={mediaPreviewUrl}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={mediaPreviewUrl}
                    alt={mediaFile.name}
                    className="h-full w-full object-cover"
                  />
                )}

                <button
                  type="button"
                  className="focus-ring absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-stone-600 shadow-sm transition hover:bg-white hover:text-[var(--coral)]"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaState("idle");
                  }}
                  aria-label="Remove media"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-700">
                    {mediaFile.name}
                  </p>
                  <p className="text-xs font-medium text-stone-500">
                    {formatFileSize(mediaFile.size)}
                  </p>
                </div>
                <label className="focus-ring shrink-0 cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-[var(--coral)] hover:bg-[#ffeceb]">
                  Change
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="sr-only"
                    onChange={handleMediaInput}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label
              className={[
                "media-drop focus-ring mt-3 flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-5 text-center transition",
                mediaState === "dragging"
                  ? "border-[var(--coral)] bg-[#ffeceb] text-[var(--coral)]"
                  : mediaState === "error"
                    ? "border-[var(--danger)] bg-[#ffeceb] text-[var(--danger)]"
                    : "border-stone-300 bg-white/65 text-stone-500 hover:border-[var(--coral)] hover:bg-white hover:text-[var(--coral)]",
              ].join(" ")}
              onDragEnter={(event) => {
                event.preventDefault();
                setMediaState("dragging");
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setMediaState("idle");
              }}
              onDrop={handleMediaDrop}
            >
              {mediaState === "loading" ? (
                <div className="size-5 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
              ) : mediaState === "error" ? (
                <AlertCircleIcon className="mb-2 size-5" />
              ) : (
                <UploadCloudIcon className="mb-2 size-5" />
              )}
              <span className="text-sm font-semibold">
                {mediaState === "dragging"
                  ? "Drop media here"
                  : mediaState === "error"
                    ? mediaError
                    : "Upload or drag image/video"}
              </span>
              <span className="mt-1 text-xs font-medium opacity-75">
                Required for Instagram · Max 15 MB
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={handleMediaInput}
              />
            </label>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="scheduled-date"
              className="text-sm font-semibold uppercase text-stone-400"
            >
              Date
            </label>
            <div className="relative mt-3">
              <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                id="scheduled-date"
                type="date"
                value={scheduledDate}
                onChange={(event) => {
                  setScheduledDate(event.target.value);
                  setQuickLabel("");
                  setScheduleState("idle");
                }}
                className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/75 pl-10 pr-3 text-sm font-semibold text-stone-800 transition focus:border-[var(--coral)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="scheduled-time"
              className="text-sm font-semibold uppercase text-stone-400"
            >
              Time
            </label>
            <div className="relative mt-3">
              <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                id="scheduled-time"
                type="time"
                value={scheduledTime}
                onChange={(event) => {
                  setScheduledTime(event.target.value);
                  setQuickLabel("");
                  setScheduleState("idle");
                }}
                className="focus-ring h-12 w-full rounded-lg border border-stone-200 bg-white/75 pl-10 pr-3 text-sm font-semibold text-stone-800 transition focus:border-[var(--coral)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "+2h", value: 2 },
            { label: "Tomorrow", value: 24 },
            { label: "Next week", value: 168 },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              className={[
                "quick-chip focus-ring h-10 rounded-lg border text-sm font-semibold transition",
                quickLabel === option.label
                  ? "surface-inverse border-stone-950"
                  : "border-stone-200 bg-white/70 text-stone-600 hover:border-stone-300 hover:text-stone-950",
              ].join(" ")}
              onClick={() => setQuickTime(option.label, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-950/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
              <ListChecksIcon className="size-4 text-[var(--sky)]" />
              Readiness
            </div>
            <span
              className={[
                "rounded-md px-2 py-1 text-xs font-semibold",
                readyToSchedule
                  ? "bg-[#e9f8f2] text-[var(--mint)]"
                  : "bg-[#fff1de] text-[var(--warning)]",
              ].join(" ")}
            >
              {readyToSchedule ? "Ready" : "Needs attention"}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {readiness.map((item) => (
              <div
                key={item.label}
                className={[
                  "readiness-item flex items-start gap-2 rounded-lg px-2 py-2 text-sm transition",
                  item.complete
                    ? "readiness-item--complete bg-[#e9f8f2] text-stone-800"
                    : "text-stone-600",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md",
                    item.complete
                      ? "bg-[var(--mint)] text-white"
                      : "bg-white text-stone-300",
                  ].join(" ")}
                >
                  <CheckCircle2Icon className="size-3.5" />
                </span>
                <span>
                  <span className="block font-semibold">{item.label}</span>
                  <span className="block text-xs font-medium text-stone-500">
                    {item.detail}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !readyToSchedule}
          className={[
            "focus-ring mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg text-base font-semibold shadow-[0_14px_26px_rgba(239,93,79,0.24)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none",
            scheduleState === "success"
              ? "bg-[var(--mint)] text-white"
              : scheduleState === "error"
                ? "bg-[var(--danger)] text-white"
                : "bg-[var(--coral)] text-white hover:bg-[var(--coral-dark)] disabled:bg-stone-300",
          ].join(" ")}
        >
          <ClockIcon
            className={["size-5", loading ? "animate-spin" : ""].join(" ")}
          />
          {loading
            ? "Scheduling"
            : scheduleState === "success"
              ? "Queued"
              : scheduleState === "error"
                ? "Try again"
                : readyToSchedule
                  ? "Schedule post"
                  : disabledReason}
        </button>
      </form>

      <div className="space-y-5">
        <div className="panel reveal-up delay-100 rounded-lg p-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-stone-400">
                Live preview
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-stone-950">
                {activeRule.label} feed card
              </h2>
            </div>
            <TimerResetIcon className="size-5 text-stone-400" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {(selectedPlatforms.length ? selectedPlatforms : [activePlatformId]).map(
              (platformId) => {
                const platform = getPlatform(platformId);
                const Icon = platform?.icon;
                const isActive = activePlatformId === platformId;

                return (
                  <button
                    key={platformId}
                    type="button"
                    className={[
                      "focus-ring inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition",
                      isActive
                        ? "surface-inverse border-stone-950"
                        : "border-stone-200 bg-white/70 text-stone-600 hover:border-stone-300 hover:text-stone-950",
                    ].join(" ")}
                    onClick={() => setActivePreviewPlatform(platformId)}
                  >
                    {Icon ? <Icon className="size-3.5" /> : null}
                    {getRule(platformId).label}
                  </button>
                );
              },
            )}
          </div>

          {renderPlatformPreview()}
        </div>

        <div className="panel-solid reveal-up delay-200 rounded-lg">
          <div className="flex flex-col gap-4 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Layers3Icon className="size-5 text-[var(--sky)]" />
              <div>
                <h2 className="text-xl font-semibold text-stone-950">
                  Content queue
                </h2>
                <p className="text-sm text-stone-500">
                  {scheduled.length} scheduled, {published.length} published
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 rounded-lg border border-stone-200 bg-white/70 p-1">
              {(["scheduled", "published"] as QueueMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={[
                    "focus-ring h-9 rounded-md px-3 text-sm font-semibold capitalize transition",
                    queueMode === mode
                      ? "surface-inverse"
                      : "text-stone-500 hover:text-stone-950",
                  ].join(" ")}
                  onClick={() => setQueueMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {activePosts.length > 0 ? (
              activePosts.map((post) => renderPostRow(post, queueMode))
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-stone-950/[0.04] text-stone-400">
                  <CalendarDaysIcon className="size-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-stone-600">
                  {queueMode === "scheduled"
                    ? "No scheduled posts"
                    : "No published posts"}
                </p>
                <p className="mt-2 max-w-sm text-sm text-stone-500">
                  {queueMode === "scheduled"
                    ? "Compose a post and this queue will become your publishing runway."
                    : "Published posts will appear here after the scheduler sends them."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
