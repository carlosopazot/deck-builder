import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStoredUsers, getDecks, saveDecks } from '@/lib/storage';

async function getAuthUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;
  const { userId } = JSON.parse(session.value);
  const users = getStoredUsers();
  return users.find(u => u.id === userId) || null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const deck = getDecks().find(d => d.id === id && d.userId === user.id);
  if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(deck);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const decks = getDecks();
  const index = decks.findIndex(d => d.id === id && d.userId === user.id);

  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  decks[index] = { ...decks[index], ...body, updatedAt: new Date().toISOString() };
  saveDecks(decks);

  return NextResponse.json(decks[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const decks = getDecks();
  const filtered = decks.filter(d => !(d.id === id && d.userId === user.id));

  if (filtered.length === decks.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  saveDecks(filtered);
  return NextResponse.json({ success: true });
}
