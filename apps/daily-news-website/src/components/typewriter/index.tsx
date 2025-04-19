import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';

type TypeWriterProps = {
  text: string;
  startingIndex: number;
  intervalMs: number;
  enabled: boolean;
  loop: boolean;
  class?: string;
};

const TypeWriter = component$((props: TypeWriterProps) => {
  const indexSignal = useSignal<number>(props.startingIndex);
  const intervalIdSignal = useSignal<NodeJS.Timeout>();

  const textSignal = useComputed$(() =>
    props.text.substring(props.startingIndex, indexSignal.value),
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(ctx => {
    const enabled = ctx.track(() => props.enabled);
    ctx.cleanup(() => clearInterval(intervalIdSignal.value));

    if (!enabled) return;

    intervalIdSignal.value = setInterval(() => {
      if (indexSignal.value === props.text.length) {
        if (props.loop) indexSignal.value = props.startingIndex;
        else clearInterval(intervalIdSignal.value);

        return;
      }

      if (import.meta.env.DEV) console.log('INTERVAL RUNNING');

      indexSignal.value++;
    }, props.intervalMs);
  });

  return <span class={props.class}>{textSignal.value}</span>;
});

export default TypeWriter;
