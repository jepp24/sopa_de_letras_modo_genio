import { useState, useEffect } from 'react';
import { playBeep } from '../utils/audio';

export default function Timer({ initialSeconds, onTimeUp, isRunning, addSecondsEvent }) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (addSecondsEvent > 0) {
            setTimeLeft(prev => {
                let reward = 2; // Recompensa menor al principio
                if (prev <= 15) {
                    reward = 5; // Recompensa mayor si queda poco tiempo
                } else if (prev <= initialSeconds * 0.5) {
                    reward = 3; // Recompensa media a la mitad del nivel
                }
                return prev + reward;
            });
        }
    }, [addSecondsEvent, initialSeconds]);

    // Single interval — only recreated when isRunning changes
    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    const newTime = prev - 1;
                    if (newTime <= 10 && newTime > 0) {
                        playBeep(800, 100);
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            onTimeUp();
        }
    }, [timeLeft, isRunning, onTimeUp]);


    const formatTime = () => {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const isWarning = timeLeft <= 10 && timeLeft > 0;

    return (
        <div className={`timer-container ${isWarning ? 'timer-warning' : ''}`}>
            {formatTime()}
        </div>
    );
}
