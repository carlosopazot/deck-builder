import { useState, useCallback, useRef } from 'react';
import { ScryfallCard } from '@/types';
import { searchCards } from '@/services/scryfall/api';
import { MIN_SEARCH_LENGTH, CARD_SEARCH_DEBOUNCE_MS } from '@/lib/constants';

export function useCardSearch() {
  const [results, setResults] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cards = await searchCards(query);
        setResults(cards.slice(0, 20));
      } finally {
        setLoading(false);
      }
    }, CARD_SEARCH_DEBOUNCE_MS);
  }, []);

  return { results, loading, search };
}
