import React, { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, ArrowLeft, Trophy, RefreshCw, Zap, Award, Sparkles, Languages, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Concept Database for Classic Mode
const CONCEPTS = [
  { en: 'the world', fr: 'le monde', es: 'el mundo', de: 'die Welt', it: 'il mondo', ar: 'العالم' },
  { en: 'sun', fr: 'soleil', es: 'sol', de: 'Sonne', it: 'sole', ar: 'الشمس' },
  { en: 'moon', fr: 'lune', es: 'luna', de: 'Mond', it: 'luna', ar: 'القمر' },
  { en: 'water', fr: 'eau', es: 'agua', de: 'Wasser', it: 'acqua', ar: 'الماء' },
  { en: 'computer', fr: 'ordinateur', es: 'ordenador', de: 'Computer', it: 'computer', ar: 'الحاسوب' },
  { en: 'library', fr: 'bibliothèque', es: 'biblioteca', de: 'Bibliothek', it: 'biblioteca', ar: 'المكتبة' },
  { en: 'butterfly', fr: 'papillon', es: 'mariposa', de: 'Schmetterling', it: 'farfalla', ar: 'الفراشة' },
  { en: 'book', fr: 'livre', es: 'libro', de: 'Buch', it: 'libro', ar: 'الكتاب' },
  { en: 'dog', fr: 'chien', es: 'perro', de: 'Hund', it: 'cane', ar: 'الكلب' },
  { en: 'cat', fr: 'chat', es: 'gato', de: 'Katze', it: 'gatto', ar: 'القط' },
  { en: 'thank you very much', fr: 'merci beaucoup', es: 'muchas gracias', de: 'vielen Dank', it: 'grazie mille', ar: 'شكراً جزيلاً' },
  { en: 'hello, how are you?', fr: 'bonjour, comment ça va ?', es: 'hola, ¿cómo estás?', de: 'hallo, wie geht es dir?', it: 'ciao, come stai?', ar: 'مرحباً، كيف حالك؟' },
  { en: 'good morning', fr: 'bonjour', es: 'buenos días', de: 'guten Morgen', it: 'buongiorno', ar: 'صباح الخير' },
  { en: 'good night', fr: 'bonne nuit', es: 'buenas noches', de: 'gute Nacht', it: 'buonanotte', ar: 'تصبح على خير' },
  { en: 'I love you', fr: 'je t\'aime', es: 'te amo', de: 'ich liebe dich', it: 'ti amo', ar: 'أنا أحبك' },
  { en: 'life is beautiful', fr: 'la vie est belle', es: 'la vida es bella', de: 'das Leben ist schön', it: 'la vita è bella', ar: 'الحياة جميلة' },
  { en: 'where is the station?', fr: 'où est la gare ?', es: '¿dónde está la estación?', de: 'wo ist der Bahnhof?', it: 'dov\'è la stazione?', ar: 'أين المحطة؟' },
  { en: 'sweet dreams', fr: 'fais de beaux rêves', es: 'dulces sueños', de: 'süße Träume', it: 'sogni d\'oro', ar: 'أحلام سعيدة' },
  { en: 'welcome to our game', fr: 'bienvenue dans notre jeu', es: 'bienvenido a nuestro juego', de: 'willkommen in unserem Spiel', it: 'benvenuto nel nostro gioco', ar: 'مرحباً بك في لعبتنا' },
  { en: 'have a nice day', fr: 'bonne journée', es: 'que tengas un buen día', de: 'einen schönen Tag noch', it: 'buona giornata', ar: 'أتمنى لك يوماً سعيداً' }
];

// Richer, attractive English phrases to dynamically translate in AI Live mode
const DYNAMIC_AI_PHRASES = [
  'Peace begins with a smile',
  'Believe you can and you are halfway there',
  'Love is the key to happiness',
  'Always follow your dreams',
  'A true friend is a treasure',
  'Success comes to those who work hard',
  'Reading books opens the mind',
  'Life is a beautiful journey, enjoy it',
  'Never lose hope for a brighter tomorrow',
  'Kindness is a language everyone understands',
  'Keep smiling and stay positive always',
  'Knowledge is power, learning is a superpower'
];

const LANGUAGES = [
  { id: 'english', code: 'en', flag: '🇬🇧', name: 'English' },
  { id: 'french', code: 'fr', flag: '🇫🇷', name: 'French' },
  { id: 'spanish', code: 'es', flag: '🇪🇸', name: 'Spanish' },
  { id: 'german', code: 'de', flag: '🇩🇪', name: 'German' },
  { id: 'italian', code: 'it', flag: '🇮🇹', name: 'Italian' },
  { id: 'arabic', code: 'ar', flag: '🇸🇦', name: 'Arabic' }
];

const LOCALES = {
  english: 'en-US',
  french: 'fr-FR',
  spanish: 'es-ES',
  german: 'de-DE',
  italian: 'it-IT',
  arabic: 'ar-SA'
};

export default function TranslateGame({ onBack }) {
  const [fromLang, setFromLang] = useState('french');
  const [toLang, setToLang] = useState('arabic');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameMode, setGameMode] = useState('classic'); // 'classic' | 'live'
  const [gameState, setGameState] = useState('selection'); // 'selection' | 'loading' | 'playing' | 'gameover'
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const timerRef = useRef(null);

  // Play synthetic feedback sound
  const playSound = (isCorrect) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn('Web Audio support issue:', e);
    }
  };

  // Speak word using speech synthesis
  const speakWord = (word, langKey) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = LOCALES[langKey] || 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartGame = async () => {
    if (fromLang === toLang) return;
    setApiError(null);

    const fromCode = (LANGUAGES.find(l => l.id === fromLang)?.code || 'en').toLowerCase().trim();
    const toCode = (LANGUAGES.find(l => l.id === toLang)?.code || 'ar').toLowerCase().trim();

    if (fromCode === toCode) {
      setApiError('Please select two distinct languages.');
      return;
    }

    if (gameMode === 'classic') {
      // Classic Mode Generation
      const list = CONCEPTS.map((concept) => {
        const promptWord = concept[fromCode];
        const correctWord = concept[toCode];

        const wrongOptions = CONCEPTS
          .filter(c => c[toCode] !== correctWord)
          .map(c => c[toCode])
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correctWord, ...wrongOptions].sort(() => 0.5 - Math.random());

        return {
          word: promptWord,
          translation: correctWord,
          options,
          langCode: LOCALES[fromLang]
        };
      }).sort(() => 0.5 - Math.random()).slice(0, 10);

      setQuestions(list);
      startGameLoop();
    } else {
      // AI Live Mode using MyMemory Translation API
      setGameState('loading');
      
      try {
        // Pick 8 random English sentences
        const selectedPhrases = [...DYNAMIC_AI_PHRASES].sort(() => 0.5 - Math.random()).slice(0, 8);

        // Fetch translations concurrently to build dynamic translation cards
        const fetchPromises = selectedPhrases.map(async (phrase) => {
          let wordSource = phrase;
          let wordTarget = phrase;

          if (fromCode !== 'en') {
            const resSource = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(phrase)}&langpair=en|${fromCode}`);
            if (!resSource.ok) {
              throw new Error(`HTTP error status: ${resSource.status}`);
            }
            const dataSource = await resSource.json();
            if (dataSource.responseStatus != 200 || !dataSource.responseData) {
              throw new Error(`Translation API error status: ${dataSource.responseStatus}`);
            }
            wordSource = dataSource.responseData.translatedText;
          }

          if (toCode !== 'en') {
            const resTarget = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(phrase)}&langpair=en|${toCode}`);
            if (!resTarget.ok) {
              throw new Error(`HTTP error status: ${resTarget.status}`);
            }
            const dataTarget = await resTarget.json();
            if (dataTarget.responseStatus != 200 || !dataTarget.responseData) {
              throw new Error(`Translation API error status: ${dataTarget.responseStatus}`);
            }
            wordTarget = dataTarget.responseData.translatedText;
          }

          return { source: wordSource, target: wordTarget };
        });

        const translatedList = await Promise.all(fetchPromises);

        // Form questions array
        const list = translatedList.map((item, idx) => {
          const promptWord = item.source;
          const correctWord = item.target;

          // Distractors from other translated phrases in target lang
          const wrongOptions = translatedList
            .filter((_, i) => i !== idx)
            .map(t => t.target)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          const options = [correctWord, ...wrongOptions].sort(() => 0.5 - Math.random());

          return {
            word: promptWord,
            translation: correctWord,
            options,
            langCode: LOCALES[fromLang]
          };
        });

        setQuestions(list);
        startGameLoop();
      } catch (err) {
        console.error('Translation API error, falling back to Classic Pool:', err);
        setApiError('AI Translator server is busy. Launching offline vocabulary pool...');
        setTimeout(() => {
          setGameMode('classic');
          // Start offline fallback
          const list = CONCEPTS.map((concept) => {
            const promptWord = concept[fromCode];
            const correctWord = concept[toCode];

            const wrongOptions = CONCEPTS
              .filter(c => c[toCode] !== correctWord)
              .map(c => c[toCode])
              .sort(() => 0.5 - Math.random())
              .slice(0, 3);

            const options = [correctWord, ...wrongOptions].sort(() => 0.5 - Math.random());

            return {
              word: promptWord,
              translation: correctWord,
              options,
              langCode: LOCALES[fromLang]
            };
          }).sort(() => 0.5 - Math.random()).slice(0, 10);
          setQuestions(list);
          startGameLoop();
        }, 2000);
      }
    }
  };

  const startGameLoop = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setSelectedAnswer(null);
    setIsWrong(false);
    setTimeLeft(15);
    setGameState('playing');
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIdx, selectedAnswer]);

  // Autoplay voice
  useEffect(() => {
    if (gameState === 'playing' && questions[currentIdx]) {
      const q = questions[currentIdx];
      const timer = setTimeout(() => {
        speakWord(q.word, fromLang);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentIdx]);

  const handleAnswer = (answer, isCorrect) => {
    if (selectedAnswer !== null) return;
    
    clearInterval(timerRef.current);
    setSelectedAnswer(answer === null ? 'Time Out' : answer);
    
    if (isCorrect) {
      playSound(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      
      const speedBonus = timeLeft * 10;
      const comboBonus = newStreak * 25;
      setScore((prev) => prev + 100 + speedBonus + comboBonus);

      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ['#10b981', '#6366f1', '#06b6d4']
        });
      }

      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      playSound(false);
      setIsWrong(true);
      setStreak(0);
      const remainingLives = lives - 1;
      setLives(remainingLives);

      setTimeout(() => {
        setIsWrong(false);
        if (remainingLives <= 0) {
          setGameState('gameover');
        } else {
          nextQuestion();
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setTimeLeft(15);
    if (currentIdx + 1 >= questions.length) {
      setGameState('gameover');
      if (lives === 3) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  if (gameState === 'selection') {
    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        <div className="glow-glow cyan-glow"></div>

        <button onClick={onBack} className="btn btn-secondary backButton" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <div className="section-header animate-slide-up">
          <h2 className="section-title gradient-text">Translate Master</h2>
          <p className="section-subtitle">Choose your custom translation direction to build vocabulary and sentences.</p>
        </div>

        {/* Dynamic / AI Mode toggle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto 2.5rem auto' }} className="animate-slide-up">
          <button 
            onClick={() => setGameMode('classic')}
            className={`toggle-btn ${gameMode === 'classic' ? 'toggle-btn-active' : ''}`}
            style={{ flex: 1, padding: '0.85rem' }}
          >
            Classic Vocabulary
          </button>
          <button 
            onClick={() => setGameMode('live')}
            className={`toggle-btn ${gameMode === 'live' ? 'toggle-btn-active' : ''}`}
            style={{ flex: 1, padding: '0.85rem' }}
          >
            AI Live Translator
          </button>
        </div>

        <div className="setupGrid animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          
          {/* Column 1: Source Language */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
              <span className="gradient-text" style={{ fontWeight: 'bold' }}>1. Translate From</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setFromLang(lang.id);
                    if (toLang === lang.id) {
                      setToLang(LANGUAGES.find(l => l.id !== lang.id).id);
                    }
                  }}
                  className={`btn ${fromLang === lang.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    width: '100%',
                    justifyContent: 'flex-start',
                    background: fromLang === lang.id ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: fromLang === lang.id ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    boxShadow: fromLang === lang.id ? '0 0 15px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Target Language */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
              <span className="gradient-text" style={{ fontWeight: 'bold' }}>2. Translate To</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  disabled={fromLang === lang.id}
                  onClick={() => setToLang(lang.id)}
                  className={`btn ${toLang === lang.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    width: '100%',
                    justifyContent: 'flex-start',
                    background: toLang === lang.id ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: toLang === lang.id ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    boxShadow: toLang === lang.id ? '0 0 15px rgba(139, 92, 246, 0.2)' : 'none',
                    opacity: fromLang === lang.id ? 0.3 : 1,
                    cursor: fromLang === lang.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }} className="animate-slide-up">
          <button 
            onClick={handleStartGame} 
            className="btn btn-primary" 
            style={{ fontSize: '1.15rem', padding: '1rem 2.5rem' }}
          >
            Start Arena: {LANGUAGES.find(l => l.id === fromLang).name} to {LANGUAGES.find(l => l.id === toLang).name} <Zap size={16} fill="white" />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="game-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '4rem 3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
          {apiError ? (
            <div style={{ textAlign: 'center' }}>
              <Sparkles size={40} className="cyan-gradient-text" style={{ marginBottom: '1.5rem' }} />
              <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '1.1rem' }}>{apiError}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Loader2 size={50} color="#8b5cf6" className="animate-float" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1.5rem', display: 'inline-block' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Translation Portal</h3>
              <p style={{ color: 'var(--text-muted)' }}>Dynamically translating sentences into {toLang} via API...</p>
            </div>
          )}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentQuestion = questions[currentIdx];
    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        
        {/* Top Info Bar */}
        <div className="game-top-bar">
          <button onClick={() => setGameState('selection')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={14} /> Exit
          </button>

          <div className="game-stat-badges">
            <div className="score-badge">
              <Zap size={14} color="#a855f7" style={{ fill: '#a855f7' }} />
              <span>Streak: {streak}</span>
            </div>
            
            <div className="score-badge">
              <Trophy size={14} color="#eab308" style={{ fill: '#eab308' }} />
              <span>Score: {score}</span>
            </div>

            <div className="game-hearts">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={20} 
                  color={i < lives ? '#ef4444' : '#475569'} 
                  fill={i < lives ? '#ef4444' : 'transparent'} 
                  style={{ transition: 'var(--transition-bounce)' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar & Timer */}
        <div className="game-progress-container">
          <div className="game-progress-bar-bg">
            <div 
              className="game-progress-bar-fill"
              style={{ 
                width: `${((currentIdx) / questions.length) * 100}%` 
              }}
            ></div>
          </div>
          <span className="progress-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'flex-end', fontWeight: 600 }}>Question {currentIdx + 1}/{questions.length}</span>
        </div>

        {/* Question Card */}
        <div 
          className={`glass-panel game-question-card ${isWrong ? 'animate-shake' : ''}`} 
          style={{ 
            borderColor: selectedAnswer !== null ? (isWrong ? 'var(--color-danger)' : 'var(--color-success)') : 'var(--border-color)'
          }}
        >
          <div className="game-timer-circle">
            <span className="game-timer-num" style={{ 
              color: timeLeft <= 5 ? '#f43f5e' : '#06b6d4' 
            }}>{timeLeft}</span>
          </div>

          <div className="game-word-section">
            <span className="game-dict-label" style={{ color: '#8b5cf6' }}>
              {fromLang.toUpperCase()} → {toLang.toUpperCase()} • {gameMode.toUpperCase()}
            </span>
            <h1 className="translateWord" style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', margin: '0.5rem 0' }}>{currentQuestion.word}</h1>
            
            <button 
              onClick={() => speakWord(currentQuestion.word, fromLang)}
              className="speak-button"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition-smooth)', marginTop: '0.5rem' }}
              title="Listen Pronunciation"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        {/* Options Grid */}
        <div className="game-options-grid">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.translation;
            
            let btnStyle = {};
            let customClass = "glass-panel game-option-btn";
            if (selectedAnswer !== null) {
              if (isCorrectOption) {
                customClass += " option-item-correct";
              } else if (isSelected) {
                customClass += " option-item-incorrect";
              } else {
                btnStyle = { opacity: 0.4 };
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option, isCorrectOption)}
                style={btnStyle}
                disabled={selectedAnswer !== null}
                className={customClass}
              >
                <span className="option-letter" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{['A', 'B', 'C', 'D'][i]}</span>
                <span className="option-text" style={{ fontSize: '1.05rem', fontWeight: 500 }}>{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    const isPerfect = lives === 3;

    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        <div className="glow-glow pink-glow"></div>
        
        <div className="glass-panel game-result-box animate-bounce-in">
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 30px rgba(234, 179, 8, 0.2)' }}>
            <Trophy size={60} color="#eab308" style={{ fill: '#eab308' }} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-white)', marginBottom: '0.75rem' }}>
            {isPerfect ? 'Flawless Victory!' : 'Round Completed!'}
          </h2>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '450px' }}>
            {lives <= 0 ? 'You ran out of lives, but you learned a lot!' : 'Amazing job! You conquered the vocab list.'}
          </p>

          <div className="game-result-stats-grid">
            <div className="game-result-stat-card">
              <Award size={22} color="#8b5cf6" />
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-white)' }}>{score}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Final Score</span>
            </div>

            <div className="game-result-stat-card">
              <Zap size={22} color="#06b6d4" />
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-white)' }}>{maxStreak}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Best Streak</span>
            </div>

            <div className="game-result-stat-card">
              <Heart size={22} color="#ef4444" style={{ fill: '#ef4444' }} />
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-white)' }}>{lives}/3</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Lives Left</span>
            </div>
          </div>

          <div className="game-result-buttons">
            <button onClick={handleStartGame} className="btn btn-primary">
              <RefreshCw size={16} /> Replay Arena
            </button>
            <button onClick={() => setGameState('selection')} className="btn btn-secondary">
              Configure Languages
            </button>
            <button onClick={onBack} className="btn btn-secondary">
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }
}
