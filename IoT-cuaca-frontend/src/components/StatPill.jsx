const StatPill = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
      <div className="w-12 h-12 flex items-center justify-center bg-white/6 rounded-lg text-white/90">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

export default StatPill;
