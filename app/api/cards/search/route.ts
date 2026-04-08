import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=name&unique=prints`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(data.data?.slice(0, 20) || []);
  } catch {
    return NextResponse.json([]);
  }
}
