import { lastMatches, nextMatches } from "./mapper.ts";

const decoder = new TextDecoder("utf-8");
const text = await Deno.readFile("README.tpl.md");
const decodedText = decoder.decode(text);

const encoder = new TextEncoder();
const data = encoder.encode(
  decodedText
    .replace("%{{teams}}%", `${lastMatches()}`)
    .replace("%{{next}}%", `${nextMatches()}`)
);
await Deno.writeFile("README.md", data);
