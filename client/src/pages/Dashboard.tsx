import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Layers3Icon,
  RadioTowerIcon,
  SendIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";
import api from "../api/axios";

type Post = {
  _id: string;
  content?: string;
  createdAt?: string;
  mediaUrl?: string;
  platforms?: string[] | string;
  scheduledFor?: string;
  status?: "scheduled" | "published" | string;
};

type Account = {
  platform: string;
  status?: string;
};

type Activity = {
  _id: string;
  actionType?: string;
  createdAt?: string;
  description?: string;
};

const formatDateTime = (value?: string) => {
  if (!value) return "Not set";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const platformIdsForPost = (post: Post) =>
  Array.isArray(post.platforms)
    ? post.platforms
    : post.platforms
      ? [post.platforms]
      : [];

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([
          api.get("/api/posts"),
          api.get("/api/accounts"),
          api.get("/api/activity"),
        ]);

        setPosts(postsRes.data);
        setAccounts(accountsRes.data);
        setActivities(activityRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const scheduled = posts.filter((post) => post.status === "scheduled");
  const published = posts.filter((post) => post.status === "published");
  const connectedAccounts = accounts.filter(
    (account) => account.status === "connected",
  );
  const connectedPlatforms = new Set(
    connectedAccounts.map((account) => account.platform),
  );

  const upcomingPosts = useMemo(
    () =>
      [...scheduled]
        .sort(
          (first, second) =>
            new Date(first.scheduledFor || first.createdAt || 0).getTime() -
            new Date(second.scheduledFor || second.createdAt || 0).getTime(),
        )
        .slice(0, 4),
    [scheduled],
  );

  const cadence = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      const key = day.toDateString();
      const count = scheduled.filter((post) => {
        if (!post.scheduledFor) return false;
        return new Date(post.scheduledFor).toDateString() === key;
      }).length;

      return {
        count,
        label: day.toLocaleDateString([], { weekday: "short" }),
      };
    });
  }, [scheduled]);

  const maxCadence = Math.max(...cadence.map((day) => day.count), 1);

  const statCards = [
    {
      accent: "text-[var(--coral)]",
      icon: CalendarClockIcon,
      label: "Scheduled",
      note: "Queued for auto-publish",
      value: scheduled.length,
    },
    {
      accent: "text-[var(--mint)]",
      icon: CheckCircle2Icon,
      label: "Published",
      note: "Completed sends",
      value: published.length,
    },
    {
      accent: "text-[var(--sky)]",
      icon: UsersIcon,
      label: "Channels",
      note: `${PLATFORMS.length - connectedAccounts.length} open slots`,
      value: connectedAccounts.length,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="panel reveal-up overflow-hidden rounded-lg p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase text-stone-500">
                <SparklesIcon className="size-3.5 text-[#d89414]" />
                Live publishing desk
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-stone-950 sm:text-5xl">
                Plan the week, keep every channel warm.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                Your queue, connected accounts, and recent publishing events are
                folded into one working view.
              </p>
            </div>

            <div className="grid min-w-52 grid-cols-2 gap-2">
              <Link
                to="/scheduler"
                className="surface-inverse focus-ring rounded-lg px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Schedule
                <ArrowUpRightIcon className="mt-3 size-4" />
              </Link>
              <Link
                to="/ai-composer"
                className="focus-ring rounded-lg border border-stone-200 bg-white/75 px-4 py-3 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-[var(--coral)] hover:text-[var(--coral)]"
              >
                Draft
                <SparklesIcon className="mt-3 size-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="lift-card rounded-lg border border-stone-200 bg-white/72 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-stone-950">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg bg-stone-950/5 p-2 ${stat.accent}`}>
                    <stat.icon className="size-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-stone-500">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-solid reveal-up delay-100 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-stone-400">
                Channel coverage
              </p>
              <p className="mt-1 text-2xl font-semibold text-stone-950">
                {connectedAccounts.length}/{PLATFORMS.length}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#e9f8f2] text-[var(--mint)]">
              <RadioTowerIcon className="size-5" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {PLATFORMS.map(({ id, name, icon: Icon }) => {
              const isConnected = connectedPlatforms.has(id);

              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white/75 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-950/5 text-stone-700">
                      <Icon className="size-4" />
                    </div>
                    <p className="truncate text-sm font-semibold text-stone-800">
                      {name}
                    </p>
                  </div>
                  <span
                    className={[
                      "size-2.5 rounded-full",
                      isConnected ? "bg-[var(--mint)]" : "bg-stone-300",
                    ].join(" ")}
                    aria-label={isConnected ? "Connected" : "Not connected"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-solid reveal-up delay-100 rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-stone-400">
                Seven-day cadence
              </p>
              <h3 className="mt-1 text-xl font-semibold text-stone-950">
                Posting rhythm
              </h3>
            </div>
            <Clock3Icon className="size-5 text-stone-400" />
          </div>

          <div className="flex h-52 items-end gap-2">
            {cadence.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-lg bg-stone-950/[0.035] p-1.5">
                  <div
                    className="w-full rounded-md bg-[var(--coral)] transition-all"
                    style={{
                      height: `${Math.max((day.count / maxCadence) * 100, day.count ? 14 : 4)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  {day.label}
                </span>
                <span className="text-xs font-semibold text-stone-950">
                  {day.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-solid reveal-up delay-200 rounded-lg">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <Layers3Icon className="size-5 text-[var(--sky)]" />
              <h3 className="text-xl font-semibold text-stone-950">Next up</h3>
            </div>
            <p className="text-sm font-semibold text-stone-500">
              {upcomingPosts.length} visible
            </p>
          </div>

          {upcomingPosts.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {upcomingPosts.map((post) => {
                const platformIds = platformIdsForPost(post);

                return (
                  <article
                    key={post._id}
                    className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto]"
                  >
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {platformIds.slice(0, 3).map((platformId) => {
                          const platform = PLATFORMS.find(
                            (item) => item.id === platformId,
                          );
                          const Icon = platform?.icon;

                          return (
                            <span
                              key={platformId}
                              className="inline-flex items-center gap-1.5 rounded-md bg-stone-950/[0.04] px-2 py-1 text-xs font-semibold text-stone-600"
                            >
                              {Icon ? <Icon className="size-3.5" /> : null}
                              {platform?.name || platformId}
                            </span>
                          );
                        })}
                      </div>
                      <p className="line-clamp-2 text-sm font-medium leading-6 text-stone-700">
                        {post.content || "Untitled post"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-500 md:justify-end">
                      <CalendarClockIcon className="size-4 text-[var(--coral)]" />
                      {formatDateTime(post.scheduledFor || post.createdAt)}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-stone-950/[0.04] text-stone-400">
                <CalendarClockIcon className="size-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-stone-600">
                Queue is empty
              </p>
              <Link
                to="/scheduler"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--coral)]"
              >
                Schedule a post <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="panel-solid reveal-up delay-200 rounded-lg">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <ActivityIcon className="size-5 text-[var(--lilac)]" />
            <h3 className="text-xl font-semibold text-stone-950">
              Activity stream
            </h3>
          </div>
          <p className="text-sm font-semibold text-stone-500">
            {activities.length} events
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-stone-950/[0.04] text-stone-400">
              <ActivityIcon className="size-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-stone-600">
              No activity yet
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Events appear here after accounts publish or sync.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="grid items-center gap-4 px-5 py-4 md:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff1de] text-[var(--amber)]">
                  <SendIcon className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-stone-400">
                    {activity.actionType?.replace("_", " ") || "Activity"}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-stone-700">
                    {activity.description}
                  </p>
                </div>

                <p className="text-sm font-medium text-stone-500">
                  {formatDateTime(activity.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
