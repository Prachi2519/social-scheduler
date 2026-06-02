import { SendIcon, TrendingUpIcon } from "lucide-react";

const stats = [
  { value: "1", label: "Scheduled Posts", note: "+2 today" },
  { value: "8", label: "Published Posts", note: "All time" },
  { value: "2", label: "Connected Accounts", note: "Active" },
];

const activities = [
  { platform: "instagram", date: "5/19/2026, 4:49:06 PM" },
  { platform: "instagram", date: "5/19/2026, 1:51:06 PM" },
  { platform: "instagram", date: "5/13/2026, 3:19:15 PM" },
  { platform: "linkedin", date: "5/13/2026, 2:45:05 PM" },
  { platform: "Facebook", date: "5/13/2026, 2:04:06 PM" },
  { platform: "instagram", date: "5/12/2026, 6:36:18 PM" },
  { platform: "linkedin", date: "5/12/2026, 5:12:44 PM" },
];

export default function Dashboard() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div>
        <h2 className="text-3xl font-semibold text-slate-950">Good morning! 👋</h2>
        <p className="mt-2 text-base text-slate-500">Here's what's happening with your social accounts today.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/60">
            <div className="flex items-start justify-between gap-4">
              <p className="text-4xl font-semibold text-slate-950">{stat.value}</p>
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-500">
                <TrendingUpIcon className="size-3.5" />
                {stat.note}
              </span>
            </div>
            <p className="mt-7 text-lg font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
          <h3 className="text-xl font-semibold text-slate-950">Recent Activity</h3>
          <p className="text-sm font-medium text-slate-400">7 events</p>
        </div>

        <div className="divide-y divide-slate-50">
          {activities.map((activity) => (
            <div key={`${activity.platform}-${activity.date}`} className="flex items-center gap-5 px-8 py-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <SendIcon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Published</span>
                <p className="mt-2 truncate text-base font-medium text-slate-600">Published post to {activity.platform}</p>
              </div>

              <p className="hidden whitespace-nowrap text-sm font-medium text-slate-400 sm:block">{activity.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
