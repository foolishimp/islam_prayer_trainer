# Arabic Learning Tools

A React-based web application for learning Arabic letters through interactive flashcards and Quran/prayer text reading.

## Features

### Flashcards
- Learn all 28 Arabic letters with their names and sounds
- Multiple learning modes:
  - Letter to Name: See the Arabic letter, choose the correct name
  - Letter to Sound: See the Arabic letter, choose the correct sound
  - Name/Sound to Letter: See the name and sound, choose the correct Arabic letter
- Customizable difficulty with 4, 8, or all options
- Audio pronunciation support (using browser's speech synthesis)
- Progress and score tracking
- Visual feedback for correct/incorrect answers

### Quran/Prayer Reader
- Load and read Arabic prayers or Quran passages from JSON files
- Interactive text with clickable words and letters for pronunciation
- English translations and transliterations support
- Audio pronunciation for individual letters, words, or full passages
- Stage-by-stage prayer learning

## Installation

1. Make sure you have Node.js and npm installed on your system
   ```bash
   node --version
   npm --version
   ```

2. Clone this repository
   ```bash
   git clone <repository-url>
   cd arabic-learning-tools
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm start
   ```

The application will open in your default browser at `http://localhost:3000`

## Usage

### Flashcards

1. Click "Arabic Letters Flashcards" from the main menu
2. Choose your preferred learning mode:
   - Letter to Name
   - Letter to Sound
   - Name/Sound to Letter
3. Select the number of options you want to see (4, 8, or all)
4. Click the speaker icon (🔊) to hear the pronunciation
5. Select your answer from the options provided
6. Click "Next" to move to the next card
7. View your score at the end and restart if desired

### Quran/Prayer Reader

1. Click "Quran Reader" from the main menu
2. Prepare a JSON file in the following format:
   ```json
   {
     "name": {
       "arabic": "Prayer Name in Arabic",
       "english": "Prayer Name in English"
     },
     "stages": [
       {
         "name": "Stage Name",
         "arabic": "Arabic Text",
         "english": "English Translation",
         "instruction": "Optional instruction for this stage",
         "transliteration": "Optional transliteration"
       }
     ]
   }
   ```
3. Click "Choose Prayer File" and select your JSON file
4. Navigate through the prayer stages
5. Click on individual letters or words to hear their pronunciation
6. Use the "Play Full Text" button to hear the entire passage

## Browser Support

The application works best in modern browsers with Web Speech API support:
- Chrome (recommended)
- Edge
- Safari
- Firefox

Note: Arabic voice support may vary by browser and operating system.

## JSON File Example

Here's a sample prayer file structure:
```json
{
  "name": {
    "arabic": "التشهد",
    "english": "At-Tahiyyat"
  },
  "stages": [
    {
      "name": "Opening",
      "arabic": "التَّحِيَّاتُ لِلَّهِ",
      "english": "All greetings belong to Allah",
      "instruction": "Recite while sitting",
      "transliteration": "At-tahiyyatu lillahi"
    }
  ]
}
```

## Development

The project structure is organized as follows:
```
src/
  ├── App.js            # Main application component
  ├── App.css           # Main styles
  ├── FlashCards.js     # Flashcard component
  ├── QuranReader.js    # Quran reader component
  ├── QuranReader.css   # Quran reader styles
  └── index.js          # Application entry point
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

[MIT License](LICENSE)