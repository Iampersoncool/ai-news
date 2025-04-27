import {
  HTMLElement,
  parse as parseHTML,
  type Options as HtmlParserRawOpts,
} from 'node-html-parser';
import type { HeaderService, ScraperService } from '../types.js';

export interface NewsArticle {
  content?: string;
  sources: string[];
  errors: string[];
}

type HtmlParserOpts = Partial<HtmlParserRawOpts>;

export default class NewsScraperService implements ScraperService {
  static #REMOVE_ALL_WHITESPACE_REGEX: RegExp = /^\s+|\s+$|\s+(?=\s)/g;

  #headerService: HeaderService;
  #htmlParserOpts: HtmlParserOpts;
  #timeoutMs: number;

  constructor(
    headerService: HeaderService,
    htmlParserOpts: HtmlParserOpts,
    timeoutMs: number = 5000
  ) {
    this.#headerService = headerService;
    this.#htmlParserOpts = htmlParserOpts;
    this.#timeoutMs = timeoutMs;
  }

  static #removeElement(el: HTMLElement) {
    el.remove();
  }

  public getDocumentFromHTML(html: string) {
    const document = parseHTML(html, this.#htmlParserOpts);

    // try to remove all of these elements that use up extra tokens
    document.querySelectorAll('nav').forEach(NewsScraperService.#removeElement);
    document
      .querySelectorAll('iframe')
      .forEach(NewsScraperService.#removeElement);
    document
      .querySelectorAll('footer')
      .forEach(NewsScraperService.#removeElement);
    document
      .querySelectorAll('style')
      .forEach(NewsScraperService.#removeElement);
    document
      .querySelectorAll('noscript')
      .forEach(NewsScraperService.#removeElement);
    document
      .querySelectorAll('script')
      .forEach(NewsScraperService.#removeElement);

    return document;
  }

  public async scrape(url: string) {
    const response = await fetch(url, {
      headers: this.#headerService.getRandomHeaders(),
      signal: AbortSignal.timeout(this.#timeoutMs),
    });

    if (!response.ok)
      throw new Error(
        `failed to fetch ${url}, statusText: ${response.statusText}`
      );

    const html = await response.text();
    const document = this.getDocumentFromHTML(html);

    const body = document.querySelector('body');
    if (!body) throw new Error(`could not find document body for ${url}`);

    const bodyTextContents = body.textContent;

    // remove all whitespaces(to avoid using up too many tokens)
    return bodyTextContents.replace(
      NewsScraperService.#REMOVE_ALL_WHITESPACE_REGEX,
      ' '
    );
  }

  public get timeoutMs() {
    return this.#timeoutMs;
  }

  public set timeoutMs(newTimeoutMs: number) {
    this.#timeoutMs = newTimeoutMs;
  }
}
