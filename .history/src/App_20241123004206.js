import React, { useState, useEffect } from 'react';

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
    <div className="max-w-3xl mx-auto bg-[#FBF6E9] border-2 border-[#D4B46A] rounded-lg p-12 text-center shadow-xl">
      <label className="block mb-6">
        <span className="inline-block px-8 py-4 bg-[#8A6E3E] text-[#FBF6E9] rounded-md cursor-pointer 
          hover:bg-[#725B33] transition-colors text-xl shadow-md">
          Choose Prayer File
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </span>
      </label>
      {error && <p className="text-red-700 mt-4">{error}</p>}
      <div className="mt-10 text-[#5C4B2A]">
        <p className="mb-4 text-lg font-serif">Expected JSON format:</p>
        <pre className="text-left inline-block bg-[#FFFDFA] p-8 rounded-md text-sm overflow-auto 
          max-w-full shadow-inner border border-[#D4B46A] font-mono">
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
      <div className="space-x-3" dir="rtl">
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            onClick={(e) => speakText(word, e)}
            className="inline-block cursor-pointer hover:text-blue-600 transition-colors"
          >
            {word.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                onClick={(e) => speakText(letter, e)}
                className="inline-block hover:text-green-600 transition-colors text-4xl"
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
      <div className={`mb-12 px-8 py-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow
        ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">{stage.name || 'Unnamed Stage'}</h3>
            {stage.instruction && (
              <p className="text-gray-600 text-sm mt-2 italic">{stage.instruction}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-right mb-6">
              <TextWithLetters text={stage.arabic} />
            </div>

            {stage.transliteration && (
              <p className="text-gray-600 text-lg mb-4 font-serif">
                {stage.transliteration}
              </p>
            )}
            
            <p className="text-gray-800 text-lg leading-relaxed font-serif">
              {stage.english || 'Translation not available'}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={(e) => speakText(stage.arabic, e)}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors flex items-center gap-2 text-lg"
            >
              <span>🔊</span>
              Play Full Text
            </button>
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 bg-white rounded-xl shadow-md py-8 px-4">
          <h1 className="text-5xl font-bold mb-4" dir="rtl">
            {prayer.name?.arabic || 'صلاة'}
          </h1>
          <h2 className="text-2xl text-gray-600">
            {prayer.name?.english || 'Prayer'}
          </h2>
          
          <button
            onClick={() => setPrayer(null)}
            className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg 
              hover:bg-gray-600 transition-colors text-lg"
          >
            Load Different Prayer
          </button>
        </div>

        <div className="space-y-8">
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