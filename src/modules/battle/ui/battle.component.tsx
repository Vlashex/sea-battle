import { useParams } from 'react-router-dom';
import { useBattleModel } from '../model/battle.model';
import { gameApiAdapter } from '../../../shared/api/implementations/game-api.adapter';
import { battleService } from '../../../core/services/battle.service';

// const SIZE = 10;

export function Battle() {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const model = useBattleModel(gameApiAdapter, battleService);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Бой</h1>
      <p className="mb-2 text-gray-300">Сессия: {sessionKey}</p>
      {model.playerId && (
        <p className="mb-2 text-gray-300">
          Вы: {model.playerId} | Сейчас ходит: {model.currentPlayer}
          {model.playerId === model.currentPlayer && (
            <span className="text-green-400 ml-2">(Ваш ход)</span>
          )}
        </p>
      )}

      <div className="grid grid-cols-10 gap-1 bg-sky-900 p-2 rounded-xl mb-4">
        {model.board.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => model.handleClick(x, y)}
              disabled={!!cell || !!model.loadingCell || !model.canMove || model.playerId !== model.currentPlayer}
              className={`w-10 h-10 rounded transition flex items-center justify-center ${
                model.getCellColor(cell)
              } ${
                !!cell || model.loadingCell || !model.canMove || model.playerId !== model.currentPlayer
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-300'
              }`}
              title={
                model.playerId !== model.currentPlayer 
                  ? `Сейчас ходит ${model.currentPlayer}` 
                  : cell ? 'Уже стреляли сюда' : 'Сделать выстрел'
              }
            >
              {model.getCellDisplay(cell, x, y)}
            </button>
          ))
        )}
      </div>

      {model.status && (
        <div className={`text-center px-4 py-2 rounded-lg mb-4 ${
          model.status.includes('Ошибка') 
            ? 'bg-red-800 text-white' 
            : model.status.includes('Ранен') || model.status.includes('уничтожен')
            ? 'bg-green-800 text-white'
            : 'bg-sky-800 text-gray-300'
        }`}>
          <p className="font-semibold">{model.status}</p>
          {model.playerId === model.currentPlayer && model.canMove && (
            <p className="text-sm mt-1">Кликните по клетке для выстрела</p>
          )}
        </div>
      )}

      {!model.canMove && (
        <p className="text-yellow-300">Обработка хода...</p>
      )}
    </div>
  );
}