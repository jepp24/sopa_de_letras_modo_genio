import { useState, useRef, useEffect } from 'react';

export default function Grid({ config, onWordSelect, foundPositions }) {
    const { grid, size } = config;
    const [isDragging, setIsDragging] = useState(false);
    const [selection, setSelection] = useState([]);
    const gridRef = useRef(null);

    // Dynamic cell size based on grid size to fit on mobile
    useEffect(() => {
        document.documentElement.style.setProperty('--cell-size', `${Math.min(35, 320 / size)}px`);
    }, [size]);

    const handlePointerDown = (r, c) => {
        setIsDragging(true);
        setSelection([{ r, c }]);
    };

    const handlePointerEnter = (r, c) => {
        if (!isDragging) return;
        
        // Simple logic: just add to selection if it forms a straight line from start
        // For a more advanced selection, we ensure it's on a valid line (horizontal, vertical, diagonal)
        const start = selection[0];
        const dr = Math.sign(r - start.r);
        const dc = Math.sign(c - start.c);
        
        // Check if it's a valid direction
        if ((r === start.r || c === start.c || Math.abs(r - start.r) === Math.abs(c - start.c))) {
            // Build the straight line selection from start to current
            let newSelection = [];
            let currR = start.r;
            let currC = start.c;
            
            newSelection.push({ r: currR, c: currC });
            while (currR !== r || currC !== c) {
                currR += dr;
                currC += dc;
                newSelection.push({ r: currR, c: currC });
            }
            setSelection(newSelection);
        }
    };

    const handlePointerUp = () => {
        if (isDragging && selection.length > 0) {
            onWordSelect(selection);
        }
        setIsDragging(false);
        setSelection([]);
    };

    // For mobile touch move
    const handleTouchMove = (e) => {
        if (!isDragging || !gridRef.current) return;
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('cell')) {
            const r = parseInt(element.dataset.r, 10);
            const c = parseInt(element.dataset.c, 10);
            
            // Only update if it's a different cell from the last one in the selection
            if (selection.length === 0 || selection[selection.length - 1].r !== r || selection[selection.length - 1].c !== c) {
                handlePointerEnter(r, c);
            }
        }
    };

    // Global listener to stop dragging if touch ends outside
    useEffect(() => {
        const handleGlobalUp = () => {
            if(isDragging) handlePointerUp();
        };
        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('touchend', handleGlobalUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [isDragging, selection]);

    const isSelected = (r, c) => {
        return selection.some(point => point.r === r && point.c === c);
    };

    const isFound = (r, c) => {
        return foundPositions.some(point => point.r === r && point.c === c);
    };

    return (
        <div className="grid-container" onTouchMove={handleTouchMove}>
            <div 
                className="grid" 
                ref={gridRef}
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
                {grid.map((row, r) => (
                    row.map((letter, c) => (
                        <div 
                            key={`${r}-${c}`}
                            data-r={r}
                            data-c={c}
                            className={`cell ${isSelected(r, c) ? 'selected' : ''} ${isFound(r, c) ? 'found' : ''}`}
                            onMouseDown={() => handlePointerDown(r, c)}
                            onMouseEnter={() => handlePointerEnter(r, c)}
                            onTouchStart={() => handlePointerDown(r, c)}
                        >
                            {letter}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
}
