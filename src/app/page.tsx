'use client';

import { useGameState } from '@/hooks/useGameState';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import DifficultySelector from '@/components/DifficultySelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { gameState, makePlayerMove, resetGame, changeDifficulty, clearStats } = useGameState();

  const getGameStatusMessage = () => {
    if (gameState.gameStatus === 'ai-thinking') {
      return '🤖 AI is thinking...';
    }
    
    if (gameState.gameStatus === 'won') {
      if (gameState.winner === 'X') {
        return '🎉 You won! Great job!';
      } else {
        return '🤖 AI wins! Better luck next time!';
      }
    }
    
    if (gameState.gameStatus === 'draw') {
      return '🤝 It&apos;s a draw! Well played!';
    }
    
    if (gameState.currentPlayer === 'X') {
      return '👤 Your turn - Choose a cell!';
    } else {
      return '🤖 AI&apos;s turn...';
    }
  };

  const isGameActive = gameState.gameStatus === 'playing' || gameState.gameStatus === 'ai-thinking';
  const showResetButton = gameState.gameStatus === 'won' || gameState.gameStatus === 'draw';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            🎮 Tic-Tac-Toe AI
          </h1>
          <p className="text-gray-600">Challenge yourself against our smart AI opponent!</p>
        </div>

        {/* Game Status */}
        <Card className="max-w-md mx-auto">
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-2">
                {getGameStatusMessage()}
              </p>
              {gameState.gameStatus === 'ai-thinking' && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Game Stats */}
          <div className="lg:order-1">
            <GameStats scores={gameState.scores} onClearStats={clearStats} />
          </div>

          {/* Game Board */}
          <div className="lg:order-2 space-y-6">
            <GameBoard
              board={gameState.board}
              onCellClick={makePlayerMove}
              disabled={!isGameActive || gameState.currentPlayer === 'O'}
              winner={gameState.winner}
            />
            
            {/* Game Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={resetGame}
                variant={showResetButton ? 'default' : 'outline'}
                className="px-8"
              >
                {showResetButton ? '🎯 Play Again' : '🔄 Reset Game'}
              </Button>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="lg:order-3">
            <DifficultySelector
              currentDifficulty={gameState.difficulty}
              onDifficultyChange={changeDifficulty}
              disabled={false}
              gameStatus={gameState.gameStatus}
            />
          </div>
        </div>

        {/* Game Instructions */}
        <Card className="max-w-2xl mx-auto bg-white/80">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold mb-4">📋 How to Play</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🎯 Objective</h4>
                <p>Get three X&apos;s in a row (horizontal, vertical, or diagonal) before the AI gets three O&apos;s!</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🤖 AI Levels</h4>
                <ul className="space-y-1">
                  <li><strong>Easy:</strong> AI makes random moves</li>
                  <li><strong>Medium:</strong> Mix of strategy and randomness</li>
                  <li><strong>Hard:</strong> Optimal AI play - very challenging!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}