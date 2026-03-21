import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', 'data', 'products.json');

async function readAll() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getAll() {
  return await readAll();
}

export async function getById(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  const items = await readAll();
  return items.find(p => p.id === n) || null;
}

export async function create(product) {
  const items = await readAll();
  const id = items.length ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
  const record = { id, ...product };
  items.push(record);
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf8');
  return record;
}
