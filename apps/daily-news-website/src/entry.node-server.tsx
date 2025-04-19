/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.dev/docs/deployments/node/
 *
 */
import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';
import { manifest } from '@qwik-client-manifest';
import { createServer } from 'node:http';
import env from './utils/env';

// Allow for dynamic port
const PORT = process.env.PORT ?? 3004;

// Create the Qwik City express middleware
const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
  manifest,
  origin: env.RENDER_EXTERNAL_URL,
});

const server = createServer();

server.on('request', (req, res) => {
  staticFile(req, res, () => {
    router(req, res, () => {
      notFound(req, res, () => {});
    });
  });
});

server.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
