import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  SendIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";

export default function Scheduler() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const mediaPreviewUrl = useMemo(
    () => (mediaFile ? URL.createObjectURL(mediaFile) : ""),
    [mediaFile],
  );

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load posts",
      );
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = window.setInterval(fetchPosts, 10000);

    return () => window.clearInterval(interval);
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

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((platform) => platform !== id)
        : [...prev, id],
    );
  };

  const formatDate = (value?: string) => {
    if (!value) return "";
    return new Date(value).toLocaleString();
  };

  const getPlatform = (post: any) => {
    const platformId = Array.isArray(post.platforms)
      ? post.platforms[0]
      : post.platforms;
    return PLATFORMS.find((platform) => platform.id === platformId);
  };

  const handleSchedule = async (event: FormEvent) => {
    event.preventDefault();

    if (!content.trim()) {
      toast.error("Add post content");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time");
      return;
    }

    if (selectedPlatforms.includes("instagram") && !mediaFile) {
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(
      `${scheduledDate}T${scheduledTime}`,
    ).toISOString();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));

    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    setLoading(true);

    try {
      await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post scheduled!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      await fetchPosts();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to schedule post",
      );
    } finally {
      setLoading(false);
    }
  };

  const PostRow = ({
    post,
    status,
  }: {
    post: any;
    status: "scheduled" | "published";
  }) => {
    const platform = getPlatform(post);
    const PlatformIcon = platform?.icon;

    return (
      <article className="border-b border-slate-50 px-6 py-5 last:border-b-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            {PlatformIcon ? (
              <PlatformIcon className="size-5" />
            ) : (
              <span className="text-sm font-bold">?</span>
            )}
            <span className="text-sm font-semibold text-slate-500">
              {platform?.name || "Social"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {post.mediaUrl && (
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                {post.mediaType === "video" ? "Video" : "Image"}
              </span>
            )}
            <span className="whitespace-nowrap text-sm font-medium text-slate-400">
              {formatDate(post.scheduledFor || post.createdAt)}
            </span>
            {status === "published" && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                Published
              </span>
            )}
          </div>
        </div>
        <p className="line-clamp-2 text-base font-medium leading-7 text-slate-600">
          {post.content}
        </p>
      </article>
    );
  };

  return (
    <form
      onSubmit={handleSchedule}
      className="flex h-full flex-col gap-6 lg:flex-row"
    >
      <div className="w-full shrink-0 lg:w-[460px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-700">
              Compose Post
            </h2>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Platforms
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {PLATFORMS.map(({ id, name, icon: Icon }) => {
                const isSelected = selectedPlatforms.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    className={[
                      "flex size-12 items-center justify-center rounded-lg border text-slate-500 transition",
                      isSelected
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => togglePlatform(id)}
                    aria-label={name}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="post-content"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Content
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value.slice(0, 280))}
              placeholder="What do you want to share today?"
              className="mt-3 h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
            />
            <p className="mt-2 text-right text-sm font-medium text-slate-400">
              {content.length}/280
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Media
            </p>
            {mediaFile && mediaPreviewUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-video bg-slate-100">
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
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-white hover:text-red-500"
                    onClick={() => setMediaFile(null)}
                    aria-label="Remove media"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="truncate text-sm font-medium text-slate-600">
                    {mediaFile.name}
                  </p>
                  <label className="shrink-0 cursor-pointer text-sm font-semibold text-red-500 hover:text-red-600">
                    Change
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="sr-only"
                      onChange={(event) =>
                        setMediaFile(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white text-center text-slate-500 transition hover:border-red-200 hover:bg-red-50/40 hover:text-red-500">
                <UploadIcon className="mb-2 size-5" />
                <span className="text-sm font-semibold">
                  Click to upload image or video
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={(event) =>
                    setMediaFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="scheduled-date"
                className="text-sm font-semibold uppercase tracking-wide text-slate-500"
              >
                Date
              </label>
              <div className="relative mt-3">
                <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="scheduled-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="scheduled-time"
                className="text-sm font-semibold uppercase tracking-wide text-slate-500"
              >
                Time
              </label>
              <div className="relative mt-3">
                <ClockIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="scheduled-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-red-500 text-base font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            <ClockIcon
              className={["size-5", loading ? "animate-spin" : ""].join(" ")}
            />
            {loading ? "Scheduling..." : "Schedule Post"}
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="size-5 text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-950">Upcoming</h2>
            </div>
            <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              {scheduled.length}
            </span>
          </div>

          {scheduled.length > 0 ? (
            scheduled.map((post) => (
              <PostRow key={post._id} post={post} status="scheduled" />
            ))
          ) : (
            <div className="px-6 py-12 text-center text-sm font-medium text-slate-400">
              No scheduled posts yet
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <SendIcon className="size-5 text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-950">
                Published
              </h2>
            </div>
            <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              {published.length}
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {published.length > 0 ? (
              published.map((post) => (
                <PostRow key={post._id} post={post} status="published" />
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm font-medium text-slate-400">
                No published posts yet
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
