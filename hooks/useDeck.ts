import { useState, useEffect } from 'react';
import { Deck } from '@/types';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDecks = async () => {
    const res = await fetch('/api/decks');
    if (res.ok) {
      const data = await res.json();
      setDecks(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDecks(); }, []);

  const deleteDeck = async (id: string) => {
    await fetch(`/api/decks/${id}`, { method: 'DELETE' });
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  return { decks, loading, refetch: fetchDecks, deleteDeck };
}

export function useDeck(id: string) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/decks/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setDeck(data); setLoading(false); });
  }, [id]);

  return { deck, loading, setDeck };
}
