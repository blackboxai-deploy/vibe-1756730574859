'use client';

import { Board, Player } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  disabled: boolean;
  winner: Player;
}

interface CellProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
  position: number;
  isWinningCell?: boolean;
}

function Cell({ value, onClick, disabled, position, isWinningCell }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={cn(
        'aspect-square w-full flex items-center justify-center text-4xl font-bold border-2 border-gray-300 bg-white transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed',
        {
          'text-blue-600': value === 'X',
          'text-red-500': value === 'O',
          'hover:border-blue-400 hover:bg-blue-50': !disabled && !value && !isWinningCell,
          'border-green-400 bg-green-50': isWinningCell,
          'cursor-pointer': !disabled && !value,
          'bg-gray-100': disabled && !value
        }
      )}
      aria-label={`Cell ${position + 1}${value ? ` - ${value}` : ' - empty'}`}
    >
      {value && (
        <span className={cn(
          'transition-all duration-300 transform scale-100',
          {
            'text-blue-600': value === 'X',
            'text-red-500': value === 'O'
          }
        )}>
          {value}
        </span>
      )}
    </button>
  );
}

export default function GameBoard({ board, onCellClick, disabled, winner }: GameBoardProps) {
  // Find winning cells for highlighting
  const getWinningCells = (): number[] => {
    if (!winner) return [];
    
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of winningCombinations) {
      if (board[a] === winner && board[b] === winner && board[c] === winner) {
        return [a, b, c];
      }
    }

    return [];
  };

  const winningCells = getWinningCells();

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-lg shadow-inner"
        role="grid"
        aria-label="Tic-tac-toe game board"
      >
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            disabled={disabled}
            position={index}
            isWinningCell={winningCells.includes(index)}
          />
        ))}
      </div>
    </div>
  );
}