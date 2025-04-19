import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$ } from '@builder.io/qwik-city';
import ArticleService from '~/services/ArticleService';

export const useArticlesLoader = routeLoader$(() => {
  return ArticleService.getTodaysSummary();
});

export default component$(() => {
  const articlesLoader = useArticlesLoader();

  return (
    <>
      <h1>Top 10 daily news</h1>
      <Link href='/'>Take me back 😭</Link>

      <details class='flex flex-col items-center' open>
        <summary>Today's top news summarized</summary>
        <div dangerouslySetInnerHTML={articlesLoader.value?.summary}></div>
      </details>

      <footer class='max-w-xs gap-5 rounded border border-blue-300 bg-blue-100 p-4 text-center text-blue-500 md:max-w-2xl lg:max-w-6xl'>
        <strong class='block'>
          Note: There should be 10 summaries on the page, however the ai is
          stupid sometimes and gives less.
        </strong>

        <strong class='block'>
          The ai also does not recognize errors most of the time.
        </strong>

        <p class='text-center leading-8'>
          {articlesLoader.value ? (
            <>
              <span class='block'>All searches from google.</span>{' '}
              <span class='block'>
                All summaries generated using OpenRouter.
              </span>{' '}
              <span class='block'>
                Generated using {articlesLoader.value.model}
              </span>
            </>
          ) : (
            <span class='text-red-500'>
              There have been no news generated today.
            </span>
          )}
        </p>
      </footer>
    </>
  );
});
