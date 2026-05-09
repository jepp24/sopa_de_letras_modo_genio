import React, { useEffect } from 'react';
import './HomePreview.css';

const HomePreview = ({ onBack }) => {
  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <div className="home-preview-container">
      {/* Background Orbs */}
      <div className="bg-glow-top"></div>
      <div className="bg-glow-bottom"></div>
      
      {/* Floating Letters */}
      <div className="animated-bg">
        {['A', 'E', 'T', 'O', 'N', 'I', 'S', 'R', 'L', 'C'].map((char, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * -20}s`,
            fontSize: `${1.5 + Math.random() * 2}rem`
          }}>
            {char}
          </div>
        ))}
      </div>

      <div className="home-content">
        <header className="hero-section">
          <h1 className="main-title-premium">
            <span className="title-sopa-de">SOPA DE</span><br />
            <span className="title-letras">LETRAS</span>
          </h1>
          <div className="subtitle-container">
            <div className="gold-line"></div>
            <span className="subtitle-premium">MODO GENIO</span>
            <div className="gold-line"></div>
          </div>
        </header>

        <div className="main-actions">
          <button className="btn-play-premium">
            <span className="play-icon">🎮</span> JUGAR
          </button>
        </div>

        <div className="secondary-actions">
          <div className="action-item">
            <button className="btn-circle-glass">
              <i data-lucide="settings"></i>
            </button>
            <span className="action-label">CONFIGURACIÓN</span>
          </div>
          <div className="action-item">
            <button className="btn-circle-glass">
              <i data-lucide="log-out"></i>
            </button>
            <span className="action-label">SALIR</span>
          </div>
        </div>

        <footer className="footer-credits-premium">
          V 1.0.0 • by Emilio
        </footer>
      </div>

      {/* Ad Area */}
      <div className="banner-area-premium">
        <div className="banner-glass-premium">
          <span className="ad-tag-premium">AD</span>
          <p>Publicidad no invasiva</p>
        </div>
      </div>
      
      {onBack && (
        <button className="btn-restore-premium" onClick={onBack}>
          Restaurar Original
        </button>
      )}
    </div>
  );
};

export default HomePreview;
