import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getUsers, getDecks, saveDecks } from '@/lib/storage';

async function getAuthUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;
  const { userId } = JSON.parse(session.value);
  const users = getUsers() as any[];
  return users.find(u => u.id === userId) || null;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const decks = getDecks().filter(d => d.userId === user.id);
  return NextResponse.json(decks);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await req.json();
  const deck = {
    id: uuidv4(),
    userId: user.id,
    name: body.name,
    format: body.format,
    coverImage: body.coverImage || '',
    cards: body.cards || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const decks = getDecks();
  decks.push(deck);
  saveDecks(decks);
  
  return NextResponse.json(deck, { status: 201 });
}
