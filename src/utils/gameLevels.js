// gameLevels.js

const allWordsDictionary = [
    // Aerolíneas
    "AVIANCA", "LATAM", "IBERIA", "EMIRATES", "LUFTHANSA",
    "RYANAIR", "EASYJET", "QANTAS", "DELTA", "UNITED",
    "AMERICAN", "AIRFRANCE", "KLM", "QATAR", "COPA",
    "AEROMEXICO", "VOLARIS", "VIVA", "BRITISH", "JAPAN",
    // Animales
    "TIGRE", "LEON", "ELEFANTE", "JIRAFA", "CANGURO", "PINGUINO",
    "COCODRILO", "MURCIELAGO", "RINOCERONTE", "HIPOPOTAMO", "CHIMPANCE",
    "SERPIENTE", "AGUILA", "TORTUGA", "DELFIN", "BALLENA", "TIBURON",
    "CEBRA", "PANDA", "LOBO", "ZORRO", "CABALLO", "PERRO", "GATO",
    // Espacio
    "ASTRONAUTA", "PLANETA", "GALAXIA", "METEORITO", "ESTRELLA", 
    "COMETA", "ORBITA", "TELESCOPIO", "UNIVERSO", "NEBULOSA", 
    "COSMOS", "GRAVEDAD", "COHETE", "SATELITE", "MARTE", "JUPITER",
    // Tecnología
    "COMPUTADORA", "INTERNET", "PROGRAMA", "TECLADO", "PANTALLA", 
    "SISTEMA", "SOFTWARE", "HARDWARE", "ALGORITMO", "DATOS", 
    "ARCHIVO", "CARPETA", "SERVIDOR", "CODIGO", "NUBE", "ROBOT",
    // Música
    "GUITARRA", "PIANO", "BATERIA", "VIOLIN", "ORQUESTA", "SONIDO",
    "MELODIA", "RITMO", "FLAUTA", "TROMPETA", "CANTANTE", "CONCIERTO",
    // Geografía
    "CIUDAD", "MONTAÑA", "BOSQUE", "DESIERTO", "OCEANO", "RIVER",
    "VALLE", "VOLCAN", "ISLA", "CONTINENTE", "SELVA", "PRADERA",
    // Frutas y Comida
    "MANZANA", "PLATANO", "NARANJA", "UVA", "FRESA", "PIÑA",
    "LIMON", "SANDIA", "TOMATE", "PATATA", "ARROZ", "PASTA",
    // Colores
    "AMARILLO", "AZUL", "ROJO", "VERDE", "BLANCO", "NEGRO",
    "MORADO", "NARANJA", "ROSADO", "GRIS", "CELESTE", "MARRON",
    // Deportes
    "FUTBOL", "BASKET", "TENIS", "NATACION", "BOXEO", "CICLISMO",
    "CORRER", "SALTAR", "ESTADIO", "EQUIPO", "PELOTA", "ATLETA"
];


function getRandomWords(dictionary, count, lengthMax = 20) {
    const validWords = dictionary.filter(w => w.length <= lengthMax);
    const shuffled = [...validWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function getLevelConfig(levelNumber) {
    const chunkIndex = Math.floor((levelNumber - 1) / 10);
    
    // Reglas base que van aumentando según "secciones de 10 en 10"
    let gridSize = 7 + chunkIndex; 
    let wordCount = 3 + chunkIndex;
    let timeSeconds = 60 - (chunkIndex * 2);

    // DIFICULTAD EXTREMA PARA NIVELES FINALES (91-100)
    if (levelNumber > 90) {
        gridSize = 18 + (levelNumber - 91); // Sube rápido de 18 a 27
        wordCount = 15 + (levelNumber - 90); // Sube de 16 a 25 palabras
        timeSeconds = 30 - (levelNumber - 91); // Baja de 30 a 20 segundos (!)
    }
    
    // Límites de seguridad para mantener jugabilidad
    gridSize = Math.max(7, Math.min(25, gridSize));
    wordCount = Math.max(3, Math.min(25, wordCount));
    timeSeconds = Math.max(20, timeSeconds);
    
    // Diagonales e invertidas se activan a partir del nivel 50
    const allowDiagonals = levelNumber >= 50; 
    const allowReverse = levelNumber >= 50;   

    const words = getRandomWords(allWordsDictionary, wordCount, gridSize);

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
