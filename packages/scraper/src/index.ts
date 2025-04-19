import { mkdir, writeFile } from 'node:fs/promises';
import GoogleScraperService from './services/GoogleScraperService.js';
import HeaderServiceImpl from './services/HeaderService.js';
import NewsScraperService from './services/NewsScraperService.js';
import { join } from 'node:path';

const headerService = new HeaderServiceImpl();

const googleScraper = new GoogleScraperService(headerService);
const newsScraper = new NewsScraperService(headerService, {
  parseNoneClosedTags: true,
});

async function getUrls(): Promise<string[]> {
  const html = await googleScraper.scrapeNewsTab({
    page: 0,
    searchQuery: 'breaking news',
  });

  return googleScraper.getNewsUrls(html);
}

try {
  const maxRetries = 10;
  const urlsLength = 10;

  let retries = 0;

  let urls = await getUrls();

  while (urls.length !== urlsLength && retries < maxRetries) {
    console.log(`urls length !== ${urlsLength}. Retrying.`);

    urls = await getUrls();
    retries++;
  }

  if (urls.length !== urlsLength) throw new Error('urls still too long.');

  const results = await googleScraper.getNewsArticles({
    newsUrls: urls,
    newsScraper,
  });

  const newsDir = await mkdir(
    `news/${new Date()
      .toLocaleDateString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replaceAll('/', '-')
      .replace(',', '')
      .replaceAll(' ', '-')}`,
    { recursive: true }
  );

  if (!newsDir) throw new Error('news dir missing');

  const outFile = join(newsDir, 'data.html');
  await writeFile(outFile, results.join('\n'));

  console.log(`successfully wrote to ${outFile}`);
} catch (e) {
  console.error('error scraping', e);
}
