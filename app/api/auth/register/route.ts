import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getStoredUsers, saveUsers } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  const users = getStoredUsers();
  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    name,
    createdAt: new Date().toISOString(),
    password: hashed,
  };

  users.push(newUser);
  saveUsers(users);

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({ userId: newUser.id }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const { password: _password, ...userWithoutPassword } = newUser;
  return NextResponse.json(userWithoutPassword);
}
