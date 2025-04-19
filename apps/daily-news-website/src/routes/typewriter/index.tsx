import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import TypeWriter from '~/components/typewriter';

export const head: DocumentHead = {
  title: 'Typewriter demo',
};

const Component = component$(() => {
  const enabledSignal = useSignal(true);

  return (
    <div class='flex flex-col gap-5 text-5xl'>
      <p>Math.random in p: {Math.random()}</p>

      <TypeWriter
        text='Hello world'
        startingIndex={0}
        intervalMs={250}
        enabled={enabledSignal.value}
        loop={true}
      />

      <button onClick$={() => (enabledSignal.value = !enabledSignal.value)}>
        Toggle
      </button>
    </div>
  );
});

export default Component;
