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
    <div className="max-w-xl mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
      <label className="block mb-4">
        <span className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-lg">
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
      <div className="mt-8 text-gray-600">
        <p className="mb-2 text-lg">Expected JSON format:</p>
        <pre className="text-left inline-block bg-gray-50 p-6 rounded-lg text-sm overflow-auto max-w-full shadow-inner">
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

  Uncaught runtime errors:
  ×
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:9900:18)
      at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:9944:20)
      at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:10001:35)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29899:11)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
  ERROR
  Cannot read properties of undefined (reading 'split')
  TypeError: Cannot read properties of undefined (reading 'split')
      at TextWithLetters (http://localhost:3000/static/js/bundle.js:172:24)
      at renderWithHooks (http://localhost:3000/static/js/bundle.js:19644:22)
      at mountIndeterminateComponent (http://localhost:3000/static/js/bundle.js:23615:17)
      at beginWork (http://localhost:3000/static/js/bundle.js:24918:20)
      at beginWork$1 (http://localhost:3000/static/js/bundle.js:29877:18)
      at performUnitOfWork (http://localhost:3000/static/js/bundle.js:29147:16)
      at workLoopSync (http://localhost:3000/static/js/bundle.js:29070:9)
      at renderRootSync (http://localhost:3000/static/js/bundle.js:29043:11)
      at recoverFromConcurrentError (http://localhost:3000/static/js/bundle.js:28535:24)
      at performConcurrentWorkOnRoot (http://localhost:3000/static/js/bundle.js:28448:26)

  const PrayerStage = ({ stage, index }) => {
    const isActive = currentStage === index;

    return (
      <div className={`mb-12 px-8 py-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow
        ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">{stage.name}</h3>
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
              {stage.english}
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
    setPrayer(data);
  };

  if (!prayer) {
    return <FileLoader onFileLoaded={handleFileLoaded} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 bg-white rounded-xl shadow-md py-8 px-4">
          <h1 className="text-5xl font-bold mb-4" dir="rtl">
            {prayer.name?.arabic || 'صلاة'}
          </h1>
          <h2 className="text-2xl text-gray-600">
            {prayer.name?.english || 'Prayer'}
          </h2>
          
          {/* Load Different File Button */}
          <button
            onClick={() => setPrayer(null)}
            className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg 
              hover:bg-gray-600 transition-colors text-lg"
          >
            Load Different Prayer
          </button>
        </div>

        {/* Prayer Stages */}
        <div className="space-y-8">
          {prayer.stages?.map((stage, index) => (
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