import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'cars.json');

async function seed() {
  await fs.mkdir(dataDir, { recursive: true });
  const seed = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      price: 12000,
      description: 'Reliable compact sedan',
      image: 'toyota-corolla-2018.jpg'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 13500,
      description: 'Comfortable commuter',
      image: 'honda-civic-2019.jpg'
    },
    {
      id: 3,
      make: 'Subaru',
      model: 'Outback',
      year: 2020,
      price: 22000,
      description: 'Spacious and safe',
      image: 'subaru-outback-2020.jpg'
    },
    {
      id: 4,
      make: 'Ford',
      model: 'Focus',
      year: 2017,
      price: 9000,
      description: 'Economical and nimble',
      image: null
    }
  ];

  await fs.writeFile(filePath, JSON.stringify(seed, null, 2), 'utf8');
  console.log('Seed complete');
}

seed().catch(err => { console.error(err); process.exit(1); });