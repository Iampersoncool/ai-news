import { $, useSignal, useTask$ } from '@builder.io/qwik';

export interface TypeWriterOpts {
  text: string;
  startIndex: number;
  intervalMs: number;
  loop: boolean;
}

export const useTypeWriter = (opts: TypeWriterOpts) => {
  const { text, startIndex, loop, intervalMs } = opts;

  const textSignal = useSignal<string>('');
  const indexSignal = useSignal<number>(startIndex);
  const intervalSignal = useSignal<NodeJS.Timeout>();

  const startTyping = $(() => {
    intervalSignal.value = setInterval(() => {
      console.log('IN');

      if (indexSignal.value === text.length) {
        if (loop) indexSignal.value = startIndex;
        else clearInterval(intervalSignal.value);

        return;
      }

      indexSignal.value++;
    }, intervalMs);
  });

  useTask$(ctx => {
    const index = ctx.track(() => indexSignal.value);
    textSignal.value = text.substring(startIndex, index);
  });

  return {
    textSignal,

    reset: $(() => {
      clearInterval(intervalSignal.value);

      intervalSignal.value = undefined;
      indexSignal.value = startIndex;
    }),

    pause: $(() => {
      clearInterval(intervalSignal.value);
      intervalSignal.value = undefined;
    }),
    resume: startTyping,
  };
};
