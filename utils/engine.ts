
import { Team, SimulationConfig, SimulationResult, GameSegment, SingleSimResult } from '../types';
import { LEAGUE_AVG_ADJO, LEAGUE_AVG_TEMPO } from '../constants';

// Box-Muller transform for normal distribution
function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); 
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

export function simulateMatchup(teamA: Team, teamB: Team, config: SimulationConfig): SimulationResult {
  let winsA = 0;
  let totalScoreA = 0;
  let totalScoreB = 0;
  let highScoreA = 0;
  let highScoreB = 0;

  // Expected Pace
  const expectedTempo = (teamA.tempo + teamB.tempo) / 2; // Simplified possession count

  // Efficiency Margin base (Points per 100 possessions)
  const rawPppA = (teamA.adjO * teamB.adjD) / LEAGUE_AVG_ADJO;
  const rawPppB = (teamB.adjO * teamA.adjD) / LEAGUE_AVG_ADJO;

  const sampleFlow: GameSegment[] = [];
  const allSims: SingleSimResult[] = [];

  for (let i = 0; i < config.iterations; i++) {
    let currentScoreA = 0;
    let currentScoreB = 0;
    
    // Simulating 8 segments of 5 minutes (40 min game)
    const segments = 8;
    const possPerSegment = expectedTempo / segments;

    let starAMultiplier = teamA.starPlayer?.isStar ? 1.05 : 1.0;
    let starBMultiplier = teamB.starPlayer?.isStar ? 1.05 : 1.0;
    
    // Injury Check (Chaos Factor)
    const injuryChance = config.chaosFactor * 0.05; 
    const injuryA = Math.random() < injuryChance;
    const injuryB = Math.random() < injuryChance;

    if (injuryA) starAMultiplier = 0.9; 
    if (injuryB) starBMultiplier = 0.9;

    for (let s = 1; s <= segments; s++) {
      const stdDev = 10 * (1 + config.chaosFactor);
      
      const segEffA = randomNormal(rawPppA, stdDev) * starAMultiplier;
      const segEffB = randomNormal(rawPppB, stdDev) * starBMultiplier;
      
      const segPointsA = Math.round((possPerSegment * segEffA) / 100);
      const segPointsB = Math.round((possPerSegment * segEffB) / 100);

      currentScoreA += Math.max(0, segPointsA);
      currentScoreB += Math.max(0, segPointsB);

      // Only record flow for the first simulation
      if (i === 0) {
        let event = "";
        const diff = segPointsA - segPointsB;
        if (Math.abs(diff) > 8) event = diff > 0 ? `${teamA.abbrev} dominant run` : `${teamB.abbrev} goes on a tear`;
        else if (injuryA && s === 4) event = `${teamA.starPlayer?.name} limps off court`;
        
        // Time display logic (NCAA 2 halves of 20 mins)
        // Segments 1-4 = 1st Half, 5-8 = 2nd Half
        const half = s <= 4 ? '1H' : '2H';
        const minsRemaining = s <= 4 ? (20 - s * 5) : (40 - s * 5);
        const timeStr = minsRemaining === 0 ? `00:00 ${half}` : `${minsRemaining}:00 ${half}`;

        sampleFlow.push({
          segment: s,
          timeDisplay: timeStr,
          scoreA: currentScoreA,
          scoreB: currentScoreB,
          eventLog: event ? [event] : []
        });
      }
    }

    // Overtime Logic
    let isOT = false;
    while (currentScoreA === currentScoreB) {
       isOT = true;
       const otPoss = expectedTempo / 8;
       const otEffA = randomNormal(rawPppA, 15);
       const otEffB = randomNormal(rawPppB, 15);
       currentScoreA += Math.round((otPoss * otEffA) / 100);
       currentScoreB += Math.round((otPoss * otEffB) / 100);
       
       if (i === 0) {
         sampleFlow.push({
           segment: 9,
           timeDisplay: 'FINAL/OT',
           scoreA: currentScoreA,
           scoreB: currentScoreB,
           eventLog: ['Overtime Thriller!']
         });
       }
    }

    totalScoreA += currentScoreA;
    totalScoreB += currentScoreB;
    highScoreA = Math.max(highScoreA, currentScoreA);
    highScoreB = Math.max(highScoreB, currentScoreB);

    if (currentScoreA > currentScoreB) winsA++;

    allSims.push({
      id: i + 1,
      scoreA: currentScoreA,
      scoreB: currentScoreB,
      winner: currentScoreA > currentScoreB ? 'A' : 'B',
      isOT
    });
  }

  // Safe ID generation
  const resultId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
    ? crypto.randomUUID() 
    : `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: resultId,
    date: new Date().toISOString(),
    teamA,
    teamB,
    winnerId: winsA > (config.iterations / 2) ? teamA.id : teamB.id,
    avgScoreA: Math.round(totalScoreA / config.iterations),
    avgScoreB: Math.round(totalScoreB / config.iterations),
    winProbA: parseFloat((winsA / config.iterations).toFixed(3)),
    winProbB: parseFloat((1 - (winsA / config.iterations)).toFixed(3)),
    highScoreA,
    highScoreB,
    simulationsRun: config.iterations,
    config,
    flow: sampleFlow,
    allSims
  };
}
