import type { Session } from '../entities/session';

export interface SessionRepository {
  create(): Promise<Session>;
  join(key: string): Promise<Session>;
}