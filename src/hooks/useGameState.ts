'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Board, 
  Difficulty, 
  GameState, 
  createEmptyBoard, 
  checkWinner, 
  getGameStatus,
  makeMove 
} from '@/lib/game-utils';
import { getAIMoveWithDelay } from '@/lib/ai-logic';

const STORAGE_KEY = 'tictactoe-scores';

interface UseGameStateReturn {
  gameState: GameState;
  makePlayerMove: (position: number) => void;
  resetGame: () => void;
  changeDifficulty: (difficulty: Difficulty) => void;
  clearStats: () => void;
}

// Load scores from localStorage
function loadScores() {
  if (typeof window === 'undefined') return { player: 0, ai: 0, draws: 0 };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading scores:', error);
  }
  
  return { player: 0, ai: 0, draws: 0 };
}

// Save scores to localStorage
function saveScores(scores: { player: number; ai: number; draws: number }) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving scores:', error);
  }
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPlayer: 'X', // Player always starts
    gameStatus: 'playing',
    winner: null,
    difficulty: 'medium',
    scores: loadScores()
  }));

  // Make AI move
  const makeAIMove = useCallback(async (board: Board, difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, gameStatus: 'ai-thinking' }));

    try {
      const aiMove = await getAIMoveWithDelay(board, difficulty);
      const newBoard = makeMove(board, aiMove, 'O');
      const winner = checkWinner(newBoard);
      const status = getGameStatus(newBoard);

      setGameState(prev => {
        let newScores = prev.scores;
        
        if (status === 'won' && winner === 'O') {
          newScores = { ...prev.scores, ai: prev.scores.ai + 1 };
          saveScores(newScores);
        } else if (status === 'draw') {
          newScores = { ...prev.scores, draws: prev.scores.draws + 1 };
          saveScores(newScores);
        }

        return {
          ...prev,
          board: newBoard,
          currentPlayer: 'X',
          gameStatus: status,
          winner,
          scores: newScores
        };
      });
    } catch (error) {
      console.error('AI move failed:', error);
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    }
  }, []);

  // Make player move
  const makePlayerMove = useCallback((position: number) => {
    setGameState(prev => {
      // Validate move
      if (prev.board[position] !== null || prev.gameStatus !== 'playing') {
        return prev;
      }

      const newBoard = makeMove(prev.board, position, 'X');
      const winner = checkWinner(newBoard);
      const status = getGameStatus(newBoard);

      let newScores = prev.scores;
      
      if (status === 'won' && winner === 'X') {
        newScores = { ...prev.scores, player: prev.scores.player + 1 };
        saveScores(newScores);
      } else if (status === 'draw') {
        newScores = { ...prev.scores, draws: prev.scores.draws + 1 };
        saveScores(newScores);
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: 'O',
        gameStatus: status,
        winner,
        scores: newScores
      };
    });
  }, []);

  // Effect to trigger AI move
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.gameStatus === 'playing') {
      makeAIMove(gameState.board, gameState.difficulty);
    }
  }, [gameState.currentPlayer, gameState.gameStatus, gameState.board, gameState.difficulty, makeAIMove]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null
    }));
  }, []);

  // Change difficulty
  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => {
      // Only reset the game if it's finished (won or draw)
      // Allow difficulty changes during active games
      const shouldResetGame = prev.gameStatus === 'won' || prev.gameStatus === 'draw';
      
      if (shouldResetGame) {
        return {
          ...prev,
          difficulty,
          board: createEmptyBoard(),
          currentPlayer: 'X',
          gameStatus: 'playing',
          winner: null
        };
      } else {
        // Just change difficulty without resetting the game
        return {
          ...prev,
          difficulty
        };
      }
    });
  }, []);

  // Clear statistics
  const clearStats = useCallback(() => {
    const newScores = { player: 0, ai: 0, draws: 0 };
    setGameState(prev => ({ ...prev, scores: newScores }));
    saveScores(newScores);
  }, []);

  return {
    gameState,
    makePlayerMove,
    resetGame,
    changeDifficulty,
    clearStats
  };
}