import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { component$ } from '@builder.io/qwik';
import TypeWriter from '~/components/typewriter';

export const head: DocumentHead = {
  title: 'Daily news',
  meta: [
    {
      name: 'description',
      content: 'Your daily news. Ai generated.',
    },
  ],
};

export default component$(() => {
  return (
    <>
      <h1>News website</h1>

      <TypeWriter
        class='text-green-500'
        text='check out this cool typewriter effect'
        startingIndex={0}
        intervalMs={250}
        enabled={true}
        loop={true}
      />

      <Link class='block' href='/news'>
        Js go to news 🙏
      </Link>

      {import.meta.env.DEV && <p>TESTING math.random: {Math.random()}</p>}
    </>
  );
});
