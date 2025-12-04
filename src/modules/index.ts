import type { Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import fs from 'fs';

const files = readdirSync(__dirname);

const ROUTES: Array<{ path: string; router: Router }> = [];

files.forEach((file) => {
  if (file === 'index.ts') return;

  // dynamically import all the route files
  const fileName = `${file}/${file}.routes.ts`;
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
