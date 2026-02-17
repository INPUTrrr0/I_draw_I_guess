import { GameProvider } from './context/GameContext'
import { LanguageProvider } from './context/LanguageContext'
import GameContainer from './components/GameContainer'

function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <GameContainer />
      </GameProvider>
    </LanguageProvider>
  )
}

export default App
