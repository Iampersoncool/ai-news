import * as v from 'valibot';
import type { RequestHandler } from '@builder.io/qwik-city';
import { scrapeGoogleNewsTab } from '~/utils/articles';
import { safeEqual } from '~/utils/string';
import env from '~/utils/env';
import ArticleService from '~/services/ArticleService';
import { openRouterClient } from '~/utils/openai';

const SECRET = env.SECRET;

const articleService = new ArticleService(
  openRouterClient,
  `You will be given JSON data of news articles.
  Your task is to summarize the article contents.
  Make sure to return the summary in markdown format.
  Important: Include sources and errors found in the data.
  `,
);

const bodyValidator = v.object({
  secret: v.pipe(v.string(), v.nonEmpty('Secret cannot be empty')),
  model: v.pipe(v.string(), v.nonEmpty('Model cannot be empty')),
});

export const onPost: RequestHandler = async req => {
  const body = await req.parseBody();
  const validationStatus = v.safeParse(bodyValidator, body);

  if (!validationStatus.success)
    throw req.json(400, {
      issues: validationStatus.issues.map(issue => issue.message),
    });

  const { secret, model } = validationStatus.output;
  if (!safeEqual(SECRET, secret))
    throw req.json(401, {
      message: 'Invalid secret',
    });

  const newsArticles = await scrapeGoogleNewsTab('breaking news', 10, 10);
  await articleService.createSummary(newsArticles, model);

  req.json(201, {
    message: 'successfully created summary',
  });
};
