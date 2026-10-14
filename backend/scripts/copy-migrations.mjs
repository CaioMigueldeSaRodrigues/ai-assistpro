import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('src/db/migrations');
const target = resolve('dist/db/migrations');

await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
