
import React, { useState, useEffect } from 'react';
import { Panel, CyberButton, StatBar, RangeInput } from './components/UI';
import { getTeamFromScheduleData } from './constants';
import { fetchDailySchedule } from './utils/schedule';
import { simulateMatchup } from './utils/engine';
import { Team, SimulationConfig, SimulationResult, ScheduleGame, SingleSimResult } from './types';
import { 
  Trophy, 
  Activity, 
  History as HistoryIcon, 
  Calendar, 
  Settings, 
  Play, 
  Trash2,
  Users,
  Cpu,
  RefreshCw,
  ChevronRight,
  Target,
  AlertTriangle,
  Clock,
  List,
  ArrowLeft,
  Zap,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Flame,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Sub-components for Views ---

const ScheduleList: React.FC<{
  games: ScheduleGame[];
  onSelect: (game: ScheduleGame) => void;
  selectedId: string | null;
  loading: boolean;
}> = ({ games, onSelect, selectedId, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-cyan-400/50">
        <RefreshCw className="animate-spin mb-3" size={32} />
        <span className="font-mono text-xs animate-pulse tracking-widest">ACQUIRING FEED...</span>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <span className="font-mono text-xs tracking-widest">NO GAMES SCHEDULED</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-white/5 rounded-lg overflow-hidden">
      <div className="bg-slate-950/80 p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
         <h4 className="text-sm md:text-xs font-bold text-slate-400 uppercase tracking-wider">
          Daily Slate ({games.length})
        </h4>
        <div className="flex items-center gap-2">
           <span className="text-sm md:text-xs font-mono text-slate-500">ODDS: ESPN BET</span>
           <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {games.map((game) => {
          const isSelected = selectedId === game.id;
          
          return (
            <div
              key={game.id}
              onClick={() => onSelect(game)}
              className={`
                cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 group
                ${isSelected 
                  ? 'bg-slate-800 ring-1 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.01]' 
                  : 'bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900'}
              `}
            >
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none -mr-6 -mt-6"></div>
              {isSelected && <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>}

              <div className="flex items-center justify-between p-4 sm:p-5 relative z-10">
                
                  {/* Away Team */}
                  <div className="flex flex-col items-center w-[30%] gap-1.5">
                     <div className={`w-14 h-14 lg:w-14 lg:h-14 rounded-full p-2 flex items-center justify-center border ${isSelected ? 'bg-black/40 border-cyan-500/30' : 'bg-slate-900 border-white/5'}`}>
                      {game.awayTeam.logo ? (
                        <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                      ) : (
                        <span className="text-lg md:text-base font-bold text-slate-400">{game.awayTeam.abbreviation.substring(0,2)}</span>
                      )}
                    </div>
                    <div className="text-center">
                       <div className={`text-xl md:text-base font-black font-sans leading-none ${game.awayTeam.rank || isSelected ? 'text-white' : 'text-slate-300'}`}>
                         {game.awayTeam.abbreviation}
                       </div>
                       {game.awayTeam.rank ? (
                         <div className="text-sm md:text-xs text-cyan-400 font-mono font-bold mt-1">#{game.awayTeam.rank}</div>
                       ) : (
                         <div className="h-4"></div>
                       )}
                    </div>
                  </div>

                  {/* Center Info / Odds */}
                  <div className="flex flex-col items-center justify-center w-[40%] text-center gap-2">
                     <span className="text-sm md:text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">{game.status.replace(/ PM.*$/, ' PM').replace(/ AM.*$/, ' AM')}</span>
                     
                     <div className="flex flex-col items-center gap-1.5 w-full">
                        {game.odds?.spread ? (
                          <div className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 w-full max-w-[100px] md:max-w-[90px]">
                             <div className="text-sm md:text-xs font-mono text-yellow-500 font-bold whitespace-nowrap text-center">
                                {game.odds.spread}
                             </div>
                          </div>
                        ) : (
                          <span className="text-sm md:text-xs font-mono text-slate-600">-</span>
                        )}
                        
                        {game.odds?.overUnder && (
                           <div className="text-sm md:text-xs font-mono text-slate-400">
                              O/U <span className="text-slate-200 font-bold">{game.odds.overUnder}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Home Team */}
                  <div className="flex flex-col items-center w-[30%] gap-1.5">
                     <div className={`w-14 h-14 lg:w-14 lg:h-14 rounded-full p-2 flex items-center justify-center border ${isSelected ? 'bg-black/40 border-rose-500/30' : 'bg-slate-900 border-white/5'}`}>
                      {game.homeTeam.logo ? (
                        <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                      ) : (
                        <span className="text-lg md:text-base font-bold text-slate-400">{game.homeTeam.abbreviation.substring(0,2)}</span>
                      )}
                    </div>
                    <div className="text-center">
                       <div className={`text-xl md:text-base font-black font-sans leading-none ${game.homeTeam.rank || isSelected ? 'text-white' : 'text-slate-300'}`}>
                         {game.homeTeam.abbreviation}
                       </div>
                       {game.homeTeam.rank ? (
                         <div className="text-sm md:text-xs text-rose-400 font-mono font-bold mt-1">#{game.homeTeam.rank}</div>
                       ) : (
                         <div className="h-4"></div>
                       )}
                    </div>
                  </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Single Sim Result Item ---
const SimResultItem: React.FC<{ sim: SingleSimResult; result: SimulationResult }> = ({ sim, result }) => {
  const isWinA = sim.winner === 'A';
  return (
    <div className={`
      flex items-center justify-between p-3 rounded border mb-1.5 text-sm font-mono group
      ${isWinA 
        ? 'bg-cyan-950/10 border-cyan-500/10 hover:bg-cyan-900/20 hover:border-cyan-500/30' 
        : 'bg-rose-950/10 border-rose-500/10 hover:bg-rose-900/20 hover:border-rose-500/30'}
      transition-all
    `}>
      <span className={`w-10 text-xs ${isWinA ? 'text-cyan-600/50 group-hover:text-cyan-500' : 'text-rose-600/50 group-hover:text-rose-500'}`}>#{sim.id}</span>
      
      <div className="flex gap-6 items-center flex-1 justify-center">
        <div className={`flex items-center gap-3 w-20 justify-end ${isWinA ? 'opacity-100' : 'opacity-50'}`}>
           <span className="font-bold">{result.teamA.abbrev}</span>
           <span className={`text-xl leading-none ${isWinA ? 'text-cyan-400 font-black' : 'text-slate-400'}`}>{sim.scoreA}</span>
        </div>
        
        <span className="text-slate-700 font-thin">|</span>
        
        <div className={`flex items-center gap-3 w-20 ${!isWinA ? 'opacity-100' : 'opacity-50'}`}>
           <span className={`text-xl leading-none ${!isWinA ? 'text-rose-400 font-black' : 'text-slate-400'}`}>{sim.scoreB}</span>
           <span className="font-bold">{result.teamB.abbrev}</span>
        </div>
      </div>
      
      <div className="w-10 text-right">
        {sim.isOT && <span className="text-yellow-600 font-bold text-xs bg-yellow-950/30 px-1.5 rounded">OT</span>}
      </div>
    </div>
  );
};

const SimulationView: React.FC<{
  result: SimulationResult;
  onReset: () => void;
  odds?: { spread?: string; overUnder?: number };
}> = ({ result, onReset, odds }) => {
  const [viewMode, setViewMode] = useState<'summary' | 'logs'>('summary');

  const probData = [
    { name: result.teamA.abbrev, prob: result.winProbA * 100, color: '#06b6d4' }, // Cyan
    { name: result.teamB.abbrev, prob: result.winProbB * 100, color: '#f43f5e' }, // Rose
  ];

  if (viewMode === 'logs') {
    const winsA = result.allSims.filter(s => s.winner === 'A').length;
    
    return (
      <div className="animate-fade-in flex flex-col h-full bg-slate-900/80 rounded-lg border border-white/10 overflow-hidden relative backdrop-blur-md">
        {/* Logs Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 shrink-0">
           <button onClick={() => setViewMode('summary')} className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors bg-cyan-950/30 px-3 py-1.5 rounded border border-cyan-500/20">
              <ArrowLeft size={14} /> Back
           </button>
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Trend</span>
                 <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{result.teamA.abbrev} {winsA}</span>
                    <span className="text-slate-600">-</span>
                    <span className="text-rose-400 font-bold">{result.teamB.abbrev} {result.simulationsRun - winsA}</span>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Logs List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4">
           <div className="grid grid-cols-1 gap-2">
              {result.allSims?.map((sim) => (
                <SimResultItem key={sim.id} sim={sim} result={result} />
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-full gap-4">
      {/* Scoreboard */}
      <div className="flex justify-between items-stretch bg-black border border-white/10 p-4 lg:p-6 relative overflow-hidden min-h-[160px] rounded-lg shrink-0 shadow-lg group">
        
        {/* Back Button */}
        <div className="absolute top-3 left-3 z-30">
           <button onClick={onReset} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-black/40 hover:bg-slate-800 px-3 py-1.5 rounded border border-white/5 hover:border-white/20">
              <ArrowLeft size={12} /> Back
           </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-slate-950/80 to-rose-950/20 transition-opacity group-hover:opacity-80"></div>
        
        {/* Team A (Away) */}
        <div className="flex flex-col items-center justify-center z-10 w-1/3 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
             <span className="text-sm md:text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-b border-b border-x border-cyan-500/20">Away</span>
          </div>
          <div className="text-8xl lg:text-9xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mt-6">
            {result.avgScoreA}
          </div>
          <div className="flex items-center gap-3 mt-3 opacity-90">
            {result.teamA.logoUrl && <img src={result.teamA.logoUrl} className="w-10 h-10 md:w-8 md:h-8 object-contain" />}
            <div className="text-cyan-400 font-bold uppercase tracking-widest text-2xl md:text-2xl">{result.teamA.abbrev}</div>
          </div>
          <div className="text-sm md:text-xs text-slate-500 font-mono mt-2 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded">
             <Target size={14} className="md:w-3 md:h-3" /> Win Prob: {(result.winProbA * 100).toFixed(1)}%
          </div>
        </div>

        {/* VS / Info */}
        <div className="flex flex-col items-center justify-center z-10 w-1/3 gap-4">
          <div className="text-slate-800 font-sans font-black italic text-6xl lg:text-7xl select-none">VS</div>
          
          {/* Odds Display */}
          {(odds?.spread || odds?.overUnder) && (
             <div className="flex flex-col items-center gap-1.5 mb-2">
                {odds.spread && (
                    <span className="text-yellow-500 font-mono font-bold text-base md:text-sm bg-yellow-950/30 px-3 py-1 rounded border border-yellow-600/30">{odds.spread}</span>
                )}
                {odds.overUnder && (
                    <span className="text-slate-400 font-mono text-sm md:text-xs">O/U <span className="text-white font-bold">{odds.overUnder}</span></span>
                )}
             </div>
          )}

          <button 
             onClick={() => setViewMode('logs')}
             className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded text-sm md:text-xs font-mono text-cyan-400 border border-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 shadow-lg group-hover:border-cyan-400"
          >
             <List size={16} className="md:w-3.5 md:h-3.5" /> <span className="font-bold">VIEW LOGS</span> <span className="text-cyan-600">({result.simulationsRun})</span>
          </button>
        </div>

        {/* Team B (Home) */}
        <div className="flex flex-col items-center justify-center z-10 w-1/3 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2">
             <span className="text-sm md:text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-950/60 px-3 py-1 rounded-b border-b border-x border-rose-500/20">Home</span>
          </div>
           <div className="text-8xl lg:text-9xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] mt-6">
            {result.avgScoreB}
          </div>
          <div className="flex items-center gap-3 mt-3 opacity-90">
            <div className="text-rose-400 font-bold uppercase tracking-widest text-2xl md:text-2xl">{result.teamB.abbrev}</div>
            {result.teamB.logoUrl && <img src={result.teamB.logoUrl} className="w-10 h-10 md:w-8 md:h-8 object-contain" />}
          </div>
          <div className="text-sm md:text-xs text-slate-500 font-mono mt-2 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded">
             <Target size={14} className="md:w-3 md:h-3" /> Win Prob: {(result.winProbB * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <Panel title="Win Probability" className="h-full min-h-[250px] flex flex-col">
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart layout="vertical" data={probData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" tick={{fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold'}} width={50} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc' }} 
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={32}>
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </Panel>

        <Panel title="Simulated Flow (40m Regulation)" className="h-full min-h-[250px] flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 relative">
            {/* Timeline Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2"></div>
            
            <div className="space-y-4 py-2">
              {result.flow?.map((segment, idx, arr) => {
                // Calculate point differential for this specific segment to determine momentum
                const prevScoreA = idx > 0 ? arr[idx-1].scoreA : 0;
                const prevScoreB = idx > 0 ? arr[idx-1].scoreB : 0;
                const segPointsA = segment.scoreA - prevScoreA;
                const segPointsB = segment.scoreB - prevScoreB;
                const net = segPointsA - segPointsB; // > 0 Team A wins segment, < 0 Team B wins segment
                
                const isRun = Math.abs(net) >= 5; // "Run" if net diff is 5+ points in 5 mins
                const hasEvent = segment.eventLog.length > 0;
                
                return (
                  <div key={idx} className={`relative flex items-center justify-between text-base md:text-sm font-mono group p-2 rounded transition-colors ${hasEvent ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                     
                     {/* Time Marker - Floating */}
                     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className={`
                            text-sm md:text-xs font-bold px-2 py-1 rounded border backdrop-blur-md shadow-lg min-w-[50px] text-center
                            ${hasEvent ? 'bg-yellow-950/80 border-yellow-600/50 text-yellow-500' : 'bg-slate-900 border-slate-700 text-slate-400'}
                        `}>
                            {segment.timeDisplay}
                        </div>
                     </div>

                     {/* Left Side (Team A) */}
                     <div className="flex-1 flex items-center justify-end gap-4 pr-10 relative">
                        {/* Momentum Background Gradient for A */}
                        {net > 0 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-full opacity-10 pointer-events-none bg-gradient-to-l from-cyan-500 to-transparent rounded-r"></div>
                        )}
                        
                        {/* Run Indicator Icon */}
                        {isRun && net > 0 && <Flame size={16} className="md:w-3.5 md:h-3.5 text-cyan-400 animate-pulse drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />}
                        
                        <div className="flex flex-col items-end">
                            <span className={`text-xl md:text-lg ${net > 0 ? 'text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`}>
                                {segment.scoreA}
                            </span>
                            <span className="text-sm md:text-xs text-slate-600 font-bold">+{segPointsA}</span>
                        </div>
                     </div>

                     {/* Right Side (Team B) */}
                     <div className="flex-1 flex items-center gap-4 pl-10 relative">
                         {/* Momentum Background Gradient for B */}
                         {net < 0 && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-full opacity-10 pointer-events-none bg-gradient-to-r from-rose-500 to-transparent rounded-l"></div>
                        )}
                        
                        <div className="flex flex-col">
                            <span className={`text-xl md:text-lg ${net < 0 ? 'text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'text-slate-500'}`}>
                                {segment.scoreB}
                            </span>
                            <span className="text-sm md:text-xs text-slate-600 font-bold">+{segPointsB}</span>
                        </div>
                        
                        {/* Run Indicator Icon */}
                        {isRun && net < 0 && <Flame size={16} className="md:w-3.5 md:h-3.5 text-rose-400 animate-pulse drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]" />}
                     </div>

                     {/* Event Overlay - Neon Box */}
                     {hasEvent && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 -mt-1 w-max max-w-[90%]">
                           <div className="bg-yellow-950/90 border border-yellow-500/40 text-yellow-300 text-sm md:text-xs font-bold px-2.5 py-1 rounded shadow-[0_0_15px_rgba(234,179,8,0.3)] backdrop-blur-md flex items-center gap-1.5 transform hover:scale-105 transition-transform">
                              <Zap size={14} className="md:w-3 md:h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
                              <span className="uppercase tracking-wide">{segment.eventLog[0]}</span>
                           </div>
                        </div>
                     )}

                  </div>
                );
              })}
              <div className="text-center pt-6 pb-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-white/10 text-[10px] text-slate-400 uppercase tracking-widest shadow-inner">
                  <CheckCircle2 size={12} className="text-slate-600" /> End of Regulation
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="flex justify-center pb-1 pt-2 shrink-0">
        <CyberButton onClick={onReset} variant="primary" className="w-full md:w-auto min-w-[240px]">
          Simulate Next
        </CyberButton>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'sim' | 'history'>('sim');
  const [schedule, setSchedule] = useState<ScheduleGame[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [selectedGame, setSelectedGame] = useState<ScheduleGame | null>(null);
  
  const [config, setConfig] = useState<SimulationConfig>({
    iterations: 50,
    chaosFactor: 0.05,
    neutralCourt: false
  });
  
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simDate, setSimDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load schedule when date changes
  useEffect(() => {
    const loadData = async () => {
      setLoadingSchedule(true);
      setSelectedGame(null); 
      setSimResult(null);
      const games = await fetchDailySchedule(simDate);
      setSchedule(games);
      setLoadingSchedule(false);
    };
    loadData();
  }, [simDate]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('ncaa_sim_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { console.error("Failed to load history"); }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('ncaa_sim_history', JSON.stringify(history));
  }, [history]);

  const handleSimulate = () => {
    if (!selectedGame) return;
    setIsSimulating(true);
    setErrorMsg(null);

    try {
      const tA = getTeamFromScheduleData(selectedGame.awayTeam.name, selectedGame.awayTeam.id, selectedGame.awayTeam.logo, selectedGame.awayTeam.rank);
      const tB = getTeamFromScheduleData(selectedGame.homeTeam.name, selectedGame.homeTeam.id, selectedGame.homeTeam.logo, selectedGame.homeTeam.rank);
      
      setTimeout(() => {
        try {
          const result = simulateMatchup(tA, tB, config);
          if (!result || !result.flow) throw new Error("Simulation failed");
          setSimResult(result);
          setHistory(prev => [result, ...prev]);
        } catch (e) {
          console.error("Simulation Engine Error:", e);
          setErrorMsg("Simulation Engine Error. Try again.");
        } finally {
           setIsSimulating(false);
        }
      }, 800);

    } catch (e) {
      console.error("Setup Error:", e);
      setErrorMsg("Failed to initialize teams.");
      setIsSimulating(false);
    }
  };

  const adjustDate = (days: number) => {
    const date = new Date(simDate);
    date.setDate(date.getDate() + days);
    setSimDate(date.toISOString().split('T')[0]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="h-screen bg-game-dark text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md z-50 shrink-0 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 truncate">
              NCAA<span className="text-cyan-400">SIM</span>26
            </h1>
          </div>
          
          <nav className="flex gap-2 sm:gap-4">
             <button 
               onClick={() => { setActiveTab('sim'); setSimResult(null); }}
               className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm uppercase font-bold transition-colors ${activeTab === 'sim' ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
             >
               <Activity size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Dashboard</span>
             </button>
             <button 
               onClick={() => setActiveTab('history')}
               className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm uppercase font-bold transition-colors ${activeTab === 'history' ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
             >
               <HistoryIcon size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">History</span>
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-0">
        
        {activeTab === 'sim' && !simResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
            
            {/* Left: Schedule (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full min-h-0">
              <Panel className="flex flex-col h-full gap-4">
                <div className="shrink-0">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold text-slate-500 tracking-wider">SELECT DATE</span>
                     <div className="flex gap-1">
                        <button onClick={() => setSimDate(new Date().toISOString().split('T')[0])} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors border border-white/5">TODAY</button>
                        <button onClick={() => adjustDate(1)} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors border border-white/5">+1</button>
                     </div>
                   </div>
                   <div className="relative group">
                      <input 
                        type="date" 
                        value={simDate}
                        onChange={(e) => setSimDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 pl-3 text-white font-mono text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-colors group-hover:border-slate-600"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                   </div>
                </div>
                
                <div className="flex-1 min-h-0">
                  <ScheduleList 
                    games={schedule} 
                    selectedId={selectedGame?.id || null} 
                    onSelect={setSelectedGame}
                    loading={loadingSchedule}
                  />
                </div>
              </Panel>
            </div>

            {/* Right: Sim Stage (Desktop) */}
            <div className="hidden lg:flex lg:col-span-7 flex-col h-full min-h-0">
              <div className="flex-1 bg-gradient-to-b from-slate-900 to-black border border-white/10 p-0 flex flex-col relative overflow-hidden rounded-lg group shadow-2xl">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                 
                 {selectedGame ? (
                   <div className="flex flex-col h-full w-full z-10 relative">
                      {/* Matchup Header */}
                      <div className="flex-1 flex flex-col justify-center items-center py-6 px-4">
                        <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
                          
                          {/* Away */}
                          <div className="flex flex-col items-center w-5/12">
                             <div className="mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]">Away</span>
                             </div>
                            <div className="w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-black/60 p-5 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(8,145,178,0.1)] border border-white/10 group-hover:border-cyan-500/30 transition-all duration-500 relative">
                               {selectedGame.awayTeam.logo ? (
                                <img src={selectedGame.awayTeam.logo} className="w-full h-full object-contain drop-shadow-xl z-10" />
                               ) : (
                                <span className="text-3xl font-bold text-slate-600">{selectedGame.awayTeam.abbreviation.substring(0,2)}</span>
                               )}
                               <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-xl"></div>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase italic leading-none tracking-tighter text-white drop-shadow-md text-center">{selectedGame.awayTeam.abbreviation}</h2>
                            {selectedGame.awayTeam.rank && <div className="text-cyan-500 font-mono text-sm mt-2 font-bold tracking-widest">#{selectedGame.awayTeam.rank}</div>}
                          </div>

                          {/* VS Info */}
                          <div className="flex flex-col items-center justify-center w-2/12 h-full pb-8">
                             <span className="text-7xl font-black text-white/5 italic select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 pointer-events-none">VS</span>
                             <span className="text-4xl font-black text-slate-700 italic relative z-10 drop-shadow-lg">VS</span>
                             <div className="mt-4 flex flex-col items-center gap-1">
                                {selectedGame.odds?.spread && (
                                    <span className="text-yellow-500 font-mono font-bold text-xs bg-yellow-950/30 px-2 py-0.5 rounded border border-yellow-600/30">{selectedGame.odds.spread}</span>
                                )}
                                {selectedGame.odds?.overUnder && (
                                    <span className="text-slate-400 font-mono text-[10px]">O/U <span className="text-white font-bold">{selectedGame.odds.overUnder}</span></span>
                                )}
                             </div>
                          </div>

                          {/* Home */}
                          <div className="flex flex-col items-center w-5/12">
                             <div className="mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/50 px-3 py-1 rounded border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]">Home</span>
                             </div>
                             <div className="w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-black/60 p-5 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(225,29,72,0.1)] border border-white/10 group-hover:border-rose-500/30 transition-all duration-500 relative">
                               {selectedGame.homeTeam.logo ? (
                                <img src={selectedGame.homeTeam.logo} className="w-full h-full object-contain drop-shadow-xl z-10" />
                               ) : (
                                <span className="text-3xl font-bold text-slate-600">{selectedGame.homeTeam.abbreviation.substring(0,2)}</span>
                               )}
                               <div className="absolute inset-0 bg-rose-500/5 rounded-full blur-xl"></div>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase italic leading-none tracking-tighter text-white drop-shadow-md text-center">{selectedGame.homeTeam.abbreviation}</h2>
                             {selectedGame.homeTeam.rank && <div className="text-rose-500 font-mono text-sm mt-2 font-bold tracking-widest">#{selectedGame.homeTeam.rank}</div>}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="shrink-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-6 flex flex-col items-center gap-5">
                        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl px-4">
                           <div className="flex-1">
                             <div className="flex justify-between mb-2 items-end">
                               <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Simulations</label>
                               <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">{config.iterations}</span>
                             </div>
                             <input 
                               type="range" min="10" max="200" step="10"
                               value={config.iterations}
                               onChange={(e) => setConfig({...config, iterations: Number(e.target.value)})}
                               className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                             />
                           </div>
                           <div className="flex-1">
                             <div className="flex justify-between mb-2 items-end">
                               <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Chaos Factor</label>
                               <span className="text-xs font-mono text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">{(config.chaosFactor * 100).toFixed(0)}%</span>
                             </div>
                             <input 
                               type="range" min="0" max="0.2" step="0.01"
                               value={config.chaosFactor}
                               onChange={(e) => setConfig({...config, chaosFactor: Number(e.target.value)})}
                               className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all"
                             />
                           </div>
                        </div>

                        {errorMsg && (
                          <div className="w-full max-w-md flex items-center justify-center gap-2 text-rose-400 bg-rose-950/40 px-3 py-1.5 rounded border border-rose-500/20 text-xs font-bold animate-pulse">
                            <AlertTriangle size={14} /> {errorMsg}
                          </div>
                        )}

                        <CyberButton 
                          onClick={handleSimulate} 
                          disabled={isSimulating}
                          className="w-full max-w-md h-14 text-xl shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_40px_rgba(8,145,178,0.5)] mt-1"
                        >
                           {isSimulating ? (
                             <span className="flex items-center gap-3 justify-center">
                               <Cpu className="animate-spin text-cyan-300" size={24} /> 
                               <span className="tracking-widest">RUNNING...</span>
                             </span>
                           ) : 'INITIATE SIMULATION'}
                        </CyberButton>
                      </div>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-600 z-10">
                     <Target size={80} className="mb-6 opacity-20" />
                     <p className="font-mono text-sm uppercase tracking-widest opacity-50">Select a matchup from the slate</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Mobile Selection & Sim Overlay */}
             {selectedGame && (
                <div className="fixed inset-0 z-50 lg:hidden bg-game-dark flex flex-col animate-fade-in">
                   <div className="flex items-center p-4 border-b border-white/10 bg-slate-950">
                      <button onClick={() => setSelectedGame(null)} className="p-2 -ml-2 text-slate-400 hover:text-white">
                         <ArrowLeft size={24} />
                      </button>
                      <h3 className="font-bold uppercase tracking-wider ml-2">Matchup Selected</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                       {/* Mobile Matchup Card */}
                       <div className="flex justify-between items-center px-4 py-8 bg-gradient-to-b from-slate-900 to-black rounded-lg border border-white/10 relative overflow-hidden">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                           <div className="z-10 flex flex-col items-center w-1/3">
                              <img src={selectedGame.awayTeam.logo} className="w-24 h-24 object-contain mb-3" />
                              <span className="text-3xl font-black text-white leading-none">{selectedGame.awayTeam.abbreviation}</span>
                              <span className="text-base font-mono text-cyan-500 font-bold mt-1">#{selectedGame.awayTeam.rank || '-'}</span>
                           </div>
                           <div className="z-10 flex flex-col items-center w-1/3">
                              <span className="text-5xl font-black text-slate-700 italic">VS</span>
                              <div className="mt-3 flex flex-col items-center gap-1.5">
                                {selectedGame.odds?.spread && <span className="bg-yellow-950/50 text-yellow-500 text-sm px-3 py-1.5 rounded border border-yellow-600/30 whitespace-nowrap">{selectedGame.odds.spread}</span>}
                                {selectedGame.odds?.overUnder && <span className="text-slate-500 text-sm font-mono">O/U <span className="text-white">{selectedGame.odds.overUnder}</span></span>}
                              </div>
                           </div>
                           <div className="z-10 flex flex-col items-center w-1/3">
                              <img src={selectedGame.homeTeam.logo} className="w-24 h-24 object-contain mb-3" />
                              <span className="text-3xl font-black text-white leading-none">{selectedGame.homeTeam.abbreviation}</span>
                              <span className="text-base font-mono text-rose-500 font-bold mt-1">#{selectedGame.homeTeam.rank || '-'}</span>
                           </div>
                       </div>
                       
                       {/* Mobile Controls */}
                       <div className="bg-slate-900/50 p-6 rounded-lg border border-white/5 space-y-6">
                           <div>
                             <div className="flex justify-between mb-2">
                               <label className="text-sm font-bold uppercase text-slate-400">Simulations</label>
                               <span className="text-sm font-mono text-cyan-400">{config.iterations}</span>
                             </div>
                             <input 
                               type="range" min="10" max="200" step="10"
                               value={config.iterations}
                               onChange={(e) => setConfig({...config, iterations: Number(e.target.value)})}
                               className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                             />
                           </div>
                            <div>
                             <div className="flex justify-between mb-2">
                               <label className="text-sm font-bold uppercase text-slate-400">Chaos Factor</label>
                               <span className="text-sm font-mono text-rose-400">{(config.chaosFactor * 100).toFixed(0)}%</span>
                             </div>
                             <input 
                               type="range" min="0" max="0.2" step="0.01"
                               value={config.chaosFactor}
                               onChange={(e) => setConfig({...config, chaosFactor: Number(e.target.value)})}
                               className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500"
                             />
                           </div>
                           
                           {errorMsg && (
                            <div className="text-rose-400 text-sm font-bold text-center bg-rose-950/30 py-2 rounded">{errorMsg}</div>
                           )}

                           <CyberButton 
                              onClick={handleSimulate} 
                              disabled={isSimulating}
                              className="w-full h-16 text-2xl"
                            >
                               {isSimulating ? 'RUNNING...' : 'SIMULATE'}
                            </CyberButton>
                       </div>
                   </div>
                </div>
             )}

          </div>
        )}

        {activeTab === 'sim' && simResult && (
          <SimulationView 
            result={simResult} 
            onReset={() => setSimResult(null)} 
            odds={selectedGame?.odds}
          />
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in h-full overflow-y-auto custom-scrollbar pb-4 bg-slate-900/30 p-4 sm:p-6 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                 <HistoryIcon size={20} className="text-slate-500" /> Archive
              </h2>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 hover:text-white border border-rose-900 px-3 py-1 rounded uppercase font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Clear All
              </button>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-32 text-slate-600 font-mono tracking-widest text-sm flex flex-col items-center gap-4">
                <HistoryIcon size={48} className="opacity-20" />
                NO SIMULATION DATA ARCHIVED
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {history.map((h) => (
                  <div key={h.id} className="relative bg-slate-950 border border-white/5 p-4 hover:bg-slate-900 transition-colors rounded-lg group shadow-sm hover:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
                    
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(h.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-slate-700 hover:text-rose-500 hover:bg-rose-950/30 rounded transition-all opacity-100 md:opacity-0 group-hover:opacity-100 z-10"
                      title="Delete Entry"
                    >
                      <X size={14} />
                    </button>

                    {/* Meta Info */}
                    <div className="flex md:flex-col justify-between md:justify-center w-full md:w-32 shrink-0 gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-2 md:pb-0 md:pr-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                          <span className="text-[9px] font-mono text-slate-600">{new Date(h.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                       <div className="flex gap-3 md:flex-col md:gap-1.5 mt-1">
                          <div className="flex items-center gap-1.5" title="Simulations Run">
                            <RefreshCw size={10} className="text-cyan-600" />
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">{h.config?.iterations || 50} <span className="text-slate-600 font-normal">SIMS</span></span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Chaos Factor">
                            <Zap size={10} className="text-rose-600" />
                            <span className="text-[10px] font-mono text-rose-400 font-bold">{(h.config?.chaosFactor * 100 || 5).toFixed(0)}% <span className="text-slate-600 font-normal">CHAOS</span></span>
                          </div>
                       </div>
                    </div>

                    {/* Matchup Content */}
                    <div className="flex items-center justify-between flex-1 w-full px-2">
                       <div className="flex items-center gap-2 md:gap-4 w-[40%] justify-end">
                          <span className={`text-base md:text-xl font-bold font-sans tracking-tight truncate ${h.avgScoreA > h.avgScoreB ? 'text-cyan-400' : 'text-slate-500'}`}>{h.teamA.abbrev}</span>
                          {h.teamA.logoUrl && <img src={h.teamA.logoUrl} className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />}
                       </div>
                       
                       <div className="flex flex-col items-center px-4 py-1 bg-black/40 rounded border border-white/5 min-w-[90px]">
                          <div className="text-xl md:text-2xl font-bold font-mono text-white tracking-widest whitespace-nowrap">
                             {h.avgScoreA} - {h.avgScoreB}
                          </div>
                       </div>

                       <div className="flex items-center gap-2 md:gap-4 w-[40%]">
                          {h.teamB.logoUrl && <img src={h.teamB.logoUrl} className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />}
                          <span className={`text-base md:text-xl font-bold font-sans tracking-tight truncate ${h.avgScoreB > h.avgScoreA ? 'text-rose-400' : 'text-slate-500'}`}>{h.teamB.abbrev}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
