export const Tooltip: React.FC<{ text: string; step: number }> = ({ text, step }) => (
  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-100 animate-bounce">
    <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
      <div className="bg-amber-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black">
        {step}
      </div>
      <p className="text-amber-900 font-bold text-sm tracking-tight">{text}</p>
    </div>
  </div>
);