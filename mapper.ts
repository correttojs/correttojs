import { teamDetails, teamMatches, teamNextMatches } from "./resources.ts";

const displayTeam = (team: { id: string; name: string }) => {
  console.log(team);
  const img = teamDetails.find((t) => t.id === team.id).crestUrl;
  return `<span><img src="${img}" height="15px" />${team.name}</span>`;
};

const calcEmoji = (
  score: { fullTime: { homeTeam: number; awayTeam: number } },
  isHome: boolean
) => {
  if (score.fullTime.homeTeam === score.fullTime.awayTeam) {
    return `😐`;
  }
  if (isHome && score.fullTime.homeTeam > score.fullTime.awayTeam) {
    return `😄💙💛`;
  }
  return `😭`;
};

export const lastMatches = () => {
  let matchesText = ``;
  teamMatches.matches.reverse().map((match: any) => {
    const empjy = calcEmoji(match.score, match.homeTeam.id === 450);

    matchesText += `${displayTeam(match.homeTeam)} ${
      match.homeTeam.name
    } - ${displayTeam(match.awayTeam)}: ${match.score.fullTime.homeTeam} - ${
      match.score.fullTime.awayTeam
    } ${empjy} <br/>`;
  });
  return matchesText;
};

export const nextMatches = () => {
  let nextMatchesText = ``;
  teamNextMatches.matches.map((match: any) => {
    nextMatchesText += `${displayTeam(match.homeTeam)} ${
      match.homeTeam.name
    } - ${displayTeam(match.awayTeam)} <br/>`;
  });
  return nextMatchesText;
};
