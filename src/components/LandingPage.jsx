import React, { useState } from 'react';
import { Sparkles, Globe2, HelpCircle, Trophy, Zap, ArrowRight, Play, CheckCircle2, Languages } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LandingPage({ onSelectGame }) {
  const [teaserType, setTeaserType] = useState('translate'); // 'translate' | 'trivia'
  const [teaserSelected, setTeaserSelected] = useState(null);
  const [teaserSuccess, setTeaserSuccess] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4']
    });
  };

  const handleTeaserAnswer = (answer, isCorrect) => {
    if (teaserSelected !== null) return; // Only allow one click in the teaser
    setTeaserSelected(answer);
    if (isCorrect) {
      setTeaserSuccess(true);
      triggerConfetti();
    } else {
      setTeaserSuccess(false);
    }
  };

  const resetTeaser = () => {
    setTeaserSelected(null);
    setTeaserSuccess(false);
  };

  return (
    <div className="landing-wrapper">
      {/* Decorative Glow Blobs */}
      <div className="glow-glow purple-glow"></div>
      <div className="glow-glow pink-glow"></div>
      <div className="glow-glow cyan-glow"></div>

      {/* Header / Navbar */}
      <header className="hub-header">
        <div className="container hub-header-container">
          <div className="hub-logo">
            <div className="hub-logo-icon">
              <Sparkles size={22} color="#ffffff" />
            </div>
            <span className="hub-logo-text">HYPER<span className="gradient-text" style={{ fontWeight: 800 }}>PLAY</span></span>
          </div>
          <div className="hub-header-stats">
            <div className="score-badge" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <Zap size={14} className="cyan-gradient-text" style={{ fill: '#06b6d4' }} />
              <span style={{ color: '#06b6d4' }}>Active Players: 4,891</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section animate-slide-up">
        <div className="container hero-container">
          <div className="score-badge hero-badge animate-float">
            <Sparkles size={14} style={{ color: '#a855f7' }} />
            <span>EXCITING NEW GAME MODE RELEASED</span>
          </div>

          <h1 className="hero-title">
            Level Up Your Brain in the <br />
            <span className="gradient-text">Ultimate Mind Arena</span>
          </h1>

          <p className="hero-subtitle">
            Challenge yourself with two immersive game modes. Translate languages at hyper-speed
            or outsmart tricky trivia questions. Beautiful, fast, and free to play!
          </p>

          <div className="hero-buttons">
            <a href="#games" className="btn btn-primary">
              Launch Game Hub <Play size={16} fill="white" />
            </a>
            <a href="#teaser" className="btn btn-secondary">
              Try Demo <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid / Game Modes */}
      <section id="games" className="game-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Select Your Challenge</h2>
            <p className="section-subtitle">Choose a mode below to start playing. Track your highscore and beat your personal best!</p>
          </div>

          <div className="game-cards-grid">
            {/* Game Card 1: Translate Game */}
            <div
              className="glass-panel game-card"
              onClick={() => onSelectGame('translate')}
            >
              <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}></div>
              <div className="card-header">
                <div className="card-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <Languages size={28} color="#6366f1" />
                </div>
                <div className="score-badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderColor: 'transparent' }}>
                  Speed & Vocabulary
                </div>
              </div>
              <h3 className="card-title">Translate Master</h3>
              <p className="card-desc">
                Translate words and phrases across languages in a fast-paced vocabulary test.
                Perfect for language learners and word experts!
              </p>
              <div className="card-features-list">
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>25+ Language Pairs</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>AI Dynamic Translation API</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Visual Audio Pronunciation</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                Play Translate Game <ArrowRight size={16} />
              </button>
            </div>

            {/* Game Card 2: Trivia Game */}
            <div
              className="glass-panel game-card"
              onClick={() => onSelectGame('trivia')}
            >
              <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)' }}></div>
              <div className="card-header">
                <div className="card-icon-box" style={{ background: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                  <HelpCircle size={28} color="#ec4899" />
                </div>
                <div className="score-badge" style={{ background: 'rgba(236,72,153,0.1)', color: '#f472b6', borderColor: 'transparent' }}>
                  Knowledge & Timing
                </div>
              </div>
              <h3 className="card-title">Mind Match (Choosing)</h3>
              <p className="card-desc">
                Put your knowledge to the test in a multiple-choice question challenge. Answer quickly
                to maintain your streak and score maximum points!
              </p>
              <div className="card-features-list">
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Choose Trivia Difficulties</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Live API & Classic Modes</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Girlfriend Custom Edition ❤️</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', background: 'var(--grad-orange-pink)' }}>
                Play Trivia Game <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Teaser Section */}
      <section id="teaser" className="teaser-section">
        <div className="container">
          <div className="glass-panel teaser-box">
            <div className="teaser-grid">

              <div className="teaser-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Sparkles size={16} color="#ec4899" />
                  <span style={{ fontFamily: 'var(--font-title)', fontWeight: 600, color: '#ec4899', fontSize: '0.9rem', letterSpacing: '0.05em' }}>LIVE DEMO</span>
                </div>
                <h2 className="teaser-title">Test Your Skills Right Now</h2>
                <p className="teaser-subtitle">
                  Try this quick interactive teaser! Select a mode and choose the correct answer to see the visual game flow in action.
                </p>

                <div className="toggle-buttons">
                  <button
                    onClick={() => { setTeaserType('translate'); resetTeaser(); }}
                    className={`toggle-btn ${teaserType === 'translate' ? 'toggle-btn-active' : ''}`}
                  >
                    <Languages size={16} /> Translate Teaser
                  </button>
                  <button
                    onClick={() => { setTeaserType('trivia'); resetTeaser(); }}
                    className={`toggle-btn ${teaserType === 'trivia' ? 'toggle-btn-active' : ''}`}
                  >
                    <HelpCircle size={16} /> Trivia Teaser
                  </button>
                </div>
              </div>

              <div className="teaser-right">
                <div className="mockup-container">
                  <div className="mockup-header">
                    <div className="mockup-dot"></div>
                    <div className="mockup-dot"></div>
                    <div className="mockup-dot"></div>
                    <span className="mockup-title">Interactive Preview</span>
                  </div>

                  <div className="mockup-body">
                    {teaserType === 'translate' ? (
                      <div>
                        <div className="question-bubble">
                          <span className="question-label">SPANISH</span>
                          <h4 className="question-word">¿Cómo se dice <span className="gradient-text" style={{ fontWeight: 800 }}>"El world"</span> en inglés?</h4>
                        </div>
                        <div className="options-list">
                          {[
                            { text: 'The Moon', isCorrect: false },
                            { text: 'The World', isCorrect: true },
                            { text: 'The Sky', isCorrect: false }
                          ].map((opt, i) => {
                            let itemClass = "option-item";
                            if (teaserSelected === opt.text) {
                              itemClass += opt.isCorrect ? " option-item-correct" : " option-item-incorrect";
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => handleTeaserAnswer(opt.text, opt.isCorrect)}
                                className={itemClass}
                                disabled={teaserSelected !== null}
                              >
                                <span>{opt.text}</span>
                                {teaserSelected === opt.text && (
                                  opt.isCorrect ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>✗</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="question-bubble">
                          <span className="question-label">GEOGRAPHY TRIVIA</span>
                          <h4 className="question-word">Which city is known as the <span className="gradient-text" style={{ fontWeight: 800 }}>"City of Light"</span>?</h4>
                        </div>
                        <div className="options-list">
                          {[
                            { text: 'London', isCorrect: false },
                            { text: 'Paris', isCorrect: true },
                            { text: 'New York', isCorrect: false }
                          ].map((opt, i) => {
                            let itemClass = "option-item";
                            if (teaserSelected === opt.text) {
                              itemClass += opt.isCorrect ? " option-item-correct" : " option-item-incorrect";
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => handleTeaserAnswer(opt.text, opt.isCorrect)}
                                className={itemClass}
                                disabled={teaserSelected !== null}
                              >
                                <span>{opt.text}</span>
                                {teaserSelected === opt.text && (
                                  opt.isCorrect ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>✗</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {teaserSelected !== null && (
                      <div className="teaser-result-container animate-bounce-in">
                        {teaserSuccess ? (
                          <div className="success-box">
                            <Trophy size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                            <span>Correct! You are ready to play.</span>
                            <button onClick={resetTeaser} className="reset-teaser-btn">Try Again</button>
                          </div>
                        ) : (
                          <div className="error-box">
                            <span>Oops! That is incorrect.</span>
                            <button onClick={resetTeaser} className="reset-teaser-btn">Try Again</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h4 className="stat-number gradient-text">10k+</h4>
              <p className="stat-label">Active Matches Today</p>
            </div>
            <div className="stat-item">
              <h4 className="stat-number cyan-gradient-text">99%</h4>
              <p className="stat-label">Satisfaction Rate</p>
            </div>
            <div className="stat-item">
              <h4 className="stat-number pink-gradient-text">100%</h4>
              <p className="stat-label">Ad-Free & Free to Play</p>
            </div>
          </div>
        </div>
      </section>


      <div style={{ textAlign: "center", marginTop: "10px", backgroundColor: "transparent", border: "none", color: "#cbd5e1" }} className="">
        <p>Développé par Youssef Grou </p>
      </div>
    </div>



  );
}
