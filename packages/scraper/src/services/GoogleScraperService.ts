import { parse as parseHTML } from 'node-html-parser';
import type { HeaderService, ScraperService } from '../types.js';

export interface ScrapeNewsTabOpts {
  /**
   * What to search
   * @example "breaking news"
   */
  searchQuery: string;

  /**
   * The page number to scrape news from
   * @example (1, 2, 3, 4, ...)
   */
  page: number;
}

export interface GetNewsArticlesOpts {
  /**
   * The scraper used to scrape
   * each news article found
   * in the news tab
   */
  newsScraper: ScraperService;

  /**
   * The news urls to scrape
   */
  newsUrls: string[];
}

export default class GoogleScraperService implements ScraperService {
  static #BASE_URL = 'https://www.google.com/search';

  #headerService: HeaderService;

  constructor(headerService: HeaderService) {
    this.#headerService = headerService;
  }

  public async getNewsArticles(opts: GetNewsArticlesOpts): Promise<string[]> {
    const { newsScraper, newsUrls } = opts;

    return Promise.all(
      newsUrls.map(async url => {
        let result: string;

        try {
          const body = await newsScraper.scrape(url);
          result = `<!--start-sources--><a target="_blank" href="${url}">Go to original</a><!--end-sources-->${body}`;
        } catch (e) {
          console.error(`FETCH REJECTED`, e);
          result = `<!--start-errors--><p>Error fetching ${url}</p><!--end-errors-->`;
        }

        return result;
      })
    );
  }

  public getNewsUrls(html: string): string[] {
    const document = parseHTML(html);

    const body = document.querySelector('body');
    if (!body) {
      throw new Error('could not get the document body');
    }

    // header causes issues sometimes, since
    // the structure of the elements inside is the same as
    // the search results
    const header = body.querySelector('header');
    if (header) header.remove();

    const links: string[] = [];

    const searchAnchorElements = body.querySelectorAll('a:has(img)');

    for (const anchorElement of searchAnchorElements) {
      const href = anchorElement.getAttribute('href');
      if (!href) continue;

      const httpIndex = href.indexOf('http');
      const queryIndex = href.indexOf('&', httpIndex);

      const endIndex = queryIndex === -1 ? href.length : queryIndex;

      // sometimes the url will have a query param starting with "&"
      // EX: https://www.nytimes.com/2025/04/13/us/politics/josh-shapiro-arson-attack-pennsylvania.html&sa=U&ved=2ahUKEwj3uf-kz9WMAxXxL0QIHTl-CBUQxfQBegQIBxAC&usg=AOvVaw0Apc0UtYQE7lBqYWRNWShZ
      // Ex: https://www.bbc.com/news/articles/cy9vx1v1rx1o&sa=U&ved=2ahUKEwj3uf-kz9WMAxXxL0QIHTl-CBUQxfQBegQIChAC&usg=AOvVaw2mEM1UxJqmok10ZCaZjTid

      links.push(href.substring(httpIndex, endIndex));
    }

    return links;
  }

  /**
   * @returns the html from a certain page of the news tab.
   */
  public scrapeNewsTab(opts: ScrapeNewsTabOpts) {
    const url = new URL(GoogleScraperService.#BASE_URL);

    // set tab to news
    url.searchParams.set('tbm', 'nws');

    // set search query(equivalent to manually using search bar)
    url.searchParams.set('q', opts.searchQuery);

    // page number goes in increments of 10, ex: 0, 10, 20, 30, ...
    url.searchParams.set('start', String(opts.page * 10));

    return this.scrape(url);
  }

  public async scrape(url: string | URL | Request) {
    const response = await fetch(url, {
      headers: this.#headerService.getRandomHeaders(),
    });

    if (!response.ok) {
      throw new Error(`could not scrape google ${url}`);
    }

    const html = await response.text();
    return html;
  }
}
