import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'MTG Deck Builder',
  description: 'Build and manage Magic: The Gathering decks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <AntdRegistry>
          <AppShell>
            {children}
          </AppShell>
        </AntdRegistry>
      </body>
    </html>
  );
}
