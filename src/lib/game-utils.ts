// Game utility functions for Tic-Tac-Toe

export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type GameStatus = 'playing' | 'won' | 'draw' | 'ai-thinking';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player;
  difficulty: Difficulty;
  scores: {
    player: number;
    ai: number;
    draws: number;
  };
}

// Check if there's a winner
export function checkWinner(board: Board): Player {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

// Check if the board is full
export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

// Get available moves
export function getAvailableMoves(board: Board): number[] {
  return board
    .map((cell, index) => cell === null ? index : null)
    .filter((index): index is number => index !== null);
}

// Check if the game is over
export function isGameOver(board: Board): boolean {
  return checkWinner(board) !== null || isBoardFull(board);
}

// Create a copy of the board with a move applied
export function makeMove(board: Board, position: number, player: Player): Board {
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

// Initialize empty board
export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

// Get game status
export function getGameStatus(board: Board): GameStatus {
  const winner = checkWinner(board);
  if (winner) return 'won';
  if (isBoardFull(board)) return 'draw';
  return 'playing';
}