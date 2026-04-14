const DIRECTIONS = [
    [0, 1],   // Right
    [1, 0],   // Down
    [1, 1],   // Diagonal Down-Right
    [-1, 1],  // Diagonal Up-Right
    [0, -1],  // Left
    [-1, 0],  // Up
    [-1, -1], // Diagonal Up-Left
    [1, -1]   // Diagonal Down-Left
];

export function generateGrid(words, size = 10, allowDiagonals = false, allowReverse = false) {
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const uppercaseWords = words.map(w => w.toUpperCase().replace(/ /g, ''));
    const wordPositions = {};

    let allowedDirs = allowDiagonals ? DIRECTIONS.slice(0, 4) : DIRECTIONS.slice(0, 2);
    if(allowReverse) {
        allowedDirs = allowDiagonals ? DIRECTIONS : [DIRECTIONS[0], DIRECTIONS[1], DIRECTIONS[4], DIRECTIONS[5]];
    }

    const placeWord = (word) => {
        // Try up to 100 times to place the word
        for (let attempt = 0; attempt < 200; attempt++) {
            const dir = allowedDirs[Math.floor(Math.random() * allowedDirs.length)];
            const startRow = Math.floor(Math.random() * size);
            const startCol = Math.floor(Math.random() * size);
            
            let canPlace = true;
            let tmpRow = startRow;
            let tmpCol = startCol;
            
            // Check if bounds and overlaps are ok
            for (let i = 0; i < word.length; i++) {
                if (tmpRow < 0 || tmpRow >= size || tmpCol < 0 || tmpCol >= size) {
                    canPlace = false;
                    break;
                }
                if (grid[tmpRow][tmpCol] !== '' && grid[tmpRow][tmpCol] !== word[i]) {
                    canPlace = false;
                    break;
                }
                tmpRow += dir[0];
                tmpCol += dir[1];
            }

            if (canPlace) {
                // Place it
                tmpRow = startRow;
                tmpCol = startCol;
                let positions = [];
                for (let i = 0; i < word.length; i++) {
                    grid[tmpRow][tmpCol] = word[i];
                    positions.push({ row: tmpRow, col: tmpCol });
                    tmpRow += dir[0];
                    tmpCol += dir[1];
                }
                return positions;
            }
        }
        return null; // Failed to place word
    };

    const finalWords = [];
    uppercaseWords.forEach(word => {
        const positions = placeWord(word);
        if (positions) {
            finalWords.push(word);
            wordPositions[word] = positions;
        }
    });

    // Fill the rest with random letters
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    return { grid, wordPositions, wordsPlaced: finalWords };
}
