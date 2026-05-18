const stats = [
  { value: "+500K", label: "مستخدم نشط" },
  { value: "+30", label: "عملة مدعومة" },
  { value: "+180", label: "دولة حول العالم" },
  { value: "+2M", label: "معاملة يومياً" },
];

export default function StatsBar() {
  return (
    <section className="px-4 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {value}
                </span>
                <span className="text-sm text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
