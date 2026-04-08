'use client';
import { Typography, message, Spin } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { useDeck } from '@/hooks/useDeck';
import { DeckForm } from '@/features/decks/DeckForm';
import { Deck } from '@/types';

export default function EditDeckPage() {
  const params = useParams();
  const { deck, loading } = useDeck(params.id as string);
  const router = useRouter();

  const handleSubmit = async (data: Partial<Deck>) => {
    const res = await fetch(`/api/decks/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      message.success('Deck updated!');
      router.push(`/decks/${params.id}`);
    } else {
      const err = await res.json();
      message.error(err.error || 'Failed to update deck');
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />;
  if (!deck) return <Typography.Text>Deck not found</Typography.Text>;

  return (
    <div>
      <Typography.Title level={2}>Edit Deck</Typography.Title>
      <DeckForm initialDeck={deck} onSubmit={handleSubmit} />
    </div>
  );
}
