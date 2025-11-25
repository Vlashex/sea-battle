import type { Ship } from '../entities/game';

export interface GameRepository {
  placeShips(sessionKey: string, ships: Ship[]): Promise<void>;
  makeMove(sessionKey: string, x: number, y: number): Promise<MoveResult>;
  getGameState?(sessionKey: string): Promise<any>;
}

export interface MoveResult {
  exodus: 'miss' | 'wounded' | 'killed';
  ship?: Array<[number, number]>;
}