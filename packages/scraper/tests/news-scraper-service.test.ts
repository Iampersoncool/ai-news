import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import HeaderService from '../src/services/HeaderService';
import NewsScraperService from '../src/services/NewsScraperService';

const headerService = new HeaderService();

const newsScraperService = new NewsScraperService(headerService, {
  parseNoneClosedTags: true,
});

describe('NewsScraperService', () => {
  test('getDocumentFromHTML returns valid document with valid document body', () => {
    const document = newsScraperService.getDocumentFromHTML(
      readFileSync(
        'packages/scraper/news/news-scraper-test-pbs.html'
      ).toString()
    );

    expect(document.querySelector('body')).not.toBeNull();
  });
});
