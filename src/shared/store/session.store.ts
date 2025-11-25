import { create } from 'zustand';
import type { Session } from '../../core/entities/session';

interface SessionState {
  currentSession: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  setSession: (session) => set({ currentSession: session }),
  clearSession: () => set({ currentSession: null }),
}));