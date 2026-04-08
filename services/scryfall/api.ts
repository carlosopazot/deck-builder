import { ScryfallCard } from '@/types';

export async function searchCards(query: string): Promise<ScryfallCard[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=name&unique=prints`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export function getCardImageUrl(card: ScryfallCard): string {
  if (card.image_uris) return card.image_uris.normal;
  if (card.card_faces?.[0]?.image_uris) return card.card_faces[0].image_uris.normal;
  return '';
}

export function getCardPrice(card: ScryfallCard): number {
  return parseFloat(card.prices.usd || '0') || 0;
}
