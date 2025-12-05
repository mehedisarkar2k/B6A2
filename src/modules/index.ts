import type { Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import fs from 'fs';

const files = readdirSync(__dirname);

const ROUTES: Array<{ path: string; router: Router }> = [];

// Determine file extension based on environment (ts for dev, js for compiled)
const ext = __filename.endsWith('.ts') ? '.ts' : '.js';

files.forEach((file) => {
  if (file === 'index.ts' || file === 'index.js') return;

  // dynamically import all the route files
  const fileName = `${file}/${file}.routes${ext}`;
  const pathDir = path.join(__dirname, fileName);

  if (fs.existsSync(pathDir)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require(pathDir);
    const router = Object.values(module)[0] as Router;
    ROUTES.push({
      path: `/${file}`,
      router,
    });
  }
});

export { ROUTES };
