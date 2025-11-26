import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { GameRepository } from '../../../core/ports/game.repository';
import { BattleService } from '../../../core/services/battle.service';

export type CellState = '' | 'miss' | 'wounded' | 'killed';

export interface BattleModel {
  board: CellState[][];
  loadingCell: { x: number; y: number } | null;
  status: string;
  currentPlayer: string;
  canMove: boolean;
  handleClick: (x: number, y: number) => Promise<void>;
  getCellDisplay: (state: CellState, x: number, y: number) => string;
  getCellColor: (state: CellState) => string;
  playerId?: string;
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
  const [currentPlayer, setCurrentPlayer] = useState<string>('player_1'); // Начальный игрок
  const [canMove, setCanMove] = useState<boolean>(true);

  // Получаем playerId из localStorage
  const getPlayerId = (): string => {
    if (!sessionKey) {
      throw new Error('Session key not found');
    }
    
    const playerId = localStorage.getItem(`session_${sessionKey}`);
    if (!playerId) {
      throw new Error('Player ID not found. Please return to lobby.');
    }
    
    return playerId;
  };

  const handleClick = async (x: number, y: number) => {
    if (!sessionKey) {
      setStatus('Сессия не найдена');
      return;
    }

    if (board[y][x] || loadingCell || !canMove) return;

    try {
      const playerId = getPlayerId();
      
      // Проверяем, может ли текущий игрок ходить
      if (playerId !== currentPlayer) {
        setStatus(`Сейчас ходит игрок ${currentPlayer}`);
        return;
      }

      console.log(`Making move as player ${playerId} at [${x}, ${y}]`);

      setLoadingCell({ x, y });
      setStatus('Ход выполняется...');

      const result = await gameRepository.makeMove(sessionKey, x, y, playerId);
      
      // Обновляем доску
      setBoard((prev) => battleService.updateBoard(prev, x, y, result));
      
      // Обновляем статус и текущего игрока
      let statusMessage = '';
      switch (result.exodus) {
        case 'miss':
          statusMessage = 'Промах! Ход переходит противнику.';
          setCurrentPlayer(result.nextPlayer || (playerId === 'player_1' ? 'player_2' : 'player_1'));
          break;
        case 'wounded':
          statusMessage = 'Ранен! Ходите еще раз.';
          // Игрок остается тем же - не меняем currentPlayer
          break;
        case 'killed':
          statusMessage = 'Корабль уничтожен! Ходите еще раз.';
          // Игрок остается тем же - не меняем currentPlayer
          break;
      }
      
      setStatus(statusMessage);

      // Блокируем ход на короткое время для визуальной обратной связи
      setCanMove(false);
      setTimeout(() => {
        setCanMove(true);
        // Автоматически очищаем статус через 2 секунды
        setTimeout(() => {
          if (status.includes('Ходите еще раз')) {
            setStatus('Ваш ход продолжается');
          } else if (status.includes('Ход переходит')) {
            setStatus(`Ожидание хода игрока ${currentPlayer}`);
          }
        }, 2000);
      }, 1000);

    } catch (error) {
      const errorMessage = (error as Error).message;
      setStatus('Ошибка: ' + errorMessage);
      
      // Если ошибка "Not your turn", обновляем текущего игрока
      if (errorMessage.includes('Not your turn')) {
        const newPlayer = getPlayerId() === 'player_1' ? 'player_2' : 'player_1';
        setCurrentPlayer(newPlayer);
        setStatus(`Сейчас ходит игрок ${newPlayer}`);
      }
    } finally {
      setLoadingCell(null);
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
    currentPlayer,
    canMove,
    handleClick,
    getCellDisplay,
    getCellColor,
    playerId: sessionKey ? localStorage.getItem(`session_${sessionKey}`) || undefined : undefined,
  };
}