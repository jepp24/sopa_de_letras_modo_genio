// gameLevels.js

const airlinesDictionary = [
    "AVIANCA", "LATAM", "IBERIA", "EMIRATES", "LUFTHANSA",
    "RYANAIR", "EASYJET", "QANTAS", "DELTA", "UNITED",
    "AMERICAN", "AIRFRANCE", "KLM", "QATAR", "COPA",
    "AEROMEXICO", "VOLARIS", "VIVA", "BRITISH", "JAPAN"
];

const animalsAndOthersDictionary = [
    // Animales
    "TIGRE", "LEON", "ELEFANTE", "JIRAFA", "CANGURO", "PINGUINO",
    "COCODRILO", "MURCIELAGO", "RINOCERONTE", "HIPOPOTAMO", "CHIMPANCE",
    // Otras tematicas (Espacio, Computacion)
    "ASTRONAUTA", "PLANETA", "GALAXIA", "METEORITO",
    "COMPUTADORA", "INTERNET", "PROGRAMA", "TECLADO"
];

function getRandomWords(dictionary, count, lengthMax = 20) {
    const validWords = dictionary.filter(w => w.length <= lengthMax);
    const shuffled = validWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function getLevelConfig(levelNumber) {
    let gridSize = 6;
    let wordCount = 3;
    let timeSeconds = 60;
    let allowDiagonals = false;
    let allowReverse = false;
    let words = [];

    if (levelNumber <= 10) {
        // Airlines Phase
        if (levelNumber <= 3) {
            gridSize = 6 + levelNumber; // 7, 8, 9
            wordCount = 3 + levelNumber; // 4, 5, 6
            timeSeconds = 60 - (levelNumber * 5); 
            allowDiagonals = levelNumber >= 2;
        } else {
            gridSize = Math.min(14, 9 + Math.floor((levelNumber - 3) / 2));
            wordCount = 6 + (levelNumber - 3);
            timeSeconds = Math.max(30, 60 - (levelNumber * 3));
            allowDiagonals = true;
            allowReverse = levelNumber >= 5;
        }
        words = getRandomWords(airlinesDictionary, wordCount, gridSize);
    } else {
        // Advanced Phase (11+)
        gridSize = 16;
        wordCount = Math.min(15, 10 + Math.floor((levelNumber - 10) / 2));
        timeSeconds = 45; // Fixed 45 seconds explicitly as requested
        allowDiagonals = true;
        allowReverse = true;
        words = getRandomWords(animalsAndOthersDictionary, wordCount, 16);
    }

    return {
        level: levelNumber,
        gridSize,
        wordCount,
        timeSeconds,
        allowDiagonals,
        allowReverse,
        words
    };
}
