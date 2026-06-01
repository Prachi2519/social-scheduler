export default function Dashboard() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-red-600">Overview</p>
      <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Scheduled posts", "Connected accounts", "Draft ideas"].map((label, index) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{[24, 6, 18][index]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
