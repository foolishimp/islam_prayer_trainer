import React, { useState, useEffect } from 'react';
import './QuranReader.css';

const FileLoader = ({ onFileLoaded }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError(null);

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.stages || !Array.isArray(data.stages)) {
          setError('Invalid file format. File must contain a stages array.');
          return;
        }
        onFileLoaded(data);
      } catch (err) {
        setError('Error parsing JSON file. Please check the file format.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-loader">
      <label className="file-label">
        <span className="file-button">
          Choose Prayer File
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden-input"
          />
        </span>
      </label>
      {error && <p className="error-message">{error}</p>}
      <div className="format-info">
        <p className="format-title">Expected JSON format:</p>
        <pre className="format-example">
{`{
  "name": {
    "arabic": "...",
    "english": "..."
  },
  "stages": [
    {
      "name": "Stage Name",
      "arabic": "...",
      "english": "...",
      "instruction": "..."
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

const QuranReader = () => {
  const [prayer, setPrayer] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);

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
      setIsPlaying(false);
    };
  }, []);

  const speakText = (text, e) => {
    if (!text) return;
    
    if (e) {
      e.stopPropagation();
    }
    if (utterance && !isPlaying) {
      const synth = window.speechSynthesis;
      synth.cancel();
      utterance.text = text;
      synth.speak(utterance);
    }
  };

  const TextWithLetters = ({ text }) => {
    if (!text) return null;
    
    const words = text.split(' ');
    
    return (
      <div className="arabic-text" dir="rtl">
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            onClick={(e) => speakText(word, e)}
            className="word"
          >
            {word.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                onClick={(e) => speakText(letter, e)}
                className="letter"
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </div>
    );
  };

  const PrayerStage = ({ stage, index }) => {
    if (!stage || !stage.arabic) return null;
    
    const isActive = currentStage === index;

    return (
      <div className={`prayer-stage ${isActive ? 'active' : ''}`}>
        <div className="stage-container">
          <div className="stage-header">
            <h3 className="stage-title">{stage.name || 'Unnamed Stage'}</h3>
            {stage.instruction && (
              <p className="stage-instruction">{stage.instruction}</p>
            )}
          </div>

          <div className="stage-content">
            <div className="text-container">
              <div className="arabic-container">
                <TextWithLetters text={stage.arabic} />
              </div>

              {stage.transliteration && (
                <p className="transliteration">
                  {stage.transliteration}
                </p>
              )}
              
              <p className="english-translation">
                {stage.english || 'Translation not available'}
              </p>
            </div>

            <div className="button-container">
              <button
                onClick={(e) => speakText(stage.arabic, e)}
                className="play-button"
              >
                <span>🔊</span>
                Play Full Text
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleFileLoaded = (data) => {
    if (!data || !data.stages || !Array.isArray(data.stages)) {
      console.error('Invalid prayer data format');
      return;
    }
    setPrayer(data);
  };

  if (!prayer) {
    return <FileLoader onFileLoaded={handleFileLoaded} />;
  }

  return (
    <div className="quran-reader">
      <div className="container">
        <div className="prayer-header">
          <h1 className="arabic-title" dir="rtl">
            {prayer.name?.arabic || 'صلاة'}
          </h1>
          <h2 className="english-title">
            {prayer.name?.english || 'Prayer'}
          </h2>
          
          <button
            onClick={() => setPrayer(null)}
            className="load-button"
          >
            Load Different Prayer
          </button>
        </div>

        <div className="stages-container">
          {prayer.stages?.filter(stage => stage && stage.arabic).map((stage, index) => (
            <PrayerStage 
              key={index}
              stage={stage}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuranReader;