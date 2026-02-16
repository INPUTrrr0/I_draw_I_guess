import { useGame } from '../context/GameContext';
import LandingScreen from './LandingScreen';
import GamePhase from './GamePhase';
import RecallPhase from './RecallPhase';
import ResultsPhase from './ResultsPhase';

const GameContainer = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen">
      {state.phase === 'landing' && <LandingScreen />}
      {state.phase === 'game' && <GamePhase />}
      {state.phase === 'recall' && <RecallPhase />}
      {state.phase === 'results' && <ResultsPhase />}
    </div>
  );
};

export default GameContainer;
