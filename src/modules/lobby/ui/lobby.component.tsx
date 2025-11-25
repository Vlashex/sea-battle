import { useLobbyModel } from '../model/lobby.model';
import { sessionService } from '../../../shared/di/dependencies';

// ... остальной код без изменений
export function Lobby() {
  const model = useLobbyModel(sessionService);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-3xl font-bold mb-6">⚓ Морской бой</h1>

      <div className="bg-sky-900 p-6 rounded-xl w-80 flex flex-col gap-4">
        <button
          onClick={model.handleCreate}
          disabled={model.loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 py-2 rounded transition-colors"
        >
          Создать игру
        </button>

        <div className="flex flex-col gap-2">
          <input
            value={model.key}
            onChange={(e) => model.setKey(e.target.value)}
            placeholder="Ключ сессии"
            className="p-2 rounded text-black"
          />
          <button
            onClick={model.handleJoin}
            disabled={model.loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-2 rounded transition-colors"
          >
            Присоединиться
          </button>
        </div>
      </div>
    </div>
  );
}