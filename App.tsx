
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
      <div className="flex flex-col items-center justify-center h-64 text-console-blue/50">
        <RefreshCw className="animate-spin mb-3" size={40} />
        <span className="font-display text-2xl animate-pulse tracking-widest text-shadow">LOADING MATCHUPS...</span>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <span className="font-display text-2xl tracking-widest">NO GAMES SCHEDULED</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl overflow-hidden border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="bg-console-surface/90 p-5 border-b border-white/10 flex justify-between items-center sticky top-0 z-20 backdrop-blur-xl">
        <h4 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider leading-none">
          Daily Slate <span className="text-console-gold">({games.length})</span>
        </h4>
        <div className="flex items-center gap-3">
          <span className="text-sm font-sans font-bold text-slate-400">ODDS: ESPN BET</span>
          <div className="w-3 h-3 rounded-full bg-console-red animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {games.map((game) => {
          const isSelected = selectedId === game.id;

          return (
            <div
              key={game.id}
              onClick={() => onSelect(game)}
              className={`
                cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 group
                ${isSelected
                  ? 'bg-console-blue/20 ring-2 ring-console-blue shadow-[0_0_30px_rgba(37,99,235,0.3)] scale-[1.02] border border-console-blue/50'
                  : 'bg-console-surface border border-white/5 hover:border-console-gold/50 hover:bg-white/5 drop-shadow-xl'}
              `}
            >
              {/* Background Accents */}
              <div className="absolute inset-0 bg-carbon-texture opacity-[0.05] mix-blend-overlay"></div>
              {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-console-blue/20 via-transparent to-console-blue/20 pointer-events-none mix-blend-screen"></div>}

              <div className="flex items-center justify-between p-4 sm:p-6 relative z-10">

                {/* Away Team */}
                <div className="flex flex-col items-center w-[30%] gap-2">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full p-2 flex items-center justify-center border shadow-lg ${isSelected ? 'bg-black/60 border-console-blue flex-shrink-0' : 'bg-black/40 border-white/10'}`}>
                    {game.awayTeam.logo ? (
                      <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-full h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : (
                      <span className="text-2xl font-display font-bold text-slate-400">{game.awayTeam.abbreviation.substring(0, 2)}</span>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <div className={`text-3xl md:text-2xl font-display font-bold leading-none tracking-wide ${game.awayTeam.rank || isSelected ? 'text-white drop-shadow-md' : 'text-slate-300'}`}>
                      {game.awayTeam.abbreviation}
                    </div>
                    {game.awayTeam.rank ? (
                      <div className="text-sm md:text-base text-console-gold font-sans font-bold mt-1 bg-black/50 px-2 rounded-sm inline-block border border-console-gold/20">#{game.awayTeam.rank}</div>
                    ) : (
                      <div className="h-6"></div>
                    )}
                  </div>
                </div>

                {/* Center Info / Odds */}
                <div className="flex flex-col items-center justify-center w-[40%] text-center gap-3">
                  <span className="text-base md:text-sm text-slate-400 font-sans font-bold uppercase tracking-widest">{game.status.replace(/ PM.*$/, ' PM').replace(/ AM.*$/, ' AM')}</span>

                  <div className="flex flex-col items-center gap-2 w-full">
                    {game.odds?.spread ? (
                      <div className="bg-black/60 border border-console-blue/30 rounded py-1.5 px-3 w-full max-w-[120px] shadow-inner">
                        <div className="text-base md:text-sm font-sans text-console-blue font-bold whitespace-nowrap text-center">
                          {game.odds.spread}
                        </div>
                      </div>
                    ) : (
                      <span className="text-base md:text-sm font-sans text-slate-600 font-bold">-</span>
                    )}

                    {game.odds?.overUnder && (
                      <div className="text-sm md:text-xs font-sans font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                        O/U <span className="text-white">{game.odds.overUnder}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Home Team */}
                <div className="flex flex-col items-center w-[30%] gap-2">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full p-2 flex items-center justify-center border shadow-lg ${isSelected ? 'bg-black/60 border-console-red flex-shrink-0' : 'bg-black/40 border-white/10'}`}>
                    {game.homeTeam.logo ? (
                      <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-full h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : (
                      <span className="text-2xl font-display font-bold text-slate-400">{game.homeTeam.abbreviation.substring(0, 2)}</span>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <div className={`text-3xl md:text-2xl font-display font-bold leading-none tracking-wide ${game.homeTeam.rank || isSelected ? 'text-white drop-shadow-md' : 'text-slate-300'}`}>
                      {game.homeTeam.abbreviation}
                    </div>
                    {game.homeTeam.rank ? (
                      <div className="text-sm md:text-base text-console-red font-sans font-bold mt-1 bg-black/50 px-2 rounded-sm inline-block border border-console-red/20">#{game.homeTeam.rank}</div>
                    ) : (
                      <div className="h-6"></div>
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
      flex items-center justify-between p-4 rounded-lg mb-2 shadow-sm border group transform hover:-translate-y-0.5
      ${isWinA
        ? 'bg-console-blue/10 border-console-blue/30 hover:bg-console-blue/20 hover:border-console-blue/50'
        : 'bg-console-red/10 border-console-red/30 hover:bg-console-red/20 hover:border-console-red/50'}
      transition-all
    `}>
      <span className={`w-12 text-sm font-display font-bold ${isWinA ? 'text-console-blue/60 group-hover:text-console-blue' : 'text-console-red/60 group-hover:text-console-red'}`}>#{sim.id}</span>

      <div className="flex gap-6 items-center flex-1 justify-center">
        <div className={`flex items-center gap-4 w-24 justify-end ${isWinA ? 'opacity-100 drop-shadow-md' : 'opacity-60'}`}>
          <span className="font-display font-bold text-xl">{result.teamA.abbrev}</span>
          <span className={`text-3xl font-score ${isWinA ? 'text-white' : 'text-slate-400'}`}>{sim.scoreA}</span>
        </div>

        <span className="text-slate-600 font-bold text-xl">VS</span>

        <div className={`flex items-center gap-4 w-24 ${!isWinA ? 'opacity-100 drop-shadow-md' : 'opacity-60'}`}>
          <span className={`text-3xl font-score ${!isWinA ? 'text-white' : 'text-slate-400'}`}>{sim.scoreB}</span>
          <span className="font-display font-bold text-xl">{result.teamB.abbrev}</span>
        </div>
      </div>

      <div className="w-12 text-right">
        {sim.isOT && <span className="text-console-gold font-bold font-sans text-sm bg-console-gold/20 px-2 py-1 rounded border border-console-gold/40">OT</span>}
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
    { name: result.teamA.abbrev, prob: result.winProbA * 100, color: '#2563eb' }, // Blue
    { name: result.teamB.abbrev, prob: result.winProbB * 100, color: '#dc2626' }, // Red
  ];

  // Calculate ATS and O/U Probabilities
  let coverProbA = null;
  let coverProbB = null;
  let overProb = null;
  let underProb = null;

  if (odds && result.allSims.length > 0) {
    // 1. Over/Under
    if (odds.overUnder) {
      let overCount = 0;
      let underCount = 0;
      const ouLine = odds.overUnder;

      result.allSims.forEach(sim => {
        const total = sim.scoreA + sim.scoreB;
        if (total > ouLine) overCount++;
        else if (total < ouLine) underCount++;
        // pushes intentionally ignored for strict win prob
      });

      overProb = (overCount / result.allSims.length) * 100;
      underProb = (underCount / result.allSims.length) * 100;
    }

    // 2. Spread (ATS)
    if (odds.spread) {
      // Parse spread string e.g. "HOU -2.5" -> Team, Value
      const parts = odds.spread.trim().split(' ');
      if (parts.length >= 2) {
        const spreadTeam = parts[0];
        const spreadVal = parseFloat(parts[1]);

        // Determine whether Team A or Team B is the favorite
        const isAFav = result.teamA.abbrev === spreadTeam;
        const isBFav = result.teamB.abbrev === spreadTeam;

        if (!isNaN(spreadVal) && (isAFav || isBFav)) {
          let coverACount = 0;
          let coverBCount = 0;

          result.allSims.forEach(sim => {
            // Calculate margin relative to A
            // if A wins 70-60, margin is +10. If A loses 60-70, margin is -10.
            const marginA = sim.scoreA - sim.scoreB;

            if (isAFav) {
              // A is favorite, must win by MORE than the spread value (which is negative)
              // e.g. A -2.5. MarginA must be > 2.5. So A + spreadVal > 0 
              // (marginA 3) + (-2.5) = 0.5 > 0 (Cover)
              if (marginA + spreadVal > 0) coverACount++;
              else if (marginA + spreadVal < 0) coverBCount++;
            } else if (isBFav) {
              // B is favorite. MarginA is negative for B wins.
              // e.g. B -2.5. Margin for B must be > 2.5. MarginA must be < -2.5.
              // (marginA -3) - (-2.5) = -0.5 < 0 (Cover B)
              // B cover: scoreB - scoreA + spreadVal > 0 => -marginA + spreadVal > 0
              if (-marginA + spreadVal > 0) coverBCount++;
              else if (-marginA + spreadVal < 0) coverACount++;
            }
          });

          coverProbA = (coverACount / result.allSims.length) * 100;
          coverProbB = (coverBCount / result.allSims.length) * 100;
        }
      }
    }
  }

  if (viewMode === 'logs') {
    const winsA = result.allSims.filter(s => s.winner === 'A').length;

    return (
      <div className="animate-fade-in flex flex-col h-full bg-console-surface/90 rounded-xl border border-white/10 overflow-hidden relative backdrop-blur-xl shadow-2xl">
        {/* Logs Header */}
        <div className="flex items-center justify-between p-5 lg:p-6 border-b border-white/10 bg-black/60 shrink-0">
          <button onClick={() => setViewMode('summary')} className="flex items-center gap-2 text-white text-sm md:text-base font-bold uppercase tracking-wider hover:text-console-gold transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 hover:border-console-gold/50 shadow-sm">
            <ArrowLeft size={16} /> Returns
          </button>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Series Trend</span>
              <div className="flex items-center gap-3 font-display text-2xl">
                <span className="text-console-blue font-bold drop-shadow-md">{result.teamA.abbrev} {winsA}</span>
                <span className="text-slate-600">-</span>
                <span className="text-console-red font-bold drop-shadow-md">{result.teamB.abbrev} {result.simulationsRun - winsA}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-game-dark">
          <div className="grid grid-cols-1 gap-3 max-w-4xl mx-auto w-full">
            {result.allSims?.map((sim) => (
              <SimResultItem key={sim.id} sim={sim} result={result} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-full lg:gap-6 overflow-y-auto lg:overflow-hidden custom-scrollbar pb-6 lg:pb-0">
      {/* Jumbotron Scoreboard */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch bg-console-surface border-2 border-white/10 p-3 pt-12 md:p-5 lg:p-8 relative overflow-hidden min-h-[160px] md:min-h-[200px] rounded-2xl shrink-0 shadow-[0_10px_40px_rgba(0,0,0,0.8)] group mb-4 lg:mb-0">

        {/* Back Button */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-40">
          <button onClick={onReset} className="flex items-center gap-1 md:gap-2 text-slate-300 hover:text-white transition-colors text-xs md:text-sm font-bold uppercase tracking-widest bg-black/60 hover:bg-black px-2 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 hover:border-white/30 shadow-lg backdrop-blur-sm">
            <ArrowLeft size={16} className="w-4 h-4" /> <span className="hidden sm:inline">Returns</span>
          </button>
        </div>

        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-console-blue/10 via-black to-console-red/10 transition-opacity"></div>
        <div className="absolute inset-0 bg-carbon-texture opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 left-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="flex w-full md:w-auto items-stretch justify-center relative z-30">

          {/* Team A (Away) */}
          <div className="flex flex-col items-center justify-center w-[45%] md:w-auto">
            <div className="mb-2">
              <span className="text-[10px] md:text-sm font-sans font-bold uppercase tracking-widest text-slate-400 bg-black/80 px-2 md:px-4 py-1.5 rounded border border-white/10 shadow-lg">Away</span>
            </div>
            <div className="text-[70px] sm:text-[90px] md:text-[100px] lg:text-[140px] leading-none font-score text-white drop-shadow-[0_0_20px_rgba(37,99,235,0.8)] mt-2">
              {result.avgScoreA}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2">
              {result.teamA.logoUrl && <img src={result.teamA.logoUrl} className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain filter drop-shadow-xl" />}
              <div className="text-white font-display font-bold uppercase tracking-wider text-2xl md:text-4xl lg:text-5xl">{result.teamA.abbrev}</div>
            </div>
            <div className="text-xs md:text-base lg:text-lg text-console-gold font-sans font-bold mt-2 md:mt-4 flex items-center gap-1.5 md:gap-2 bg-black/80 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-console-gold/30 shadow-inner">
              <Target size={14} className="md:w-[18px] md:h-[18px]" /> Prob: {(result.winProbA * 100).toFixed(1)}%
            </div>
          </div>

          {/* VS / Info Centerpiece */}
          <div className="flex flex-col items-center justify-center w-[10%] md:w-auto md:px-8 gap-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>

            <div className="hidden md:block text-slate-400/30 font-display font-bold italic text-7xl lg:text-9xl select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 tracking-tighter mix-blend-screen">VS</div>
            <div className="md:hidden text-slate-400/50 font-display font-bold italic text-2xl select-none tracking-tighter">VS</div>
          </div>

          {/* Team B (Home) */}
          <div className="flex flex-col items-center justify-center w-[45%] md:w-auto">
            <div className="mb-2">
              <span className="text-[10px] md:text-sm font-sans font-bold uppercase tracking-widest text-slate-400 bg-black/80 px-2 md:px-4 py-1.5 rounded border border-white/10 shadow-lg">Home</span>
            </div>
            <div className="text-[70px] sm:text-[90px] md:text-[100px] lg:text-[140px] leading-none font-score text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] mt-2">
              {result.avgScoreB}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2">
              <div className="text-white font-display font-bold uppercase tracking-wider text-2xl md:text-4xl lg:text-5xl">{result.teamB.abbrev}</div>
              {result.teamB.logoUrl && <img src={result.teamB.logoUrl} className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain filter drop-shadow-xl" />}
            </div>
            <div className="text-xs md:text-base lg:text-lg text-console-gold font-sans font-bold mt-2 md:mt-4 flex items-center gap-1.5 md:gap-2 bg-black/80 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-console-gold/30 shadow-inner">
              <Target size={14} className="md:w-[18px] md:h-[18px]" /> Prob: {(result.winProbB * 100).toFixed(1)}%
            </div>
          </div>

        </div>

        {/* Actions (Underneath on mobile, center overlay on desktop) */}
        <div className="w-full mt-6 md:mt-0 flex flex-col md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 items-center justify-center z-40 gap-3">
          {/* Odds Display */}
          {(odds?.spread || odds?.overUnder) && (
            <div className="flex flex-row md:flex-col items-center justify-center gap-2 bg-black/60 pt-2 pb-1.5 px-2 md:p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl min-w-[140px]">
              {odds.spread && (
                <div className="flex flex-col items-center">
                  <span className="text-console-gold font-sans font-bold text-xs md:text-[15px] bg-console-gold/10 px-2 md:px-3 py-0.5 md:py-1 rounded border border-console-gold/30">{odds.spread}</span>
                  {(coverProbA !== null || coverProbB !== null) && (
                    <div className="flex gap-1.5 mt-1.5 text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider">
                      {coverProbA !== null && <span className={`text-slate-400 ${coverProbA > 50 ? 'text-console-blue drop-shadow-sm' : ''}`}>{result.teamA.abbrev}: {coverProbA.toFixed(1)}%</span>}
                      {coverProbB !== null && <span className={`text-slate-400 ${coverProbB > 50 ? 'text-console-red drop-shadow-sm' : ''}`}>{result.teamB.abbrev}: {coverProbB.toFixed(1)}%</span>}
                    </div>
                  )}
                </div>
              )}
              {odds.overUnder && (
                <div className="flex flex-col items-center md:mt-1 border-l md:border-l-0 md:border-t border-white/10 pl-3 md:pl-0 md:pt-2">
                  <span className="text-slate-300 font-sans font-bold text-xs md:text-[15px]">O/U <span className="text-white">{odds.overUnder}</span></span>
                  {(overProb !== null && underProb !== null) && (
                    <div className="flex gap-2 mt-1 -mb-1 text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
                      <span className={overProb > 50 ? 'text-white' : ''}>O: {overProb.toFixed(1)}%</span>
                      <span className={underProb > 50 ? 'text-white' : ''}>U: {underProb.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setViewMode('logs')}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl text-sm md:text-lg font-display text-white border border-white/20 flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_5px_20px_rgba(0,0,0,0.5)] active:scale-95"
          >
            <List size={16} className="text-console-gold md:w-5 md:h-5" /> <span className="font-bold tracking-widest uppercase">Box Score</span> <span className="text-slate-400 bg-black/40 px-1.5 md:px-2 rounded-md font-sans text-xs md:text-sm ml-1 flex items-center justify-center py-0.5 md:py-1">({result.simulationsRun})</span>
          </button>
        </div>

      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:flex-1 lg:min-h-0">
        <Panel title="Win Probability" className="h-[300px] lg:h-full lg:min-h-[250px] flex flex-col shrink-0">
          <div className="flex-1 min-h-[0px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={probData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold' }} width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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

        <Panel title="Simulated Flow (40m Regulation)" className="h-[400px] lg:h-full lg:min-h-[250px] flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 relative">
            {/* Timeline Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2"></div>

            <div className="space-y-4 py-2">
              {result.flow?.map((segment, idx, arr) => {
                // Calculate point differential for this specific segment to determine momentum
                const prevScoreA = idx > 0 ? arr[idx - 1].scoreA : 0;
                const prevScoreB = idx > 0 ? arr[idx - 1].scoreB : 0;
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
    </div >
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
    <div className="h-screen bg-game-dark text-slate-200 font-sans selection:bg-console-blue/30 flex flex-col overflow-hidden">

      {/* Header */}
      <header className="bg-console-surface/90 border-b-2 border-white/10 backdrop-blur-xl z-50 shrink-0 h-16 md:h-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-console-blue/5 via-transparent to-console-red/5 pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-console-gold rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.6)] border border-yellow-200">
              <Cpu className="text-black w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white drop-shadow-md">
              NCAA<span className="text-console-gold">SIM</span><span className="text-slate-500 font-sans text-xl ml-1">26</span>
            </h1>
          </div>

          <nav className="flex gap-2 sm:gap-4">
            <button
              onClick={() => { setActiveTab('sim'); setSimResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-display font-bold uppercase tracking-wider transition-all duration-200 border-2 ${activeTab === 'sim' ? 'text-console-gold bg-black/60 border-console-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              <Activity size={18} /> <span className="hidden sm:inline pt-1">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-display font-bold uppercase tracking-wider transition-all duration-200 border-2 ${activeTab === 'history' ? 'text-console-gold bg-black/60 border-console-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              <HistoryIcon size={18} /> <span className="hidden sm:inline pt-1">History</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-6 min-h-0 relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-console-blue/5 to-transparent pointer-events-none"></div>

        {activeTab === 'sim' && !simResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0 relative z-10">

            {/* Left: Schedule (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full min-h-0">
              <Panel title="Game Selection" className="flex flex-col h-full gap-4">
                <div className="shrink-0 bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-sans font-bold text-slate-400 tracking-widest uppercase">Select Date</span>
                    <div className="flex gap-2">
                      <button onClick={() => setSimDate(new Date().toISOString().split('T')[0])} className="text-xs font-bold font-sans uppercase bg-white/10 text-white px-3 py-1.5 rounded hover:bg-console-gold hover:text-black transition-colors shadow-sm">Today</button>
                      <button onClick={() => adjustDate(1)} className="text-xs font-bold font-sans uppercase bg-white/10 text-white px-3 py-1.5 rounded hover:bg-console-gold hover:text-black transition-colors shadow-sm">+1 Day</button>
                    </div>
                  </div>
                  <div className="relative group">
                    <input
                      type="date"
                      value={simDate}
                      onChange={(e) => setSimDate(e.target.value)}
                      className="w-full bg-black/60 border-2 border-white/10 rounded-lg p-3 pl-4 text-white font-sans text-base focus:ring-0 focus:border-console-gold outline-none transition-colors shadow-inner"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-console-gold pointer-events-none drop-shadow-md" size={20} />
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
              <Panel title="Simulation Setup" className="flex flex-col h-full gap-4">

                {selectedGame ? (
                  <div className="flex flex-col h-full w-full z-10 relative mt-4">
                    {/* Matchup Header */}
                    <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                      <div className="flex items-center justify-between w-full max-w-2xl mx-auto">

                        {/* Away */}
                        <div className="flex flex-col items-center w-5/12">
                          <div className="mb-4">
                            <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 bg-black/80 px-4 py-1.5 rounded-b-lg border-x border-b border-white/10 shadow-lg">Away</span>
                          </div>
                          <div className="w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-black/60 p-5 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.2)] border border-console-blue/20 transition-all duration-500 relative">
                            {selectedGame.awayTeam.logo ? (
                              <img src={selectedGame.awayTeam.logo} alt={selectedGame.awayTeam.name} className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" onError={(e) => e.currentTarget.style.display = 'none'} />
                            ) : (
                              <span className="text-4xl lg:text-5xl font-display font-bold text-slate-400">{selectedGame.awayTeam.abbreviation.substring(0, 2)}</span>
                            )}
                          </div>
                          <h2 className="text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider text-white drop-shadow-md text-center">
                            {selectedGame.awayTeam.abbreviation}
                          </h2>
                          <div className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedGame.awayTeam.name}</div>
                        </div>

                        {/* Center VS */}
                        <div className="flex flex-col items-center justify-center w-2/12 relative">
                          <div className="text-slate-500 font-display font-bold italic text-5xl lg:text-6xl select-none mix-blend-screen opacity-50">VS</div>
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
                            <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 bg-black/80 px-4 py-1.5 rounded-b-lg border-x border-b border-white/10 shadow-lg">Home</span>
                          </div>
                          <div className="w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-black/60 p-5 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(220,38,38,0.2)] border border-console-red/20 transition-all duration-500 relative">
                            {selectedGame.homeTeam.logo ? (
                              <img src={selectedGame.homeTeam.logo} alt={selectedGame.homeTeam.name} className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" onError={(e) => e.currentTarget.style.display = 'none'} />
                            ) : (
                              <span className="text-4xl lg:text-5xl font-display font-bold text-slate-400">{selectedGame.homeTeam.abbreviation.substring(0, 2)}</span>
                            )}
                          </div>
                          <h2 className="text-3xl lg:text-4xl font-display font-bold uppercase tracking-wider text-white drop-shadow-md text-center">
                            {selectedGame.homeTeam.abbreviation}
                          </h2>
                          <div className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedGame.homeTeam.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Sim Controls */}
                    <div className="bg-black/60 border-t border-white/10 p-6 backdrop-blur-md shrink-0 flex items-center justify-between rounded-b-xl">
                      <div className="w-[60%] lg:w-[50%] mr-8">
                        <RangeInput
                          label="Simulations"
                          value={config.iterations}
                          min={1}
                          max={500}
                          onChange={(v) => setConfig(prev => ({ ...prev, iterations: v }))}
                        />
                        <RangeInput
                          label="Chaos Factor"
                          value={config.chaosFactor}
                          min={0}
                          max={0.2}
                          step={0.01}
                          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
                          onChange={(v) => setConfig(prev => ({ ...prev, chaosFactor: v }))}
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group bg-black/40 p-3 rounded-lg border border-white/5 hover:border-console-gold/30 transition-all">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-white/20 bg-black/50 text-console-gold focus:ring-console-gold focus:ring-opacity-20 cursor-pointer accent-console-gold"
                            checked={config.neutralCourt}
                            onChange={(e) => setConfig(prev => ({ ...prev, neutralCourt: e.target.checked }))}
                          />
                          <span className="text-sm font-sans font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors select-none">Neutral Court</span>
                        </label>

                        <CyberButton onClick={handleSimulate} disabled={isSimulating} variant="primary">
                          {isSimulating ? 'Simulating...' : 'Initiate Simulation'}
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <HistoryIcon className="text-console-gold mb-6 opacity-80" size={64} />
                    <span className="font-display text-4xl tracking-widest text-slate-400">AWAITING GAME SELECTION...</span>
                  </div>
                )}
              </Panel>
            </div>

            {/* Mobile Selection & Sim Overlay */}
            {selectedGame && (
              <div className="fixed inset-0 z-[100] lg:hidden bg-game-dark flex flex-col animate-fade-in w-full min-h-screen overscroll-none">
                <div className="flex items-center p-4 border-b border-white/10 bg-black/80 safe-top shrink-0 backdrop-blur-md sticky top-0 z-20">
                  <button onClick={() => setSelectedGame(null)} className="p-2 -ml-2 text-console-gold hover:text-white transition-colors bg-white/5 rounded-lg active:scale-95">
                    <ArrowLeft size={24} />
                  </button>
                  <h3 className="font-display font-bold uppercase tracking-wider text-xl md:text-2xl ml-3 text-white">Matchup Selected</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 safe-bottom">
                  {/* Mobile Matchup Card */}
                  <div className="flex justify-between items-center px-4 py-8 bg-console-surface rounded-xl border border-white/10 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-carbon-texture opacity-10"></div>
                    <div className="z-10 flex flex-col items-center w-1/3 text-center">
                      {selectedGame.awayTeam.logo ? (
                        <img src={selectedGame.awayTeam.logo} className="w-20 h-20 object-contain mb-3 drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                      ) : (
                        <span className="text-3xl font-display font-bold text-slate-400 mb-3">{selectedGame.awayTeam.abbreviation.substring(0, 2)}</span>
                      )}
                      <span className="text-3xl font-display font-bold text-white leading-none tracking-wider">{selectedGame.awayTeam.abbreviation}</span>
                      <span className="text-sm font-sans text-console-gold font-bold mt-1">#{selectedGame.awayTeam.rank || '-'}</span>
                    </div>
                    <div className="z-10 flex flex-col items-center w-1/3">
                      <span className="text-5xl font-display font-bold text-slate-600 italic mix-blend-screen px-2">VS</span>
                      <div className="mt-3 flex flex-col items-center gap-1.5">
                        {selectedGame.odds?.spread && <span className="bg-console-gold/10 text-console-gold text-sm px-3 py-1.5 rounded border border-console-gold/30 whitespace-nowrap font-bold">{selectedGame.odds.spread}</span>}
                        {selectedGame.odds?.overUnder && <span className="text-slate-500 text-sm font-sans font-bold">O/U <span className="text-white">{selectedGame.odds.overUnder}</span></span>}
                      </div>
                    </div>
                    <div className="z-10 flex flex-col items-center w-1/3 text-center">
                      {selectedGame.homeTeam.logo ? (
                        <img src={selectedGame.homeTeam.logo} className="w-20 h-20 object-contain mb-3 drop-shadow-xl" onError={(e) => e.currentTarget.style.display = 'none'} />
                      ) : (
                        <span className="text-3xl font-display font-bold text-slate-400 mb-3">{selectedGame.homeTeam.abbreviation.substring(0, 2)}</span>
                      )}
                      <span className="text-3xl font-display font-bold text-white leading-none tracking-wider">{selectedGame.homeTeam.abbreviation}</span>
                      <span className="text-sm font-sans text-console-red font-bold mt-1">#{selectedGame.homeTeam.rank || '-'}</span>
                    </div>
                  </div>

                  {/* Mobile Controls */}
                  <div className="bg-black/60 p-6 rounded-xl border border-white/10 shadow-inner space-y-6">
                    <RangeInput
                      label="Simulations"
                      value={config.iterations}
                      min={1}
                      max={500}
                      onChange={(v) => setConfig(prev => ({ ...prev, iterations: v }))}
                    />
                    <RangeInput
                      label="Chaos Factor"
                      value={config.chaosFactor}
                      min={0}
                      max={0.2}
                      step={0.01}
                      formatValue={(v) => `${(v * 100).toFixed(0)}%`}
                      onChange={(v) => setConfig(prev => ({ ...prev, chaosFactor: v }))}
                    />

                    {errorMsg && (
                      <div className="text-console-red text-sm font-bold text-center bg-console-red/10 border border-console-red/30 py-2 rounded">{errorMsg}</div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer group bg-black/40 p-3 rounded-lg border border-white/5 hover:border-console-gold/30 transition-all justify-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-white/20 bg-black/50 text-console-gold focus:ring-console-gold focus:ring-opacity-20 cursor-pointer accent-console-gold"
                        checked={config.neutralCourt}
                        onChange={(e) => setConfig(prev => ({ ...prev, neutralCourt: e.target.checked }))}
                      />
                      <span className="text-sm font-sans font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors select-none">Neutral Court</span>
                    </label>

                    <CyberButton
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="w-full h-16 text-2xl"
                      variant="primary"
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
                        <span className="text-[9px] font-mono text-slate-600">{new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
