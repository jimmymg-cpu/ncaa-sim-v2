import { ScheduleGame } from '../types';

// Fetch NCAA Basketball Schedule from ESPN
export async function fetchDailySchedule(dateStr: string): Promise<ScheduleGame[]> {
  // dateStr format: YYYY-MM-DD
  const formattedDate = dateStr.replace(/-/g, '');
  
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=200&groups=50&dates=${formattedDate}`);
    
    if (!res.ok) throw new Error('Network response was not ok');
    
    const data = await res.json();
    let events = data.events || [];

    // Map Raw Data
    const games: ScheduleGame[] = events.map((event: any) => {
      const competition = event.competitions[0];
      const home = competition.competitors.find((c: any) => c.homeAway === 'home');
      const away = competition.competitors.find((c: any) => c.homeAway === 'away');
      
      const oddsData = competition.odds?.[0];

      return {
        id: event.id,
        date: event.date,
        status: event.status.type.shortDetail,
        odds: oddsData ? {
          spread: oddsData.details,
          overUnder: oddsData.overUnder
        } : undefined,
        homeTeam: {
          name: home.team.displayName,
          abbreviation: home.team.abbreviation,
          id: home.team.id,
          logo: home.team.logo || '',
          rank: home.curatedRank?.current < 99 ? home.curatedRank.current : undefined,
          score: home.score
        },
        awayTeam: {
          name: away.team.displayName,
          abbreviation: away.team.abbreviation,
          id: away.team.id,
          logo: away.team.logo || '',
          rank: away.curatedRank?.current < 99 ? away.curatedRank.current : undefined,
          score: away.score
        }
      };
    });

    // Sort Logic: Ranked games first, then by date/id
    games.sort((a, b) => {
      const getRankWeight = (g: ScheduleGame) => {
        let weight = 0;
        if (g.homeTeam.rank) weight += 1000 - g.homeTeam.rank;
        if (g.awayTeam.rank) weight += 1000 - g.awayTeam.rank;
        return weight;
      };

      const weightA = getRankWeight(a);
      const weightB = getRankWeight(b);

      // If one game has significantly more rank weight (top 25 matchup vs unranked), prioritize it
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return 0;
    });

    return games;

  } catch (error) {
    console.warn("Failed to fetch ESPN schedule, using fallback generator", error);
    return generateMockSchedule(dateStr);
  }
}

// Fallback for when API fails or blocked by CORS (simulated environment)
function generateMockSchedule(dateStr: string): ScheduleGame[] {
  const mocks = [
    { home: 'Duke', homeAbbrev: 'DUKE', homeId: 'duke', away: 'North Carolina', awayAbbrev: 'UNC', awayId: 'unc', homeRank: 9, awayRank: 7, odds: { spread: "UNC -2.5", overUnder: 154.5 } },
    { home: 'Kansas', homeAbbrev: 'KU', homeId: 'kan', away: 'Houston', awayAbbrev: 'HOU', awayId: 'hou', homeRank: 5, awayRank: 3, odds: { spread: "HOU -1.5", overUnder: 138.0 } },
    { home: 'Purdue', homeAbbrev: 'PUR', homeId: 'pur', away: 'Indiana', awayAbbrev: 'IND', awayId: 'ind', homeRank: 2, awayRank: 18, odds: { spread: "PUR -8.0", overUnder: 148.5 } },
    { home: 'UCONN', homeAbbrev: 'UCONN', homeId: 'conn', away: 'Marquette', awayAbbrev: 'MARQ', awayId: 'marq', homeRank: 1, awayRank: 10, odds: { spread: "CONN -10.5", overUnder: 142.5 } },
    { home: 'Kentucky', homeAbbrev: 'UK', homeId: 'uk', away: 'Tennessee', awayAbbrev: 'TENN', awayId: 'tenn', homeRank: 12, awayRank: 8, odds: { spread: "TENN -3.5", overUnder: 161.0 } },
    { home: 'Arizona', homeAbbrev: 'ARIZ', homeId: 'ari', away: 'UCLA', awayAbbrev: 'UCLA', awayId: 'ucla', homeRank: 11, awayRank: null, odds: { spread: "ARIZ -14.5", overUnder: 152.0 } },
    { home: 'Baylor', homeAbbrev: 'BAY', homeId: 'bay', away: 'Texas Tech', awayAbbrev: 'TTU', awayId: 'ttu', homeRank: 14, awayRank: 22, odds: { spread: "BAY -4.5", overUnder: 144.5 } },
  ];

  return mocks.map((m, i) => ({
    id: `mock-${i}`,
    date: dateStr,
    status: 'Scheduled',
    odds: m.odds,
    homeTeam: {
      name: m.home,
      abbreviation: m.homeAbbrev,
      id: m.homeId,
      logo: `https://a.espncdn.com/i/teamlogos/ncaa/500/${Math.floor(Math.random()*200)}.png`, // placeholder
      rank: m.homeRank || undefined
    },
    awayTeam: {
      name: m.away,
      abbreviation: m.awayAbbrev,
      id: m.awayId,
      logo: `https://a.espncdn.com/i/teamlogos/ncaa/500/${Math.floor(Math.random()*200)}.png`,
      rank: m.awayRank || undefined
    }
  }));
}