import { ScryfallCard } from '@/types';

export async function searchCards(query: string): Promise<ScryfallCard[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`/api/cards/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export function getCardImageUrl(card: ScryfallCard): string {
  if (card.image_uris) return card.image_uris.normal;
  if (card.card_faces?.[0]?.image_uris) return card.card_faces[0].image_uris.normal;
  return '';
}

export function getCardPrice(card: ScryfallCard): number {
  return parseFloat(card.prices.usd || '0') || 0;
}
