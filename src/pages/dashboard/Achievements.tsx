
export const Achievements: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Достижения</h2>
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((ach) => (
            <div key={ach.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                {ach.icon}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm leading-none">{ach.title}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">{ach.date}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm font-medium italic">Пока наград нет...</p>
        )}
      </div>
    </div>
  );
};