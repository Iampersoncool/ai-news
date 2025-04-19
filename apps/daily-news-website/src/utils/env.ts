import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

const env = createEnv({
  server: {
    RENDER_EXTERNAL_URL: v.pipe(v.string(), v.url()),
    DATABASE_URL: v.string(),
    SECRET: v.string(),
    OPENROUTER_API_KEY: v.string(),
  },

  client: {},
  clientPrefix: 'VITE_',
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;
