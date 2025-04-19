import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import NewsScraperService from '../src/services/NewsScraperService';

describe('NewsScraperService', () => {
  test('getDocumentFromHTML returns valid document with valid document body', () => {
    const document = NewsScraperService.getDocumentFromHTML(
      readFileSync(
        'packages/scraper/news/news-scraper-test-pbs.html'
      ).toString(),
      {
        parseNoneClosedTags: true,
      }
    );

    expect(document.querySelector('body')).not.toBeNull();
  });
});
