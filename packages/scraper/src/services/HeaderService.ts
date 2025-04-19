import UserAgent from 'user-agents';

import type { HeaderService } from '../types.js';

type HeadersInput = {
  [key: string]: string;
};

export default class HeaderServiceImpl implements HeaderService {
  static #DEFAULT_HEADERS = {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.8',
    Referer: 'https://www.google.com/',
    Cookie: 'AEC=AVcja2cow7ag8nPdJDs; SOCS=CAISNQgQEitib3FfaWRY;',
  };

  #headers: HeadersInput;
  #userAgentGenerator: UserAgent;

  constructor(headers: HeadersInput = HeaderServiceImpl.#DEFAULT_HEADERS) {
    this.#headers = headers;
    this.#userAgentGenerator = new UserAgent();
  }

  #getRandomUserAgent() {
    return this.#userAgentGenerator.random();
  }

  getRandomHeaders(): Headers {
    const headers = new Headers(this.#headers);
    headers.set('User-Agent', this.#getRandomUserAgent().toString());

    return headers;
  }
}
