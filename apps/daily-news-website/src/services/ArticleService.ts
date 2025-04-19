import type OpenAI from 'openai';
import type { ArticleSelect } from '~/db/schema';

import markdownit from 'markdown-it';

import ArticleRepository from '~/repositories/ArticleRepository';

export default class ArticleService {
  static #MARKDOWN_PARSER = markdownit();

  #prompt: string;
  #client: OpenAI;

  constructor(client: OpenAI, prompt: string) {
    this.#client = client;
    this.#prompt = prompt;
  }

  public getPrompt(): string {
    return this.#prompt;
  }

  public setPrompt(prompt: string): void {
    this.#prompt = prompt;
  }

  public getClient(): OpenAI {
    return this.#client;
  }

  public setClient(client: OpenAI): void {
    this.#client = client;
  }

  /**
   * @param newsArticlesContents the contents of the news articles to be summarized
   */
  public async createSummary(
    newsArticlesContents: string,
    model: string,
  ): Promise<ArticleSelect[]> {
    const completions = await this.#client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: this.#prompt,
        },
        {
          role: 'user',
          content: newsArticlesContents,
        },
      ],
    });

    const summary = completions.choices[0].message.content;
    // console.dir(completions, { depth: null });

    if (!summary)
      throw new Error(`failed to create summary with model ${model}`);

    const parsedSummary = ArticleService.#MARKDOWN_PARSER.render(summary);
    return ArticleRepository.insertOne({
      summary: parsedSummary,
      model,
    });
  }

  public static async getTodaysSummary(): Promise<ArticleSelect | null> {
    const todayAt8AmUTC = new Date();

    // Set the date to today at 8 AM UTC
    todayAt8AmUTC.setUTCHours(15, 0, 0, 0);

    const [article] = await ArticleRepository.findArticlesAfterDate(
      todayAt8AmUTC,
      1,
    );
    return article;
  }
}
