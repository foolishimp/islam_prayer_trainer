import React, { useState } from 'react';
import './App.css';
import QuranReader from './QuranReader';
import FlashCards from './FlashCards';  // We'll move the flashcard code here

function App() {
  const [currentApp, setCurrentApp] = useState(null);

  if (currentApp === 'flashcards') {
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => setCurrentApp(null)}>
          ← Back to Menu
        </button>
        <FlashCards />
      </div>
    );
  }

  if (currentApp === 'quran') {
    return (
      <div className="app-container">
        <button className="back-button" onClick={() => setCurrentApp(null)}>
          ← Back to Menu
        </button>
        <QuranReader />
      </div>
    );
  }

  return (
    <div className="app-menu">
      <h1 className="menu-title">Arabic Learning Tools</h1>
      <div className="menu-buttons">
        <button 
          className="menu-button"
          onClick={() => setCurrentApp('flashcards')}
        >
          Arabic Letters Flashcards
        </button>
        <button 
          className="menu-button"
          onClick={() => setCurrentApp('quran')}
        >
          Quran Reader
        </button>
      </div>
    </div>
  );
}

export default App;