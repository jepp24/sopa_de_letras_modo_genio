import { useState, useEffect } from 'react';
import { generateGrid } from './utils/wordSearchGenerator';
import { getLevelConfig } from './utils/gameLevels';
import { playBeep } from './utils/audio';
import Grid from './components/Grid';
import Timer from './components/Timer';

function App() {
    const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, SUCCESS, GAMEOVER, TOTAL_GAMEOVER
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [config, setConfig] = useState(null);
    const [foundWords, setFoundWords] = useState([]);
    const [foundPositions, setFoundPositions] = useState([]);
    const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
    const [gameId, setGameId] = useState(0);

    const TOTAL_LEVELS = 100;

    // Load progress from LocalStorage
    useEffect(() => {
        const savedLevel = localStorage.getItem('sopa_de_letras_max_level');
        if (savedLevel) {
            setMaxUnlockedLevel(parseInt(savedLevel, 10));
        }
    }, []);

    const updateMaxLevel = (newMax) => {
        setMaxUnlockedLevel(newMax);
        localStorage.setItem('sopa_de_letras_max_level', newMax.toString());
    };

    const startGame = (lvl, currentLives = 3) => {
        const actualLvl = Math.max(1, lvl);
        const lvConfig = getLevelConfig(actualLvl);
        const gridData = generateGrid(lvConfig.words, lvConfig.gridSize, lvConfig.allowDiagonals, lvConfig.allowReverse);
        
        setConfig({
            ...lvConfig,
            grid: gridData.grid,
            wordPositions: gridData.wordPositions,
            wordsPlaced: gridData.wordsPlaced
        });
        setLevel(actualLvl);
        setLives(currentLives);
        setFoundWords([]);
        setFoundPositions([]);
        setGameId(prev => prev + 1);
        setGameState('PLAYING');
    };

    const handleWordSelect = (selection) => {
        if (gameState !== 'PLAYING') return;

        const wordFormed = selection.map(pos => config.grid[pos.r][pos.c]).join('');
        const wordReversed = wordFormed.split('').reverse().join('');

        let found = null;
        if (config.wordsPlaced.includes(wordFormed) && !foundWords.includes(wordFormed)) {
            found = wordFormed;
        } else if (config.allowReverse && config.wordsPlaced.includes(wordReversed) && !foundWords.includes(wordReversed)) {
            found = wordReversed;
        }

        if (found) {
            setFoundWords([...foundWords, found]);
            setFoundPositions([...foundPositions, ...selection]);
            
            if (foundWords.length + 1 === config.wordsPlaced.length) {
                // WON THIS LEVEL
                if (level === maxUnlockedLevel && level < TOTAL_LEVELS) {
                    updateMaxLevel(level + 1);
                }
                setGameState('SUCCESS');
            }
        }
    };

    const handleTimeUp = () => {
        if (gameState === 'PLAYING') {
            handleFailure();
        }
    };

    // Called on time up or explicit failure
    const handleFailure = () => {
        playBeep(300, 400); // Low beep failure
        const remaining = lives - 1;
        setLives(remaining);
        
        if (remaining <= 0) {
            setGameState('TOTAL_GAMEOVER');
        } else {
            setGameState('GAMEOVER');
        }
    };

    const HeartContainer = () => {
        const hearts = [];
        for (let i = 0; i < 3; i++) {
            hearts.push(
                <span key={i} style={{ opacity: i < lives ? 1 : 0.2, margin: '0 2px' }}>❤️</span>
            );
        }
        return <div style={{ fontSize: '1.2rem'}}>{hearts}</div>;
    };

    const renderLevelSelector = () => {
        const levels = [];
        for (let i = 1; i <= TOTAL_LEVELS; i++) {
            const isUnlocked = i <= maxUnlockedLevel;
            levels.push(
                <button 
                    key={i} 
                    className={`level-btn ${isUnlocked ? 'unlocked' : 'locked'}`}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && startGame(i, 3)}
                >
                    {isUnlocked ? i : '🔒'}
                </button>
            );
        }
        return <div className="levels-grid">{levels}</div>;
    };

    return (
        <div className="app-container">
            {gameState === 'MENU' && (
                <div className="main-menu">
                    <h1>Sopa de Letras</h1>
                    <h2>Premium Edition</h2>
                    <p style={{marginBottom: '10px'}}>¡Elige un nivel y juega!</p>
                    <div className="glass-panel" style={{width: '100%', flex: 1, overflowY: 'auto', padding: '15px'}}>
                        {renderLevelSelector()}
                    </div>
                </div>
            )}

            {(gameState === 'PLAYING' || gameState === 'SUCCESS' || gameState === 'GAMEOVER' || gameState === 'TOTAL_GAMEOVER') && config && (
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div className="game-header">
                        <button className="btn-icon" onClick={() => setGameState('MENU')} title="Volver al Menú">
                            ◀ Volver
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                            <div className="level-badge">
                                Nivel {level} {level <= 10 ? '✈️' : '🦁'}
                            </div>
                            <HeartContainer />
                        </div>
                        <Timer 
                            key={gameId}
                            initialSeconds={config.timeSeconds} 
                            isRunning={gameState === 'PLAYING'} 
                            onTimeUp={handleTimeUp} 
                        />
                    </div>

                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="word-list">
                            {config.wordsPlaced.map(word => (
                                <div key={word} className={`word-chip ${foundWords.includes(word) ? 'found' : ''}`}>
                                    {word}
                                </div>
                            ))}
                        </div>

                        <Grid 
                            config={{ grid: config.grid, size: config.gridSize }} 
                            onWordSelect={handleWordSelect} 
                            foundPositions={foundPositions} 
                        />
                    </div>
                </div>
            )}

            {gameState === 'SUCCESS' && (
                <div className="overlay">
                    <div className="glass-panel overlay-content">
                        <div className="emoji-large">🎉</div>
                        <h2>¡Nivel Completado!</h2>
                        <p>¡Eres un genio! Prepárate para el siguiente desafío.</p>
                        <button className="btn-primary" onClick={() => startGame(level < TOTAL_LEVELS ? level + 1 : TOTAL_LEVELS, lives)}>Siguiente Nivel</button>
                        <button className="btn-secondary" onClick={() => setGameState('MENU')}>Ir al Menú</button>
                    </div>
                </div>
            )}

            {gameState === 'GAMEOVER' && (
                <div className="overlay">
                    <div className="glass-panel overlay-content">
                        <div className="emoji-large">⚠️</div>
                        <h2>¡Cuidado! Perdiste una vida</h2>
                        <p>Te quedan {lives} vidas. ¡Inténtalo de nuevo!</p>
                        <button className="btn-primary" onClick={() => startGame(level, lives)}>Continuar</button>
                    </div>
                </div>
            )}

            {gameState === 'TOTAL_GAMEOVER' && (
                <div className="overlay">
                    <div className="glass-panel overlay-content">
                        <div className="emoji-large">☠️</div>
                        <h2>Salud Agotada</h2>
                        <p>Has perdido las 3 vidas. Como penalidad, retrocederás al nivel anterior.</p>
                        {/* Decrease level by 1, refill lives to 3 */}
                        <button className="btn-primary" onClick={() => startGame(Math.max(1, level - 1), 3)}>Aceptar Penalidad</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
