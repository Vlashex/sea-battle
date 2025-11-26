import type { Ship } from '../entities/game';

export interface GameRepository {
  placeShips(sessionKey: string, ships: Ship[], playerId: string): Promise<void>;
  makeMove(sessionKey: string, x: number, y: number, playerId: string): Promise<MoveResult>;
  getGameState?(sessionKey: string, playerId?: string): Promise<any>;
}

export interface MoveResult {
  exodus: 'miss' | 'wounded' | 'killed';
  ship?: Array<[number, number]>;
  nextPlayer?: 'player_1' | 'player_2'; // Добавляем информацию о следующем игроке
}