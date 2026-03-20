import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');
const filePath = path.join(dataDir, 'cars.json');

// Simple in-process mutex to serialize writes
let writeLock = Promise.resolve();

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    // create file if missing
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    throw new Error(`Failed to ensure data file: ${err.message}`);
  }
}

async function readAll() {
  await ensureDataFile();
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    // If file corrupted, reset to empty array
    await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
}

async function writeAll(items) {
  // serialize writes using a promise queue (simple mutex)
  writeLock = writeLock.then(async () => {
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');
    await fs.rename(tmp, filePath); // atomic on most OSes
  });
  return writeLock;
}

export async function getAll() {
  const items = await readAll();
  // return newest first to match earlier examples
  return items.slice().reverse();
}

export async function getById(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  const items = await readAll();
  return items.find(v => v.id === n) || null;
}

export async function create(vehicle) {
  const items = await readAll();
  const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newV = {
    id: nextId,
    make: vehicle.make ?? '',
    model: vehicle.model ?? '',
    year: vehicle.year ?? null,
    price: vehicle.price ?? null,
    description: vehicle.description ?? ''
  };
  items.push(newV);
  await writeAll(items);
  return newV;
}

export async function update(id, vehicle) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  const items = await readAll();
  const idx = items.findIndex(v => v.id === n);
  if (idx === -1) return null;
  items[idx] = {
    id: n,
    make: vehicle.make ?? items[idx].make,
    model: vehicle.model ?? items[idx].model,
    year: vehicle.year ?? items[idx].year,
    price: vehicle.price ?? items[idx].price,
    description: vehicle.description ?? items[idx].description
  };
  await writeAll(items);
  return items[idx];
}

export async function remove(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return false;
  const items = await readAll();
  const filtered = items.filter(v => v.id !== n);
  if (filtered.length === items.length) return false;
  await writeAll(filtered);
  return true;
}
