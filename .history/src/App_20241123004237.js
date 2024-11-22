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
  // ... keeping all state and functions exactly the same ...

  const TextWithLetters = ({ text }) => {
    if (!text) return null;
    
    const words = text.split(' ');
    
    return (
      <div className="space-x-4" dir="rtl">
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            onClick={(e) => speakText(word, e)}
            className="inline-block cursor-pointer hover:text-[#8A6E3E] transition-colors"
          >
            {word.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                onClick={(e) => speakText(letter, e)}
                className="inline-block hover:text-[#D4B46A] transition-colors text-5xl"
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
      <div className={`mb-16 bg-[#FBF6E9] rounded-2xl shadow-lg overflow-hidden
        ${isActive ? 'ring-2 ring-[#D4B46A]' : ''}`}>
        <div className="max-w-3xl mx-auto">
          <div className="border-b-2 border-[#D4B46A] bg-[#F5ECD8] px-8 py-4">
            <h3 className="text-2xl font-serif text-[#5C4B2A]">{stage.name || 'Unnamed Stage'}</h3>
            {stage.instruction && (
              <p className="text-[#8A6E3E] text-sm mt-2 italic">{stage.instruction}</p>
            )}
          </div>

          <div className="p-8">
            <div className="mb-8 bg-[#FFFDFA] rounded-xl p-8 shadow-inner border border-[#D4B46A]">
              <div className="text-center mb-8">
                <TextWithLetters text={stage.arabic} />
              </div>

              {stage.transliteration && (
                <p className="text-[#8A6E3E] text-xl mb-4 font-serif text-center border-t-2 border-[#D4B46A] pt-6">
                  {stage.transliteration}
                </p>
              )}
              
              <p className="text-[#5C4B2A] text-lg leading-relaxed font-serif text-center">
                {stage.english || 'Translation not available'}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={(e) => speakText(stage.arabic, e)}
                className="px-6 py-3 bg-[#8A6E3E] text-[#FBF6E9] rounded-md 
                  hover:bg-[#725B33] transition-colors flex items-center gap-2 text-lg shadow-md"
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

  if (!prayer) {
    return <FileLoader onFileLoaded={handleFileLoaded} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDFA] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 bg-[#FBF6E9] rounded-2xl shadow-lg py-12 px-8 
          border-2 border-[#D4B46A]">
          <h1 className="text-6xl font-bold mb-6 text-[#5C4B2A]" dir="rtl">
            {prayer.name?.arabic || 'صلاة'}
          </h1>
          <h2 className="text-2xl text-[#8A6E3E] font-serif mb-8">
            {prayer.name?.english || 'Prayer'}
          </h2>
          
          <button
            onClick={() => setPrayer(null)}
            className="px-8 py-3 bg-[#8A6E3E] text-[#FBF6E9] rounded-md 
              hover:bg-[#725B33] transition-colors text-lg shadow-md"
          >
            Load Different Prayer
          </button>
        </div>

        <div className="space-y-12">
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