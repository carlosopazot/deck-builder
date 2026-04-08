import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getStoredUsers } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const users = getStoredUsers();
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({ userId: user.id }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  const { password: _password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
