import { useParams } from 'react-router-dom';
import { usePlacementModel } from '../model/placement.model';
import { placementService } from '../../../shared/di/dependencies';import { gameApiAdapter } from '../../../shared/api/implementations/game-api.adapter';

// const SIZE = 10;

export function Placement() {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const model = usePlacementModel(placementService, gameApiAdapter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Расставь свои корабли</h1>
      <p className="mb-2 text-gray-300">Сессия: {sessionKey}</p>

      <div className="grid grid-cols-10 gap-1 bg-sky-900 p-2 rounded-xl mb-4">
        {model.grid.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => model.toggleCell(x, y)}
              disabled={model.loading}
              className={`w-10 h-10 rounded transition-colors ${
                cell 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${model.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          ))
        )}
      </div>

      <button
        onClick={model.handleSubmit}
        disabled={model.loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-2 px-6 rounded font-semibold transition-colors"
      >
        {model.loading ? 'Отправка...' : 'Готово'}
      </button>
    </div>
  );
}