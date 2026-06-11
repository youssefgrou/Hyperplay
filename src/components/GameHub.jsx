import React, { useState } from 'react';
import LandingPage from './LandingPage';
import TranslateGame from './TranslateGame';
import ChoosingGame from './ChoosingGame';

export default function GameHub() {
  const [activeScreen, setActiveScreen] = useState('landing'); // 'landing' | 'translate' | 'trivia'

  return (
    <div style={styles.hubWrapper}>
      {activeScreen === 'landing' && (
        <LandingPage onSelectGame={(gameMode) => setActiveScreen(gameMode)} />
      )}
      {activeScreen === 'translate' && (
        <TranslateGame onBack={() => setActiveScreen('landing')} />
      )}
      {activeScreen === 'trivia' && (
        <ChoosingGame onBack={() => setActiveScreen('landing')} />
      )}
    </div>
  );
}

const styles = {
  hubWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  }
};
