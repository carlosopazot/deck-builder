'use client';
import { Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { DeckForm } from '@/features/decks/DeckForm';
import { Deck } from '@/types';

export default function NewDeckPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Deck>) => {
    const res = await fetch('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const deck = await res.json();
      message.success('Deck created!');
      router.push(`/decks/${deck.id}`);
    } else {
      const err = await res.json();
      message.error(err.error || 'Failed to create deck');
    }
  };

  return (
    <div>
      <Typography.Title level={2}>Create New Deck</Typography.Title>
      <DeckForm onSubmit={handleSubmit} />
    </div>
  );
}
