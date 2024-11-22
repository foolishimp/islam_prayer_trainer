import React, { useState, useEffect } from 'react';

const letters = [
  { arabic: "ا", name: "Alif", sound: "aa" },
  { arabic: "ب", name: "Ba", sound: "b" },
  { arabic: "ت", name: "Ta", sound: "t" },
  { arabic: "ث", name: "Tha", sound: "th" },
  { arabic: "ج", name: "Jeem", sound: "j" },
  { arabic: "ح", name: "Ha", sound: "ḥ" },
  { arabic: "خ", name: "Kha", sound: "kh" },
  { arabic: "د", name: "Dal", sound: "d" },
  { arabic: "ذ", name: "Dhal", sound: "dh" },
  { arabic: "ر", name: "Ra", sound: "r" },
  { arabic: "ز", name: "Zay", sound: "z" },
  { arabic: "س", name: "Seen", sound: "s" },
  { arabic: "ش", name: "Sheen", sound: "sh" },
  { arabic: "ص", name: "Saad", sound: "ṣ" },
  { arabic: "ض", name: "Daad", sound: "ḍ" },
  { arabic: "ط", name: "Taa", sound: "ṭ" },
  { arabic: "ظ", name: "Zaa", sound: "ẓ" },
  { arabic: "ع", name: "Ayn", sound: "ʿ" },
  { arabic: "غ", name: "Ghayn", sound: "gh" },
  { arabic: "ف", name: "Fa", sound: "f" },
  { arabic: "ق", name: "Qaf", sound: "q" },
  { arabic: "ك", name: "Kaf", sound: "k" },
  { arabic: "ل", name: "Lam", sound: "l" },
  { arabic: "م", name: "Meem", sound: "m" },
  { arabic: "ن", name: "Noon", sound: "n" },
  { arabic: "ه", name: "Ha", sound: "h" },
  { arabic: "و", name: "Waw", sound: "w/oo" },
  { arabic: "ي", name: "Ya", sound: "y/ee" },
];

const FlashCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState('letter'); // 'letter', 'sound', or 'reverse'
  const [optionsCount, setOptionsCount] = useState(4);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    u.lang = 'ar-SA';
    u.rate = 0.8;
    u.pitch = 1;

    synth.addEventListener('voiceschanged', () => {
      const voices = synth.getVoices();
      const arabicVoice = voices.find(voice => voice.lang.includes('ar'));
      if (arabicVoice) {
        u.voice = arabicVoice;
      }
    });

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, []);

  useEffect(() => {
    generateOptions();
  }, [currentIndex, optionsCount, mode]);

  const generateOptions = () => {
    const currentLetter = letters[currentIndex];
    let optionsArray;

    if (mode === 'reverse') {
      optionsArray = letters.map(l => l.arabic);
      const correctAnswer = currentLetter.arabic;
      if (optionsCount !== -1) {
        // Filter out the correct answer and shuffle remaining options
        const otherOptions = optionsArray.filter(opt => opt !== correctAnswer);
        const shuffled = otherOptions.sort(() => Math.random() - 0.5);
        // Take n-1 options and add back the correct answer
        optionsArray = [...shuffled.slice(0, optionsCount - 1), correctAnswer];
      }
    } else {
      const correctAnswer = mode === 'letter' ? currentLetter.name : currentLetter.sound;
      if (optionsCount === -1) {
        optionsArray = letters.map(l => mode === 'letter' ? l.name : l.sound);
      } else {
        const options = new Set([correctAnswer]);
        while (options.size < optionsCount) {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          options.add(mode === 'letter' ? randomLetter.name : randomLetter.sound);
        }
        optionsArray = Array.from(options);
      }
    }

    setCurrentOptions(optionsArray.sort());
  };

  const speakText = (text) => {
    if (utterance) {
      const synth = window.speechSynthesis;
      synth.cancel();
      utterance.text = text;
      synth.speak(utterance);
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const currentLetter = letters[currentIndex];
    let isCorrect;
    
    if (mode === 'reverse') {
      isCorrect = option === currentLetter.arabic;
    } else {
      isCorrect = option === (mode === 'letter' ? currentLetter.name : currentLetter.sound);
    }
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < letters.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleOptionsCountChange = (count) => {
    setOptionsCount(count);
    setSelectedOption(null);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
  };

  const currentLetter = letters[currentIndex];

  if (showResult) {
    return (
      <div className="App">
        <div className="result">
          <h1>Flashcards Completed!</h1>
          <p>Your score: {score} / {letters.length}</p>
          <button 
            className="next-button" 
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Arabic Flashcards</h1>
      
      <div className="options-selector">
        <label>
          <input
            type="radio"
            value="letter"
            checked={mode === 'letter'}
            onChange={(e) => handleModeChange('letter')}
          />
          Letter to Name
        </label>
        <label>
          <input
            type="radio"
            value="sound"
            checked={mode === 'sound'}
            onChange={(e) => handleModeChange('sound')}
          />
          Letter to Sound
        </label>
        <label>
          <input
            type="radio"
            value="reverse"
            checked={mode === 'reverse'}
            onChange={(e) => handleModeChange('reverse')}
          />
          Name/Sound to Letter
        </label>
      </div>

      <div className="options-selector">
        <label>
          <input
            type="radio"
            value="4"
            checked={optionsCount === 4}
            onChange={() => handleOptionsCountChange(4)}
          />
          4 Options
        </label>
        <label>
          <input
            type="radio"
            value="8"
            checked={optionsCount === 8}
            onChange={() => handleOptionsCountChange(8)}
          />
          8 Options
        </label>
        <label>
          <input
            type="radio"
            value="-1"
            checked={optionsCount === -1}
            onChange={() => handleOptionsCountChange(-1)}
          />
          All Options
        </label>
      </div>

      <div className="flashcard">
        {mode === 'reverse' ? (
          <div className="sound-hint">
            Find the letter for "{currentLetter.name}" ({currentLetter.sound})
            <button
              className="sound-button"
              onClick={() => speakText(currentLetter.arabic)}
              title="Play Sound"
            >
              🔊
            </button>
          </div>
        ) : (
          <div className="arabic-letter">
            {currentLetter.arabic}
            <button 
              className="sound-button" 
              onClick={() => speakText(currentLetter.arabic)}
              title="Play Sound"
            >
              🔊
            </button>
            {selectedOption && mode === 'letter' && (
              <div className="sound-hint">
                ({currentLetter.sound})
              </div>
            )}
          </div>
        )}

        <div className={`options ${optionsCount === -1 ? 'all-options' : ''}`}>
          {currentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={
                selectedOption !== null
                  ? (mode === 'reverse' 
                      ? option === currentLetter.arabic
                      : option === (mode === 'letter' ? currentLetter.name : currentLetter.sound))
                    ? "correct"
                    : option === selectedOption
                    ? "incorrect"
                    : ""
                  : ""
              }
              disabled={selectedOption !== null}
            >
              {option}
              {selectedOption !== null && 
               mode === 'letter' &&
               option === currentLetter.name && (
                <span className="sound-hint-button">
                  ({currentLetter.sound})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="progress">
        <p>Card {currentIndex + 1} of {letters.length}</p>
        <p>Score: {score} / {currentIndex + (selectedOption ? 1 : 0)}</p>
        {selectedOption !== null && (
          <button 
            className="next-button" 
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashCards;