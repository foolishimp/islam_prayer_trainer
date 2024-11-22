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
    <div className="text-center p-4">
      <label className="block mb-4">
        <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
          Choose Prayer File
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
        <pre className="text-left inline-block bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-w-full">
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

  const handleFileLoaded = (data) => {
    setPrayer(data);
  };

  const speakText = (text) => {
    if (utterance && !isPlaying) {
      const synth = window.speechSynthesis;
      synth.cancel();
      utterance.text = text;
      synth.speak(utterance);
    }
  };

  const PrayerStage = ({ stage, index }) => {
    const isActive = currentStage === index;

    return (
      <div className={`prayer-stage mb-6 p-6 bg-white rounded-lg shadow ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="stage-header border-b pb-4 mb-4">
          <h3 className="text-xl font-bold">{stage.name}</h3>
          {stage.instruction && (
            <p className="text-gray-600 text-sm mt-2 italic">{stage.instruction}</p>
          )}
        </div>

        <div className="text-right mb-4">
          <p className="arabic-text text-2xl leading-loose" dir="rtl" onClick={() => speakText(stage.arabic)}>
            {stage.arabic}
          </p>
        </div>

        {stage.transliteration && (
          <p className="text-gray-600 mb-2">{stage.transliteration}</p>
        )}
        
        <p className="text-gray-800">{stage.english}</p>

        <button
          onClick={() => speakText(stage.arabic)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          🔊 Play
        </button>
      </div>
    );
  };

  if (!prayer) {
    return <FileLoader onFileLoaded={handleFileLoaded} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" dir="rtl">
          {prayer.name?.arabic || 'صلاة'}
        </h1>
        <h2 className="text-xl">
          {prayer.name?.english || 'Prayer'}
        </h2>
      </div>

      {/* Load Different File Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setPrayer(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Load Different Prayer
        </button>
      </div>

      {/* Prayer Stages */}
      <div className="space-y-6">
        {prayer.stages?.map((stage, index) => (
          <PrayerStage 
            key={index}
            stage={stage}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default QuranReader;