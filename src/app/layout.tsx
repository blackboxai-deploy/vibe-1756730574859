import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tic-Tac-Toe AI',
  description: 'Play Tic-Tac-Toe against an intelligent AI opponent with multiple difficulty levels.',
  keywords: 'tic-tac-toe, AI, game, strategy, minimax',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}