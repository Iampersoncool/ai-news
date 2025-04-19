import { join } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import GoogleScraperService from '../src/services/GoogleScraperService';
import HeaderService from '../src/services/HeaderService';

import { parse as parseHTML } from 'node-html-parser';

const headerService = new HeaderService();
const googleService = new GoogleScraperService(headerService);

const IMAGE_ID_REGEX = /i\s*=\s*\[\s*'([^']+)'\s*\]/g;

describe('GoogleScraperService', () => {
  // test('get all image urls on news tab', () => {
  //   const htmlFilesPath = 'packages/scraper/news/scrapeNewsTabTest';

  //   const htmlFileNames = readdirSync(htmlFilesPath, {
  //     recursive: true,
  //   }) as string[];

  //   const validFiles: string[] = [];

  //   for (const fileName of htmlFileNames) {
  //     const fileContent = readFileSync(join(htmlFilesPath, fileName), 'utf-8');

  //     const document = parseHTML(fileContent);

  //     const body = document.querySelector('body');
  //     if (!body) {
  //       console.warn(`document.body could not be loaded for ${fileName}`);
  //       continue;
  //     }

  //     const anchorElements = document.querySelectorAll('a');

  //     const filteredAnchorElements = anchorElements.filter(
  //       a => a.querySelector('img') != null
  //     );

  //     const links: string[] = [];

  //     for (const anchorElement of filteredAnchorElements) {
  //       const href = anchorElement.getAttribute('href');
  //       if (!href) continue;

  //       const httpIndex = href.indexOf('http');
  //       const queryIndex = href.indexOf('&', httpIndex);

  //       const endIndex = queryIndex === -1 ? href.length : queryIndex;
  //       links.push(href.substring(httpIndex, endIndex));
  //     }

  //     if (links.length >= 10) validFiles.push(fileName);
  //   }

  //   // Ensure all files had at least 10 valid links
  //   expect(validFiles).toEqual(htmlFileNames);
  // });

  test('getNewsUrls returns at least 10 results', () => {
    const htmlFilesPath = 'packages/scraper/news/scrapeNewsTabTest';

    const htmlFileNames = readdirSync(htmlFilesPath, {
      recursive: true,
    }) as string[];

    const validFiles: string[] = [];

    for (const fileName of htmlFileNames) {
      const contents = readFileSync(join(htmlFilesPath, fileName));
      const newsUrls = googleService.getNewsUrls(contents.toString());

      let canParse = true;

      for (const url of newsUrls) {
        if (!URL.canParse(url)) {
          // console.log(`could not parse ${url}`);
          canParse = false;
        }
      }

      if (newsUrls.length >= 10 && canParse) validFiles.push(fileName);

      // console.log(`fileName: ${fileName}`);
      // console.log('newsUrls', newsUrls, '\n');
    }

    expect(htmlFileNames).toEqual(validFiles);
  });
});
