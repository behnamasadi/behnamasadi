// Render github-readme-stats cards to SVG files by invoking its Vercel
// handlers with a mock req/res. Run from a checkout of this repo with
// GRS_DIR pointing at a clone of anuraghazra/github-readme-stats and
// PAT_1 set to a GitHub token.
import { writeFileSync } from "fs";

const mockRes = (outPath) => ({
  headers: {},
  setHeader(k, v) {
    this.headers[k] = v;
  },
  send(body) {
    if (!String(body).includes("<svg")) {
      console.error("Handler did not return an SVG for", outPath);
      process.exit(1);
    }
    if (String(body).includes("Something went wrong")) {
      console.error("Card rendered an error state for", outPath, "- refusing to commit it");
      process.exit(1);
    }
    writeFileSync(outPath, body);
    console.log("wrote", outPath, body.length, "bytes");
  },
});

const statsHandler = (await import(process.env.GRS_DIR + "/api/index.js")).default;
const langsHandler = (await import(process.env.GRS_DIR + "/api/top-langs.js")).default;

await statsHandler(
  {
    query: {
      username: "behnamasadi",
      show_icons: "true",
      theme: "transparent",
      count_private: "true",
      include_all_commits: "true",
    },
  },
  mockRes("output/github-stats.svg"),
);

await langsHandler(
  {
    query: {
      username: "behnamasadi",
      layout: "compact",
      theme: "transparent",
    },
  },
  mockRes("output/top-langs.svg"),
);
