import type { Session } from '../entities/session';

export interface SessionRepository {
  create(): Promise<{ sessionKey: string; playerId: string }>;
  join(key: string): Promise<{ playerId: string; session: Session }>;
}