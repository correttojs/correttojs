import "https://deno.land/x/dotenv/load.ts";
const token = Deno.env.get("AUTH_TOKEN") as string;
console.log(token, ' config()["AUTH_TOKEN"]');
const team = await fetch(
  "http://api.football-data.org/v2/teams/450/matches?status=FINISHED&limit=5",
  {
    headers: {
      "X-Auth-Token": token,
    },
  }
).then((r) => r.json());
console.log(team);

const promises = team.matches.reverse().map((match: any) => {
  return fetch(
    `http://api.football-data.org/v2/teams/${
      match.homeTeam.id !== 450 ? match.homeTeam.id : match.awayTeam.id
    }`,
    {
      headers: {
        "X-Auth-Token": token,
      },
    }
  ).then((r) => r.json());
});
promises.push(
  fetch(`http://api.football-data.org/v2/teams/450`, {
    headers: {
      "X-Auth-Token": token,
    },
  }).then((r) => r.json())
);

const teamDetails: any[] = await Promise.all(promises);

const displayTeam = (team: { id: string; name: string }) => {
  const img = teamDetails.find((t) => t.id === team.id).crestUrl;
  return `<span><img src="${img}" height="15px" />${team.name}</span>`;
};

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
  matchesText += `${displayTeam(match.homeTeam)} ${
    match.homeTeam.name
  } - ${displayTeam(match.awayTeam)}: ${match.score.fullTime.homeTeam} - ${
    match.score.fullTime.awayTeam
  } ${empjy} <br/>`;
});

const decoder = new TextDecoder("utf-8");
const text = await Deno.readFile("README.tpl.md");
const decodedText = decoder.decode(text);

const encoder = new TextEncoder();
const data = encoder.encode(
  decodedText.replace("%{{teams}}%", `${matchesText}`)
);
await Deno.writeFile("README.md", data);
