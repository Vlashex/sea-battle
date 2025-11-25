import { gameApiAdapter } from '../../../shared/api/implementations/game-api.adapter';
import { useParams } from 'react-router-dom';
import { useBattleModel } from '../model/battle.model';
import { battleService } from '../../../shared/di/dependencies';

// ... остальной код без изменений


// const SIZE = 10;

export function Battle() {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const model = useBattleModel(gameApiAdapter, battleService);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Бой</h1>
      <p className="mb-2 text-gray-300">Сессия: {sessionKey}</p>

      <div className="grid grid-cols-10 gap-1 bg-sky-900 p-2 rounded-xl mb-4">
        {model.board.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => model.handleClick(x, y)}
              disabled={!!cell || !!model.loadingCell}
              className={`w-10 h-10 rounded transition flex items-center justify-center ${
                model.getCellColor(cell)
              } ${!!cell || model.loadingCell ? '' : 'cursor-pointer'}`}
            >
              {model.getCellDisplay(cell, x, y)}
            </button>
          ))
        )}
      </div>

      {model.status && (
        <p className="text-gray-300 bg-sky-800 px-4 py-2 rounded-lg">
          {model.status}
        </p>
      )}
    </div>
  );
}