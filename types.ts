
export interface Player {
  id: string;
  name: string;
  position: string;
  isStar: boolean;
  ppg: number;
}

export interface Team {
  id: string;
  name: string;
  abbrev: string;
  logoColor: string;
  logoUrl?: string; // New field for real logo
  conference: string;
  rank: number | null; // AP Rank
  adjO: number; // Adjusted Offensive Efficiency
  adjD: number; // Adjusted Defensive Efficiency
  tempo: number; // Possessions per 40 mins
  starPlayer?: Player;
}

export interface SimulationConfig {
  iterations: number;
  chaosFactor: number; // 0.0 to 0.2 (0% to 20%)
  neutralCourt: boolean;
}

export interface GameSegment {
  segment: number; // 1-8 (5 min segments)
  timeDisplay: string; // e.g., "15:00 1H"
  scoreA: number;
  scoreB: number;
  eventLog: string[];
}

export interface SingleSimResult {
  id: number;
  scoreA: number;
  scoreB: number;
  winner: 'A' | 'B';
  isOT: boolean;
}

export interface SimulationResult {
  id: string;
  date: string;
  teamA: Team;
  teamB: Team;
  winnerId: string;
  avgScoreA: number;
  avgScoreB: number;
  winProbA: number;
  winProbB: number;
  highScoreA: number;
  highScoreB: number;
  simulationsRun: number;
  config: SimulationConfig;
  flow?: GameSegment[]; // Example flow from one representative game
  allSims: SingleSimResult[]; // Full log of all iterations
}

export interface ScheduleGame {
  id: string;
  date: string;
  status: string;
  odds?: {
    spread?: string;
    overUnder?: number;
  };
  homeTeam: {
    name: string;
    abbreviation: string;
    id: string;
    logo: string;
    rank?: number;
    score?: string;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    id: string;
    logo: string;
    rank?: number;
    score?: string;
  };
}
