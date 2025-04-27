import GoogleScraperService from '@ai-news/scraper/services/GoogleScraperService';
import HeaderServiceImpl from '@ai-news/scraper/services/HeaderService';
import NewsScraperService from '@ai-news/scraper/services/NewsScraperService';
import type { NewsArticle } from '@ai-news/scraper/services/NewsScraperService';

const headerService = new HeaderServiceImpl();

const googleScraper = new GoogleScraperService(headerService);
const newsScraper = new NewsScraperService(headerService, {
  parseNoneClosedTags: true,
});

async function getUrls(searchQuery: string): Promise<string[]> {
  const html = await googleScraper.scrapeNewsTab({
    page: 0,
    searchQuery,
  });

  return googleScraper.getNewsUrls(html);
}

export async function scrapeGoogleNewsTab(
  searchQuery: string,
  maxRetries: number,
  urlsLength: number,
): Promise<NewsArticle[]> {
  let retries = 0;
  let urls = await getUrls(searchQuery);

  while (urls.length !== urlsLength && retries < maxRetries) {
    console.log(`urls length !== ${urlsLength}. Retrying.`);

    urls = await getUrls(searchQuery);
    retries++;
  }

  if (urls.length !== urlsLength) throw new Error('urls still too long.');

  const results = await googleScraper.getNewsArticles({
    newsUrls: urls,
    newsScraper,
  });

  return results;
}
