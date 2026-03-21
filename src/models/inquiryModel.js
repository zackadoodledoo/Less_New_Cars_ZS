import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', 'data', 'product_submissions.json');

async function readAll() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAll(items) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf8');
}

export async function create(inquiry) {
  const items = await readAll();
  const id = items.length ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
  const record = { id, ...inquiry };
  items.push(record);
  await writeAll(items);
  return record;
}

export async function getAll() {
  return await readAll();
}
