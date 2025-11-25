import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { GameRepository } from '../../../core/ports/game.repository';
import { BattleService } from '../../../core/services/battle.service';

export type CellState = '' | 'miss' | 'wounded' | 'killed';

export interface BattleModel {
  board: CellState[][];
  loadingCell: { x: number; y: number } | null;
  status: string;
  handleClick: (x: number, y: number) => Promise<void>;
  getCellDisplay: (state: CellState, x: number, y: number) => string;
  getCellColor: (state: CellState) => string;
}

const SIZE = 10;

export function useBattleModel(
  gameRepository: GameRepository,
  battleService: BattleService
): BattleModel {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const [board, setBoard] = useState<CellState[][]>(
    Array(SIZE)
      .fill('')
      .map(() => Array(SIZE).fill(''))
  );
  const [loadingCell, setLoadingCell] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState('');

  const handleClick = async (x: number, y: number) => {
    if (!sessionKey) {
      setStatus('Сессия не найдена');
      return;
    }

    if (board[y][x] || loadingCell) return;

    setLoadingCell({ x, y });
    setStatus('Ход выполняется...');

    try {
      const result = await gameRepository.makeMove(sessionKey, x, y);
      
      setBoard((prev) => battleService.updateBoard(prev, x, y, result));
      
      switch (result.exodus) {
        case 'miss':
          setStatus('Промах!');
          break;
        case 'wounded':
          setStatus('Ранен!');
          break;
        case 'killed':
          setStatus('Корабль уничтожен!');
          break;
      }
    } catch (error) {
      setStatus('Ошибка связи с сервером');
    } finally {
      setLoadingCell(null);
      setTimeout(() => setStatus(''), 1500);
    }
  };

  const getCellDisplay = (state: CellState, x: number, y: number): string => {
    if (state === 'miss') return '·';
    if (state === 'wounded') return '×';
    if (state === 'killed') return '💥';
    if (loadingCell?.x === x && loadingCell?.y === y) return '...';
    return '';
  };

  const getCellColor = (state: CellState): string => {
    switch (state) {
      case 'miss':
        return 'bg-blue-200';
      case 'wounded':
        return 'bg-yellow-400';
      case 'killed':
        return 'bg-red-500';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  return {
    board,
    loadingCell,
    status,
    handleClick,
    getCellDisplay,
    getCellColor,
  };
}