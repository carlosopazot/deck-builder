export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type DeckFormat = 'Standard' | 'Modern' | 'Commander' | 'Pauper' | 'Pioneer' | 'Legacy';

export const FORMAT_RULES: Record<DeckFormat, { min: number; max: number; label: string }> = {
  Standard: { min: 60, max: Infinity, label: 'Standard (60+ cards)' },
  Modern: { min: 60, max: Infinity, label: 'Modern (60+ cards)' },
  Commander: { min: 100, max: 100, label: 'Commander (exactly 100 cards)' },
  Pauper: { min: 60, max: Infinity, label: 'Pauper (60+ cards)' },
  Pioneer: { min: 60, max: Infinity, label: 'Pioneer (60+ cards)' },
  Legacy: { min: 60, max: Infinity, label: 'Legacy (60+ cards)' },
};

export interface DeckCard {
  id: string;
  name: string;
  set: string;
  setName: string;
  manaCost: string;
  typeLine: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Deck {
  id: string;
  userId: string;
  name: string;
  format: DeckFormat;
  coverImage: string;
  cards: DeckCard[];
  createdAt: string;
  updatedAt: string;
}

export interface ScryfallCard {
  id: string;
  name: string;
  set: string;
  set_name: string;
  mana_cost: string;
  type_line: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
  };
  image_uris?: {
    small: string;
    normal: string;
    large: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small: string;
      normal: string;
    };
  }>;
}
