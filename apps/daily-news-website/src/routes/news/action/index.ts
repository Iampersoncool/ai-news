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
  `Your task is to write a summary of all of the articles in the following text. 
  Cite all sources in the articles, which are in html comment tags <!-- start-sources --> and <!-- end-sources -->.
  Also include all errors in the articles, which are in html comment tags <!-- start-errors --> and <!-- end-errors -->.
  Make sure to write everything in markdown format. Most importantly, do not write anything else other than the summary.
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

  const articlesContents = await scrapeGoogleNewsTab('breaking news', 10, 10);
  await articleService.createSummary(articlesContents.join('\n'), model);

  req.json(201, {
    message: 'successfully created summary',
  });
};
