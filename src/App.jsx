import { useState, useEffect, useMemo } from 'react';
import { generateGrid } from './utils/wordSearchGenerator';
import { getLevelConfig } from './utils/gameLevels';
import { playBeep, playAlertSound, playAnguishSound, setSoundEnabled } from './utils/audio';
import Grid from './components/Grid';
import Timer from './components/Timer';
import { App as CapacitorApp } from '@capacitor/app';

function App() {
    const [gameState, setGameState] = useState('START_SCREEN'); // START_SCREEN, LEVEL_SELECT, PLAYING, SUCCESS, GAMEOVER, TOTAL_GAMEOVER
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [config, setConfig] = useState(null);
    const [foundWords, setFoundWords] = useState([]);
    const [foundPositions, setFoundPositions] = useState([]);
    const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
    const [gameId, setGameId] = useState(0);
    const [addSecondsEvent, setAddSecondsEvent] = useState(0);
    const [menuPage, setMenuPage] = useState(0); 
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('midnight'); // midnight, emerald, cyberpunk, sunset

    const TOTAL_LEVELS = 100;

    const THEMES = [
        { id: 'midnight', name: 'Oscuro Gamer', icon: '🌌' },
        { id: 'emerald', name: 'Esmeralda', icon: '🌿' },
        { id: 'softrose', name: 'Soft Rose', icon: '🌸' },
        { id: 'nitro', name: 'Rojo Nitro', icon: '🏎️' }
    ];




    // Load progress and settings from LocalStorage
    useEffect(() => {
        const savedLevel = localStorage.getItem('sopa_de_letras_max_level');
        if (savedLevel) {
            const parsed = parseInt(savedLevel, 10);
            setMaxUnlockedLevel(parsed);
            setMenuPage(Math.floor((parsed - 1) / 10));
        }

        const savedSound = localStorage.getItem('sopa_de_letras_sound');
        if (savedSound !== null) {
            const enabled = savedSound === 'true';
            setIsSoundEnabled(enabled);
            setSoundEnabled(enabled);
        }

        const savedTheme = localStorage.getItem('sopa_de_letras_theme');
        if (savedTheme) {
            setCurrentTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const changeTheme = (themeId) => {
        setCurrentTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('sopa_de_letras_theme', themeId);
        if (isSoundEnabled) playBeep(1000, 50);
    };


    const toggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        setSoundEnabled(newState);
        localStorage.setItem('sopa_de_letras_sound', newState.toString());
        if (newState) playBeep(800, 100);
    };

    const updateMaxLevel = (newMax) => {
        setMaxUnlockedLevel(newMax);
        localStorage.setItem('sopa_de_letras_max_level', newMax.toString());
    };

    const handleResetProgress = () => {
        if (window.confirm('¿Estás seguro de que quieres reiniciar TODO tu progreso y volver al nivel 1?')) {
            updateMaxLevel(1);
        }
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
        setAddSecondsEvent(0);
        setGameId(prev => prev + 1);
        setGameState('PLAYING');
    };

    const exitApp = () => {
        if (window.confirm('¿Deseas salir del juego?')) {
            CapacitorApp.exitApp().catch(() => {
                console.log('Exiting app (web fallback)...');
                alert('En un dispositivo móvil, la aplicación se cerraría ahora.');
            });
        }
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
            setFoundWords(prev => [...prev, found]);
            setFoundPositions(prev => [...prev, ...selection]);
            setAddSecondsEvent(prev => prev + 1);

            playBeep(1200, 100); // 🪙 "Ding!" sound effect for word
            
            // We use foundWords.length + 1 because the state update is async
            if (foundWords.length + 1 === config.wordsPlaced.length) {
                // WON THIS LEVEL
                setTimeout(() => {
                    playBeep(1500, 300); // 🎉 "Tada!" sound effect for level win
                }, 200);
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
        const remaining = lives - 1;
        setLives(remaining);
        
        if (remaining <= 0) {
            playAnguishSound();
            setGameState('TOTAL_GAMEOVER');
        } else {
            playAlertSound();
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
        const start = menuPage * 10 + 1;
        const end = Math.min(start + 9, TOTAL_LEVELS);
        const levels = [];
        
        for (let i = start; i <= end; i++) {
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

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
                <div className="levels-pagination" style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'space-between' }}>
                    <button 
                        className="btn-icon" 
                        disabled={menuPage === 0}
                        onClick={() => setMenuPage(p => p - 1)}
                        style={{ fontSize: '1.5rem', padding: '5px 15px' }}
                    >
                        ◀
                    </button>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Niveles {start} - {end}
                    </span>
                    <button 
                        className="btn-icon" 
                        disabled={(menuPage + 1) * 10 >= TOTAL_LEVELS}
                        onClick={() => setMenuPage(p => p + 1)}
                        style={{ fontSize: '1.5rem', padding: '5px 15px' }}
                    >
                        ▶
                    </button>
                </div>
                <div className="levels-grid">{levels}</div>
            </div>
        );
    };

// Main App Grid
    return (
        <div className="app-container">
            {gameState === 'START_SCREEN' && (
                <div className="home-container-premium">
                    {/* Background Orbs and Particles */}
                    <div className="bg-glow-top"></div>
                    <div className="bg-glow-bottom"></div>
                    <div className="particle-container">
                        {particleData.map((p, i) => (
                            <div key={i} className="particle" style={{
                                top: p.top,
                                left: p.left,
                                animationDelay: p.delay,
                                fontSize: p.size
                            }}>
                                {p.char}
                            </div>
                        ))}
                    </div>

                    <header className="hero-section">
                        <h1 className="main-title-premium">
                            <span className="title-sopa-de">SOPA DE</span><br />
                            <span className="title-letras">LETRAS</span>
                        </h1>
                        <div className="subtitle-container-premium">
                            <div className="gold-line"></div>
                            <span className="subtitle-text">MODO GENIO</span>
                            <div className="gold-line"></div>
                        </div>
                    </header>
                    
                    <div className="main-actions">
                        <button className="btn-play-premium" onClick={() => setGameState('LEVEL_SELECT')}>
                            <span className="play-icon">🎮</span> JUGAR
                        </button>
                    </div>

                    <div className="secondary-actions-premium">
                        <div className="action-item-premium">
                            <button className="btn-circle-premium" onClick={() => setShowSettings(true)}>
                                ⚙️
                            </button>
                            <span className="action-label-premium">CONFIGURACIÓN</span>
                        </div>
                        <div className="action-item-premium">
                            <button className="btn-circle-premium" onClick={exitApp}>
                                🚪
                            </button>
                            <span className="action-label-premium">SALIR</span>
                        </div>
                    </div>

                    <footer className="footer-premium">
                        V 1.0.0 • by Emilio
                    </footer>

                    {showSettings && (
                        <div className="overlay">
                            <div className="glass-panel overlay-content">
                                <h2>Configuración</h2>
                                <div className="settings-list">
                                    <div className="setting-item">
                                        <span>Efectos de Sonido</span>
                                        <button 
                                            className={`toggle-btn ${isSoundEnabled ? 'active' : ''}`}
                                            onClick={toggleSound}
                                        >
                                            {isSoundEnabled ? 'ENCENDIDO' : 'APAGADO'}
                                        </button>
                                    </div>
                                    <div className="setting-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                                        <span>Tema de Interfaz</span>
                                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%'}}>
                                            {THEMES.map(t => (
                                                <button 
                                                    key={t.id}
                                                    className={`theme-chip ${currentTheme === t.id ? 'active' : ''}`}
                                                    onClick={() => changeTheme(t.id)}
                                                >
                                                    {t.icon} {t.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="setting-item" style={{justifyContent: 'center', marginTop: '10px'}}>
                                        <a href="PRIVACY_POLICY.html" target="_blank" style={{color: 'var(--accent-color)', fontSize: '0.9rem'}}>Política de Privacidad</a>
                                    </div>

                                </div>
                                <button className="btn-primary" onClick={() => setShowSettings(false)}>ACEPTAR</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'LEVEL_SELECT' && (
                <div className="main-menu">
                    <button className="btn-back" onClick={() => setGameState('START_SCREEN')}>◀ Portada</button>
                    <h1>Niveles</h1>
                    <p style={{marginBottom: '10px'}}>¡Elige un nivel y juega!</p>
                    <div className="glass-panel" style={{width: '100%', flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {renderLevelSelector()}
                        <div style={{borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: 'auto'}}>
                            <button className="btn-secondary" onClick={handleResetProgress}>
                                🔄 Reiniciar progreso (Nivel 1)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(gameState === 'PLAYING' || gameState === 'SUCCESS' || gameState === 'GAMEOVER' || gameState === 'TOTAL_GAMEOVER') && config && (
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div className="game-header">
                        <button className="btn-icon" onClick={() => setGameState('LEVEL_SELECT')} title="Volver al Menú">
                            ◀ Niveles
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
                            addSecondsEvent={addSecondsEvent}
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
                        <button className="btn-secondary" onClick={() => setGameState('LEVEL_SELECT')}>Ir a Niveles</button>
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
                        <button className="btn-primary" onClick={() => {
                            const penaltyLevel = Math.max(1, level - 1);
                            // Set the max unlocked level to the penalty level so they have to re-unlock
                            updateMaxLevel(penaltyLevel);
                            startGame(penaltyLevel, 3);
                        }}>Aceptar Penalidad</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
