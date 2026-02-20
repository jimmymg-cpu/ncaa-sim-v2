import React from 'react';

// Neon Button
export const CyberButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled }) => {
  const colors = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]',
    danger: 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]',
    success: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-sans font-bold uppercase tracking-wider 
        border-l-4 transition-all duration-200 transform skew-x-[-10deg]
        active:translate-y-1 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colors[variant]}
        ${className}
      `}
    >
      <span className="block skew-x-[10deg]">{children}</span>
    </button>
  );
};

// Panel
export const Panel: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-game-panel border border-white/10 backdrop-blur-sm p-6 relative overflow-hidden ${className}`}>
    {/* Decorative corner accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></div>
    
    {title && (
      <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
        <div className="w-1 h-4 bg-cyan-500 skew-x-[-12deg]"></div>
        <h3 className="font-sans font-bold text-lg text-gray-100 uppercase tracking-widest">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// Stat Bar
export const StatBar: React.FC<{ label: string; value: number; max: number; color?: string }> = ({ label, value, max, color = 'bg-cyan-500' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex justify-between text-sm font-mono text-gray-400 uppercase">
        <span>{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 skew-x-[-12deg] overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Range Slider
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
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold uppercase tracking-wider text-cyan-400">{label}</label>
        <span className="font-mono text-base text-white">{formatValue ? formatValue(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
};
