export interface ScraperService {
  scrape(url: string): Promise<string>;
}

export interface ProxyService {
  getRandom(): string;
}

export interface UserAgentService {
  getRandom(): string;
}

export interface HeaderService {
  getRandomHeaders(): Headers;
}
