import fs from 'fs';
import path from 'path';
import { StoredUser, Deck } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string, defaultValue: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultValue;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getStoredUsers(): StoredUser[] {
  return readJSON<StoredUser[]>('users.json', []);
}

export function saveUsers(users: StoredUser[]): void {
  writeJSON('users.json', users);
}

export function getDecks(): Deck[] {
  return readJSON<Deck[]>('decks.json', []);
}

export function saveDecks(decks: Deck[]): void {
  writeJSON('decks.json', decks);
}
