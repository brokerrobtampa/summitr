import { createApp } from './app.js';
import { config } from './config.js';

async function main() {
  const app = await createApp();

  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`SummitR API running on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
