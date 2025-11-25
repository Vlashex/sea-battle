import { SessionService } from '../../core/services/session.service';
import { PlacementService } from '../../core/services/placement.service';
import { BattleService } from '../../core/services/battle.service';
import { SessionApiAdapter } from '../api/implementations/session-api.adapter';
import { GameApiAdapter } from '../api/implementations/game-api.adapter';

// Создаем экземпляры адаптеров
const sessionAdapter = new SessionApiAdapter();
const gameAdapter = new GameApiAdapter();

// Создаем сервисы с внедренными зависимостями
export const sessionService = new SessionService(sessionAdapter);
export const placementService = new PlacementService();
export const battleService = new BattleService();
export const gameRepository = gameAdapter;