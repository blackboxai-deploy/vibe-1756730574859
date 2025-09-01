'use client';

import { Difficulty } from '@/lib/game-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
  gameStatus?: 'playing' | 'won' | 'draw' | 'ai-thinking';
}

const difficulties: { value: Difficulty; label: string; description: string; emoji: string }[] = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'AI makes some random moves',
    emoji: '😊'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Balanced strategic play',
    emoji: '🤔'
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Optimal AI strategy',
    emoji: '😤'
  }
];

export default function DifficultySelector({ currentDifficulty, onDifficultyChange, disabled, gameStatus }: DifficultySelectorProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">🎯 AI Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty.value}
              variant={currentDifficulty === difficulty.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDifficultyChange(difficulty.value)}
              disabled={disabled}
              className="h-auto flex flex-col gap-1 py-3"
            >
              <span className="text-lg">{difficulty.emoji}</span>
              <span className="text-xs font-medium">{difficulty.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {difficulties.find(d => d.value === currentDifficulty)?.emoji}
            </span>
            <span className="font-medium text-sm">
              {difficulties.find(d => d.value === currentDifficulty)?.label} Mode
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {difficulties.find(d => d.value === currentDifficulty)?.description}
          </p>
          {gameStatus === 'playing' && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              💡 Change takes effect on AI&apos;s next turn
            </p>
          )}
          {gameStatus === 'ai-thinking' && (
            <p className="text-xs text-amber-600 mt-2 font-medium">
              ⏳ Change will apply after AI&apos;s current move
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}