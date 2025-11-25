export interface Session {
  key: string;
  status: 'waiting' | 'placement' | 'battle' | 'finished';
  players: string[];
}