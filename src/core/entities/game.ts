export type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';

export interface Board {
  cells: CellState[][];
  ships: Ship[];
}

export interface Ship {
  cells: Array<{ x: number; y: number }>;
  sunk: boolean;
}

export interface GameState {
  sessionKey: string;
  playerBoard: Board;
  opponentBoard: Board;
  currentPlayer: string;
  winner?: string;
}

export interface Move {
  x: number;
  y: number;
  player: string;
  result: 'miss' | 'hit' | 'sunk';
  timestamp: Date;
}