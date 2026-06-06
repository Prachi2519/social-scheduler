import { useEffect, useState } from "react";
import { ActivityIcon, SendIcon, TrendingUpIcon } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([
          api.get("/api/posts"),
          api.get("/api/accounts"),
          api.get("/api/activity"),
        ]);

        const posts = postsRes.data;
        setStats({
          scheduled: posts.filter((p: any) => p.status === "scheduled").length,
          published: posts.filter((p: any) => p.status === "published").length,
          connectedAccounts: accountsRes.data.filter(
            (a: any) => a.status === "connected",
          ).length,
        });
        setActivities(activityRes.data);
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { value: stats.scheduled, label: "Scheduled Posts", note: "+2 today" },
    { value: stats.published, label: "Published Posts", note: "All time" },
    {
      value: stats.connectedAccounts,
      label: "Connected Accounts",
      note: "Active",
    },
  ];

  return (
    <section className="w-full max-w-5xl">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Good morning!</h2>
        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your social accounts today.
        </p>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white px-6 py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-3xl font-semibold text-slate-950">{stat.value}</p>
              <span className="flex items-center gap-1 text-xs font-medium text-rose-500">
                <TrendingUpIcon className="size-3" />
                {stat.note}
              </span>
            </div>
            <p className="mt-7 text-sm font-medium text-slate-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h3 className="text-base font-semibold text-slate-950">
            Recent Activity
          </h3>
          <p className="text-sm text-slate-400">
            {activities.length} events
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
              <ActivityIcon className="size-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              No activity yet
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Connect accounts and schedule posts to see events here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <SendIcon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {activity.actionType?.replace("_", " ") || "Activity"}
                  </span>
                  <p className="mt-2 truncate text-sm font-medium text-slate-600">
                    {activity.description}
                  </p>
                </div>

                <p className="hidden whitespace-nowrap text-sm text-slate-400 sm:block">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
