import { useEffect, useMemo, useState } from "react";
import { CalendarDaysIcon, ClockIcon, UploadIcon, XIcon } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

const platforms = [
  { label: "Twitter / X", icon: SiX },
  { label: "LinkedIn", iconText: "in" },
  { label: "Facebook", icon: SiFacebook },
  { label: "Instagram", icon: SiInstagram },
];

const publishedPosts = [
  {
    platform: "LinkedIn",
    iconText: "in",
    date: "5/12/2026, 6:57:04 PM",
    hasImage: false,
    content:
      "As we approach 2026, understanding India's inflation trajectory remains paramount for economic stability and growth. Projections suggest continued influence from...",
  },
  {
    platform: "LinkedIn",
    iconText: "in",
    date: "5/13/2026, 2:45:04 PM",
    hasImage: true,
    content:
      "Exciting Opportunity: Data Analyst! Are you a highly analytical professional passionate about transforming complex data into strategic insights? We're looking...",
  },
  {
    platform: "Instagram",
    icon: SiInstagram,
    date: "5/13/2026, 3:19:15 PM",
    hasImage: true,
    content:
      "Exciting Opportunity: Data Analyst! Are you a highly analytical professional passionate about transforming complex data into strategic insights? We're looking...",
  },
  {
    platform: "Instagram",
    icon: SiInstagram,
    date: "5/19/2026, 1:51:06 PM",
    hasImage: true,
    content: "Published post to instagram with a campaign update and new creative for the hiring announcement...",
  },
  {
    platform: "Facebook",
    icon: SiFacebook,
    date: "5/19/2026, 4:49:06 PM",
    hasImage: false,
    content: "Published post to Facebook with details about the latest automation workflow and upcoming social calendar...",
  },
];

export default function Scheduler() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Twitter / X"]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSchedulingPost, setIsSchedulingPost] = useState(false);

  const mediaPreviewUrl = useMemo(() => (mediaFile ? URL.createObjectURL(mediaFile) : ""), [mediaFile]);

  useEffect(() => () => {
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
  }, [mediaPreviewUrl]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((selected) =>
      selected.includes(platform) ? selected.filter((item) => item !== platform) : [...selected, platform],
    );
  };

  const handleSchedulePost = () => {
    if (isSchedulingPost) return;

    setIsSchedulingPost(true);
    window.setTimeout(() => setIsSchedulingPost(false), 2000);
  };

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="grid gap-8 xl:grid-cols-[minmax(28rem,36rem)_1fr]">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Compose Post</h2>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase text-slate-500">Platforms</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {platforms.map(({ label, icon: Icon, iconText }) => {
                const isSelected = selectedPlatforms.includes(label);

                return (
                  <button
                    key={label}
                    type="button"
                    className={[
                      "flex size-14 items-center justify-center rounded-lg border text-slate-500 transition",
                      isSelected ? "border-red-200 bg-red-50 text-red-500" : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => togglePlatform(label)}
                    aria-label={label}
                  >
                    {Icon ? <Icon className="size-6" /> : <span className="text-xl font-bold leading-none">{iconText}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="post-content" className="text-sm font-semibold uppercase text-slate-500">
              Content
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value.slice(0, 280))}
              placeholder="What do you want to share today?"
              className="mt-3 h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
            />
            <p className="mt-2 text-right text-sm font-medium text-slate-400">{content.length}/280</p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase text-slate-500">Media (Optional)</p>
            {mediaFile && mediaPreviewUrl ? (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-video bg-slate-100">
                  {mediaFile.type.startsWith("video/") ? (
                    <video src={mediaPreviewUrl} className="h-full w-full object-cover" controls />
                  ) : (
                    <img src={mediaPreviewUrl} alt={mediaFile.name} className="h-full w-full object-cover" />
                  )}

                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-white hover:text-rose-500"
                    onClick={() => setMediaFile(null)}
                    aria-label="Remove media"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="truncate text-sm font-medium text-slate-600">{mediaFile.name}</p>
                  <label className="shrink-0 cursor-pointer text-sm font-semibold text-rose-500 hover:text-rose-600">
                    Change
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="sr-only"
                      onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center text-slate-500 transition hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-500">
                <UploadIcon className="mb-3 size-6" />
                <span className="text-base font-semibold">Click to upload image or video</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="scheduled-date" className="text-sm font-semibold uppercase text-slate-500">
                Date
              </label>
              <div className="relative mt-3">
                <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="scheduled-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="scheduled-time" className="text-sm font-semibold uppercase text-slate-500">
                Time
              </label>
              <div className="relative mt-3">
                <ClockIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="scheduled-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-medium text-slate-700 outline-none focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-7 inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-red-500 text-lg font-semibold text-white shadow-sm shadow-red-500/25 transition hover:bg-red-600"
            onClick={handleSchedulePost}
          >
            <ClockIcon className={["size-5", isSchedulingPost ? "animate-spin" : ""].join(" ")} />
            Schedule Post
          </button>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="size-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-950">Upcoming</h2>
              </div>
              <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">1</span>
            </div>

            <div className="px-6 py-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <SiFacebook className="size-5 shrink-0 text-slate-400" />
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Image</span>
                  <span className="whitespace-nowrap text-sm font-medium text-slate-400">5/19/2026, 7:39:00 PM</span>
                </div>
              </div>
              <p className="line-clamp-2 text-base font-medium leading-7 text-slate-600">
                Exciting Opportunity: Data Analyst! Are you a highly analytical professional passionate about transforming
                complex data into strategi...
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <UploadIcon className="size-5 rotate-45 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-950">Published</h2>
              </div>
              <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">8</span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {publishedPosts.map(({ platform, icon: Icon, iconText, date, hasImage, content }) => (
                <article key={`${platform}-${date}`} className="border-b border-slate-50 px-6 py-5 last:border-b-0">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex size-5 items-center justify-center text-slate-400" aria-label={platform}>
                      {Icon ? <Icon className="size-5" /> : <span className="text-base font-bold leading-none">{iconText}</span>}
                    </div>

                    <div className="flex items-center gap-3">
                      {hasImage && <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Image</span>}
                      <span className="whitespace-nowrap text-sm font-medium text-slate-400">{date}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">Published</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-base font-medium leading-7 text-slate-600">{content}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
