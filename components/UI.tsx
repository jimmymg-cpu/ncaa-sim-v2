import React from 'react';

// Console Action Button
export const CyberButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled }) => {
  const colors = {
    primary: 'bg-console-blue hover:bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]',
    danger: 'bg-console-red hover:bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]',
    success: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 font-display font-bold uppercase tracking-widest text-xl
        rounded-sm border-b-4 transition-all duration-150 transform
        active:translate-y-1 active:border-b-0 active:mt-1 active:mb-[-1px] active:shadow-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-4
        ${colors[variant]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      {/* Glossy inner top highlight */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-sm"></div>
    </button>
  );
};

// Console Glass Panel
export const Panel: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-console-surface/80 backdrop-blur-xl border border-white/10 rounded-xl relative overflow-hidden shadow-2xl ${className}`}>

    {/* Subtle texture overlay */}
    <div className="absolute inset-0 bg-carbon-texture opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

    {/* Corner Glow Accents */}
    <div className="absolute -top-10 -left-10 w-20 h-20 bg-console-blue/20 blur-3xl rounded-full"></div>
    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-console-red/20 blur-3xl rounded-full"></div>

    <div className="p-5 lg:p-7 relative z-10 h-full flex flex-col">
      {title && (
        <div className="mb-5 flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="w-1.5 h-6 bg-console-gold rounded-full"></div>
          <h3 className="font-display font-bold text-2xl lg:text-3xl text-white uppercase tracking-wider leading-none mt-1">{title}</h3>
        </div>
      )}
      {children}
    </div>
  </div>
);

// Thick Console Stat Bar
export const StatBar: React.FC<{ label: string; value: number; max: number; color?: string }> = ({ label, value, max, color = 'bg-console-blue' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <div className="flex justify-between text-sm md:text-base font-sans font-bold text-slate-300 uppercase tracking-wide">
        <span>{label}</span>
        <span className="text-white bg-black/40 px-2 rounded">{value}</span>
      </div>
      <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div
          className={`h-full ${color} transition-all duration-700 ease-out shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Touch-Friendly Range Slider
export const RangeInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
}> = ({ label, value, min, max, step = 1, onChange, formatValue }) => {
  return (
    <div className="mb-5 bg-black/20 p-4 rounded-lg border border-white/5">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-300">{label}</label>
        <span className="font-display text-xl text-console-gold bg-black/60 px-3 py-0.5 rounded border border-console-gold/20 shadow-inner">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 bg-black/60 rounded-full appearance-none cursor-pointer accent-console-gold shadow-inner hover:accent-yellow-400 transition-all border border-white/5"
      />
    </div>
  );
};
