import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStoredUsers } from '@/lib/storage';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { userId } = JSON.parse(session.value);
  const users = getStoredUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
