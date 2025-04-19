import { writeFile } from "fs/promises";
import GoogleScraperService from "./services/GoogleScraperService.js";
import HeaderServiceImpl from "./services/HeaderService.js";

const headerService = new HeaderServiceImpl();

const googleScraper = new GoogleScraperService(headerService);

const promises = [];

for (let i = 0; i < 50; i++) {
  const p = googleScraper
    .scrapeNewsTab({
      searchQuery: "breaking news",
      page: 0,
    })
    .then((html) => writeFile(`news/scrapeNewsTabTest/${i}.html`, html));

  promises.push(p);
}

await Promise.all(promises);
