import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlacementService } from '../../../core/services/placement.service';
import type { GameRepository } from '../../../core/ports/game.repository';

export interface PlacementModel {
  grid: number[][];
  loading: boolean;
  toggleCell: (x: number, y: number) => void;
  handleSubmit: () => Promise<void>;
  playerId?: string;
}

const SIZE = 10;

export function usePlacementModel(
  placementService: PlacementService,
  gameRepository: GameRepository
): PlacementModel {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const [grid, setGrid] = useState<number[][]>(
    Array(SIZE)
      .fill(0)
      .map(() => Array(SIZE).fill(0))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const toggleCell = (x: number, y: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[y][x] = newGrid[y][x] ? 0 : 1;
      return newGrid;
    });
  };

  const handleSubmit = async () => {
    if (!sessionKey) {
      alert('Сессия не найдена');
      return;
    }

    try {
      const playerId = getPlayerId();
      console.log(`Submitting ships for player ${playerId} in session ${sessionKey}`);

      const validation = placementService.validateShips(grid);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setLoading(true);
      const ships = placementService.convertToShips(grid);
      await gameRepository.placeShips(sessionKey, ships, playerId);
      navigate(`/battle/${sessionKey}`);
    } catch (error) {
      alert('Ошибка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    grid,
    loading,
    toggleCell,
    handleSubmit,
    playerId: sessionKey ? localStorage.getItem(`session_${sessionKey}`) || undefined : undefined,
  };
}