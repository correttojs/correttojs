import "https://deno.land/x/dotenv/load.ts";
const token = Deno.env.get("AUTH_TOKEN") as string;
console.log(token, ' config()["AUTH_TOKEN"]');
const team = await fetch(
  "http://api.football-data.org/v2/teams/450/matches?status=FINISHED&limit=2",
  {
    headers: {
      "X-Auth-Token": token,
    },
  }
).then((r) => r.json());
console.log(team);
let matchesText = ``;
team.matches.reverse().map((match: any) => {
  const empjy =
    match.homeTeam.id === 450 &&
    match.score.fullTime.homeTeam > match.score.fullTime.awayTeam
      ? `😄`
      : match.homeTeam.id === 450 &&
        match.score.fullTime.homeTeam < match.score.fullTime.awayTeam
      ? `😭`
      : `😐`;
  matchesText += `${match.homeTeam.name} - ${match.awayTeam.name}: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} ${empjy} <br/>`;
});

const decoder = new TextDecoder("utf-8");
const text = await Deno.readFile("README.tpl.md");
const decodedText = decoder.decode(text);

const encoder = new TextEncoder();
const data = encoder.encode(
  decodedText.replace("%{{teams}}%", `${matchesText}`)
);
await Deno.writeFile("README.md", data);
