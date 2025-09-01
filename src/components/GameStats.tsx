'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameStatsProps {
  scores: {
    player: number;
    ai: number;
    draws: number;
  };
  onClearStats: () => void;
}

export default function GameStats({ scores, onClearStats }: GameStatsProps) {
  const totalGames = scores.player + scores.ai + scores.draws;
  const playerWinRate = totalGames > 0 ? ((scores.player / totalGames) * 100).toFixed(1) : '0';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          🏆 Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-blue-600">
              <span className="text-sm font-medium">👤 You</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{scores.player}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-gray-600">
              <span className="text-sm font-medium">➖ Draws</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">{scores.draws}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-red-500">
              <span className="text-sm font-medium">🤖 AI</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{scores.ai}</div>
          </div>
        </div>

        {totalGames > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Games:</span>
              <span className="font-medium">{totalGames}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Win Rate:</span>
              <span className="font-medium">{playerWinRate}%</span>
            </div>
          </div>
        )}

        {totalGames > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearStats}
            className="w-full"
          >
            Clear Statistics
          </Button>
        )}
      </CardContent>
    </Card>
  );
}