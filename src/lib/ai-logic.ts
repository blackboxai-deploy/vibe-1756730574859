// AI logic for Tic-Tac-Toe game using minimax algorithm

import { 
  Board, 
  Difficulty, 
  checkWinner, 
  getAvailableMoves, 
  makeMove, 
  isGameOver 
} from './game-utils';

// Minimax algorithm implementation
function minimax(board: Board, depth: number, isMaximizing: boolean, alpha = -Infinity, beta = Infinity): number {
  const winner = checkWinner(board);
  
  // Terminal states
  if (winner === 'O') return 10 - depth; // AI wins (O)
  if (winner === 'X') return depth - 10; // Player wins (X)
  if (isGameOver(board)) return 0; // Draw

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'O');
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'X');
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

// Get the best move using minimax
function getBestMove(board: Board): number {
  let bestMove = -1;
  let bestValue = -Infinity;
  const availableMoves = getAvailableMoves(board);

  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, 'O');
    const moveValue = minimax(newBoard, 0, false);
    
    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove;
}

// Get a random move from available moves
function getRandomMove(board: Board): number {
  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Get a strategic move (prioritize center, corners, then sides)
function getStrategicMove(board: Board): number {
  const availableMoves = getAvailableMoves(board);
  
  // Priority: center (4), corners (0,2,6,8), sides (1,3,5,7)
  const center = [4];
  const corners = [0, 2, 6, 8];
  const sides = [1, 3, 5, 7];
  
  // Check center first
  for (const move of center) {
    if (availableMoves.includes(move)) return move;
  }
  
  // Then corners
  const availableCorners = corners.filter(move => availableMoves.includes(move));
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Finally sides
  const availableSides = sides.filter(move => availableMoves.includes(move));
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }
  
  // Fallback to random
  return getRandomMove(board);
}

// Check if AI can win in one move
function getWinningMove(board: Board): number | null {
  const availableMoves = getAvailableMoves(board);
  
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, 'O');
    if (checkWinner(newBoard) === 'O') {
      return move;
    }
  }
  
  return null;
}

// Check if AI needs to block player from winning
function getBlockingMove(board: Board): number | null {
  const availableMoves = getAvailableMoves(board);
  
  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, 'X');
    if (checkWinner(newBoard) === 'X') {
      return move; // Block this winning move
    }
  }
  
  return null;
}

// Main AI move function
export function getAIMove(board: Board, difficulty: Difficulty): number {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    throw new Error('No available moves');
  }

  // Always check for winning move first
  const winningMove = getWinningMove(board);
  if (winningMove !== null) return winningMove;

  // Always check for blocking move
  const blockingMove = getBlockingMove(board);
  if (blockingMove !== null && difficulty !== 'easy') return blockingMove;

  switch (difficulty) {
    case 'easy':
      // 70% random, 30% strategic
      return Math.random() < 0.7 ? getRandomMove(board) : getStrategicMove(board);
    
    case 'medium':
      // 60% strategic, 40% optimal
      return Math.random() < 0.6 ? getStrategicMove(board) : getBestMove(board);
    
    case 'hard':
      // Always optimal play
      return getBestMove(board);
    
    default:
      return getRandomMove(board);
  }
}

// Simulate a delay for AI thinking (for better UX)
export async function getAIMoveWithDelay(board: Board, difficulty: Difficulty): Promise<number> {
  const thinkingTime = difficulty === 'hard' ? 800 : difficulty === 'medium' ? 500 : 300;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAIMove(board, difficulty));
    }, thinkingTime);
  });
}