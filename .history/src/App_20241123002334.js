import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const FileLoader = ({ onFileLoaded }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Check if it's a JSON file
    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Validate the required structure
        if (!data.verses || !Array.isArray(data.verses)) {
          setError('Invalid file format. File must contain a verses array.');
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
    <div className="text-center p-4">
      <label className="block mb-4">
        <span className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
          Choose Surah File
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </span>
      </label>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 text-gray-600">
        <p className="mb-2">Expected JSON format:</p>
        <pre className="text-left inline-block bg-gray-100 p-4 rounded-lg text-sm">
{`{
  "name": {
    "arabic": "سورة ...",
    "english": "Surah ..."
  },
  "verses": [
    {
      "number": 1,
      "arabic": "...",
      "english": "..."
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

const QuranReader = () => {
  const [surah, setSurah] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);

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

  const handleFileLoaded = (data) => {
    setSurah(data);
  };

  const speakText = (text) => {
    if (utterance && !isPlaying) {
      const synth = window.speechSynthesis;
      synth.cancel();
      utterance.text = text;
      synth.speak(utterance);
    }
  };

  const speakWord = (word) => {
    if (!isPlaying) {
      speakText(word.arabic || word);
    }
  };

  const speakLetter = (letter, e) => {
    if (!isPlaying) {
      e.stopPropagation();
      speakText(letter);
    }
  };

  const speakVerse = (verse) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentVerse(verse.number);
    
    // Handle both word object format and simple string format
    const words = verse.words || verse.arabic.split(' ');
    let currentIndex = 0;

    const speakNextWord = () => {
      if (currentIndex < words.length && isPlaying) {
        const wordText = typeof words[currentIndex] === 'object' 
          ? words[currentIndex].arabic 
          : words[currentIndex];
        speakText(wordText);
        currentIndex++;
        setTimeout(speakNextWord, 1000);
      } else {
        setIsPlaying(false);
        setCurrentVerse(null);
      }
    };

    speakNextWord();
  };

  const stopPlaying = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentVerse(null);
  };

  // If no surah is loaded, show the file loader
  if (!surah) {
    return <FileLoader onFileLoaded={handleFileLoaded} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* File reload button */}
      <div className="text-center mb-4">
        <button
          onClick={() => setSurah(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Load Different Surah
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" dir="rtl">
          {surah.name?.arabic || 'سورة'}
        </h1>
        <h2 className="text-xl">
          {surah.name?.english || 'Surah'}
        </h2>
        {surah.revelationType && (
          <p className="text-gray-600 mt-2">{surah.revelationType}</p>
        )}
      </div>

      {surah.verses?.map((verse) => (
        <Card 
          key={verse.number} 
          className={`mb-6 p-6 ${currentVerse === verse.number ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="text-right mb-4">
            <p className="text-2xl leading-loose arabic-text" dir="rtl">
              {verse.words?.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  onClick={() => speakWord(word)}
                  className="cursor-pointer hover:text-blue-600 mx-1"
                >
                  {word.arabic.split('').map((letter, letterIndex) => (
                    <span
                      key={letterIndex}
                      onClick={(e) => speakLetter(letter, e)}
                      className="hover:text-green-600"
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              )) || verse.arabic.split(' ').map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  onClick={() => speakWord(word)}
                  className="cursor-pointer hover:text-blue-600 mx-1"
                >
                  {word.split('').map((letter, letterIndex) => (
                    <span
                      key={letterIndex}
                      onClick={(e) => speakLetter(letter, e)}
                      className="hover:text-green-600"
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-gray-600">{verse.english}</p>
              {verse.transliteration && (
                <p className="text-gray-400 text-sm mt-1">{verse.transliteration}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => isPlaying ? stopPlaying() : speakVerse(verse)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentVerse === verse.number
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {currentVerse === verse.number ? '⏹ Stop' : '🔊 Play'}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuranReader;