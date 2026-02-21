import { createApp } from './app.js';
import { config } from './config.js';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const app = await createApp();

  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`SummitR API running on http://localhost:${config.port}`);

    // Run seed in background as a child process after server is listening.
    // This keeps the seed alive as part of the server's process tree so
    // Railway won't kill it prematurely.
    if (config.nodeEnv === 'production') {
      const serverRoot = path.resolve(__dirname, '..');
      const seedScript = path.join(serverRoot, 'prisma', 'seed.ts');
      console.log('[seed] Starting background seed process...');
      const child = spawn('npx', ['tsx', seedScript], {
        cwd: serverRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false,
      });
      child.stdout?.on('data', (data: Buffer) => {
        process.stdout.write(`[seed] ${data.toString()}`);
      });
      child.stderr?.on('data', (data: Buffer) => {
        process.stderr.write(`[seed:err] ${data.toString()}`);
      });
      child.on('exit', (code) => {
        console.log(`[seed] Seed process finished with code ${code}`);
      });
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
