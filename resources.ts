import "https://deno.land/x/dotenv/load.ts";
const token = Deno.env.get("AUTH_TOKEN") as string;

const fetchJson = async (url: string) => {
  const data = await fetch(`http://api.football-data.org/v2${url}`, {
    headers: {
      "X-Auth-Token": token,
    },
  }).then((r) => r.json());
  return data;
};

export const teamMatches = await fetchJson(
  "/teams/450/matches?status=FINISHED&limit=5"
);
console.log(teamMatches);

export const teamNextMatches = await fetchJson(
  "/teams/450/matches?status=SCHEDULED&limit=1"
);

const promises = teamMatches.matches.map((match: any) => {
  return fetchJson(
    `/teams/${
      match.homeTeam.id !== 450 ? match.homeTeam.id : match.awayTeam.id
    }`
  );
});

promises.push(fetchJson(`/teams/450`));
promises.push(
  fetchJson(
    `/teams/${
      teamNextMatches.matches[0].homeTeam.id !== 450
        ? teamNextMatches.matches[0].homeTeam.id
        : teamNextMatches.matches[0].awayTeam.id
    }`
  )
);

export const teamDetails: any[] = await Promise.all(promises);
