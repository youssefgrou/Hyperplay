import React, { useState, useEffect, useRef } from 'react';
import { Heart, ArrowLeft, Trophy, RefreshCw, Zap, Award, Sparkles, Star, Rocket, Globe, HelpCircle, Loader2, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

// Standard Trivia Questions
const TRIVIA_QUESTIONS = {
  science: [
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 'Mitochondria' },
    { question: 'What is the closest planet to the Sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], answer: 'Mercury' },
    { question: "Which gas makes up the majority of Earth's atmosphere?", options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], answer: 'Nitrogen' },
    { question: 'How many minutes does it take light from the Sun to reach Earth?', options: ['8 minutes', '1 minute', '15 minutes', '3 minutes'], answer: '8 minutes' },
    { question: 'Which is the largest moon of Saturn?', options: ['Titan', 'Europa', 'Ganymede', 'Phobos'], answer: 'Titan' },
    { question: 'What is the chemical symbol for Gold?', options: ['Gd', 'Au', 'Ag', 'Fe'], answer: 'Au' },
    { question: 'Who formulated the theory of general relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nikola Tesla'], answer: 'Albert Einstein' },
    { question: 'What state of matter has a definite volume but no definite shape?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], answer: 'Liquid' }
  ],
  gaming: [
    { question: 'Who is the main protagonist of the Legend of Zelda series?', options: ['Zelda', 'Link', 'Ganon', 'Mario'], answer: 'Link' },
    { question: 'In which year was the original PlayStation released in Japan?', options: ['1990', '1992', '1994', '1996'], answer: '1994' },
    { question: 'What was the first commercially successful video game?', options: ['Pac-Man', 'Pong', 'Space Invaders', 'Tetris'], answer: 'Pong' },
    { question: 'Which gaming studio created the game "Minecraft"?', options: ['Epic Games', 'Mojang', 'Valve', 'Nintendo'], answer: 'Mojang' },
    { question: 'What is the best-selling video game console of all time?', options: ['PlayStation 2', 'Nintendo DS', 'Game Boy', 'Wii'], answer: 'PlayStation 2' },
    { question: 'Which franchise features characters like "Master Chief"?', options: ['Gears of War', 'Halo', 'Doom', 'Destiny'], answer: 'Halo' },
    { question: 'What color is the secondary portal in the game Portal?', options: ['Blue', 'Orange', 'Yellow', 'Green'], answer: 'Orange' },
    { question: 'Which game is famous for the phrase "Praise the Sun!"?', options: ['Dark Souls', 'Skyrim', 'The Witcher 3', 'Zelda'], answer: 'Dark Souls' }
  ],
  history: [
    { question: 'Who was the ancient Greek god of the underworld?', options: ['Zeus', 'Hades', 'Poseidon', 'Ares'], answer: 'Hades' },
    { question: 'Which empire built the Colosseum in Rome?', options: ['Roman Empire', 'Greek Empire', 'Persian Empire', 'Egyptian Empire'], answer: 'Roman Empire' },
    { question: 'In which year did the Titanic sink?', options: ['1908', '1912', '1916', '1920'], answer: '1912' },
    { question: 'Who was the first Emperor of Rome?', options: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'], answer: 'Augustus' },
    { question: 'What ancient structure was built by the Egyptians as tombs?', options: ['Colossus of Rhodes', 'Pyramids of Giza', 'Lighthouse of Alexandria', 'Great Wall'], answer: 'Pyramids of Giza' },
    { question: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'Benjamin Franklin', 'George Washington', 'John Adams'], answer: 'George Washington' },
    { question: 'Which navigator is credited with discovering the Americas in 1492?', options: ['Amerigo Vespucci', 'Christopher Columbus', 'Ferdinand Magellan', 'Vasco da Gama'], answer: 'Christopher Columbus' },
    { question: 'Which war was fought between the US North and South?', options: ['Revolutionary War', 'Civil War', 'War of 1812', 'World War I'], answer: 'Civil War' }
  ],
  girlfriend: [
    { question: 'ما أول شيء لفت انتباهكِ فيّ؟' },
    { question: 'متى شعرتِ أنكِ أحببتِني فعلًا؟' },
    { question: 'ما أكثر موقف جعلَكِ تضحكين معي؟' },
    { question: 'ما الشيء الذي يجعلكِ تشعرين بالأمان معي؟' },
    { question: 'لو استطعنا السفر لأي مكان معًا، أين تختارين؟' },
    { question: 'ما الأغنية التي تذكّركِ بي؟' },
    { question: 'ما أكثر صفة تحبينها في شخصيتي؟' },
    { question: 'كيف تتخيّلين مستقبلنا معًا؟' },
    { question: 'ما أجمل رسالة أرسلتُها لكِ؟' },
    { question: 'ما اللحظة التي تمنّيتِ ألا تنتهي بيننا؟' }
  ],
  memories: [
    { question: 'ما أول انطباع أخذتِه عني؟' },
    { question: 'هل تتذكرين أول محادثة بيننا؟' },
    { question: 'ما أجمل يوم قضيناه معًا؟' },
    { question: 'ما أكثر صورة تحبينها لنا؟' },
    { question: 'ما أول هدية بيننا؟' },
    { question: 'ما موقف بسيط ما زلتِ تتذكرينه؟' },
    { question: 'متى شعرتِ أن علاقتنا أصبحت مميزة؟' },
    { question: 'ما أكثر مكان تحبينه لأننا ذهبنا إليه معًا؟' },
    { question: 'ما أجمل كلمة قلتُها لكِ؟' },
    { question: 'لو تعيدين ذكرى واحدة بيننا، ماذا تختارين؟' }
  ],
  fun: [
    { question: 'من الأكثر غيرة بيننا؟ 😅' },
    { question: 'من يعتذر أولًا غالبًا؟' },
    { question: 'ما اللقب الذي تحبين أن أناديكِ به؟' },
    { question: 'ما الشيء الذي يجعلكِ تبتسمين فورًا؟' },
    { question: 'لو كنّا فيلمًا رومانسيًا، ماذا سيكون اسمه؟' },
    { question: 'ما أكثر عادة صغيرة تحبينها فيّ؟' },
    { question: 'ما الشيء الذي تريدين أن نجرّبه معًا مستقبلًا؟' }
  ]
};

const API_CATEGORIES = {
  science: 17,
  gaming: 15,
  history: 23
};

export default function ChoosingGame({ onBack }) {
  // Common states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState('selection'); 
  // states: 'selection' | 'mode_selection' | 'loading' | 'playing' | 'gameover' | 'gf_selection' | 'gf_playing' | 'gf_summary'

  // Standard trivia state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds standard
  const [gameMode, setGameMode] = useState('classic');
  const [apiError, setApiError] = useState(null);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'

  // Girlfriend state
  const [gfSubcategory, setGfSubcategory] = useState('romantic');
  const [gfResponses, setGfResponses] = useState([]); // array of { question, response }
  const [gfCurrentText, setGfCurrentText] = useState('');
  const [gfTimeLeft, setGfTimeLeft] = useState(30); // 30 seconds for girlfriend mode

  const timerRef = useRef(null);
  const gfTimerRef = useRef(null);

  // Helper to decode HTML entities from API response
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Sound FX synthesis
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'incorrect') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'romantic_save') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('Sound synthesis error:', e);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setApiError(null);
    setDifficulty('easy'); // reset to easy by default
    if (cat === 'girlfriend') {
      setGameState('gf_selection');
    } else {
      setGameState('mode_selection');
    }
  };

  // --- TRIVIA MODE FUNCTIONS ---
  const startClassicTrivia = (cat) => {
    const list = [...TRIVIA_QUESTIONS[cat]].sort(() => 0.5 - Math.random());
    setQuestions(list);
    setGameMode('classic');
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setSelectedAnswer(null);
    setIsWrong(false);
    setTimeLeft(20);
    setGameState('playing');
  };

  const startLiveTrivia = async (cat, diffLevel = 'easy') => {
    setGameState('loading');
    setGameMode('live');
    const categoryId = API_CATEGORIES[cat] || 17;
    
    try {
      // Append difficulty level parameter to fetch reasonable/easier questions
      const response = await fetch(`https://opentdb.com/api.php?amount=8&category=${categoryId}&difficulty=${diffLevel}&type=multiple`);
      const data = await response.json();

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        const list = data.results.map((result) => {
          const questionText = decodeHtml(result.question);
          const correctAnswer = decodeHtml(result.correct_answer);
          const wrongAnswers = result.incorrect_answers.map(decodeHtml);
          const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

          return {
            question: questionText,
            options: options,
            answer: correctAnswer
          };
        });

        setQuestions(list);
        setCurrentIdx(0);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setLives(3);
        setSelectedAnswer(null);
        setIsWrong(false);
        setTimeLeft(20);
        setGameState('playing');
      } else {
        throw new Error('No questions returned from API');
      }
    } catch (err) {
      console.error('API Fetch error, falling back to classic questions:', err);
      setApiError('Could not fetch live AI questions. Starting classic mode offline...');
      setTimeout(() => {
        startClassicTrivia(cat);
      }, 2000);
    }
  };

  // Trivia timer effect
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null, false); // Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIdx, selectedAnswer]);

  const handleAnswer = (answer, isCorrect) => {
    if (selectedAnswer !== null) return;

    clearInterval(timerRef.current);
    setSelectedAnswer(answer === null ? 'Time Out' : answer);

    if (isCorrect) {
      playSound('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const speedBonus = timeLeft * 15;
      const speedMultiplier = timeLeft > 14 ? 2 : 1; 
      const comboBonus = newStreak * 25;
      
      const earned = (150 + speedBonus) * speedMultiplier + comboBonus;
      setScore((prev) => prev + earned);

      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 50,
          spread: 45,
          colors: ['#ec4899', '#f97316', '#a855f7']
        });
      }

      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      playSound('incorrect');
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
    setTimeLeft(20);
    if (currentIdx + 1 >= questions.length) {
      setGameState('gameover');
      if (lives === 3) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // --- GIRLFRIEND SPECIAL MODE ---
  const startGfGame = (subcat) => {
    const list = [...GIRLFRIEND_QUESTIONS[subcat]]; 
    setQuestions(list);
    setGfSubcategory(subcat);
    setCurrentIdx(0);
    setGfResponses([]);
    setGfCurrentText('');
    setGfTimeLeft(30); 
    setGameState('gf_playing');
  };

  // Girlfriend timer effect
  useEffect(() => {
    if (gameState !== 'gf_playing') return;

    gfTimerRef.current = setInterval(() => {
      setGfTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gfTimerRef.current);
          handleGfTimeout(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gfTimerRef.current);
  }, [gameState, currentIdx]);

  const handleGfTimeout = () => {
    const textToRecord = gfCurrentText.trim() !== '' 
      ? gfCurrentText 
      : 'انتهى الوقت ولم يتم كتابة إجابة ⏰'; 

    handleRecordGfResponse(textToRecord, true);
  };

  const handleRecordGfResponse = (text, isTimeout = false) => {
    clearInterval(gfTimerRef.current);
    playSound('romantic_save');

    const cleanText = text.trim() !== '' ? text : 'لم يتم تسجيل إجابة 📝';
    
    // Save response
    const currentQ = questions[currentIdx].question;
    const newResponse = { question: currentQ, response: cleanText };
    setGfResponses((prev) => {
      const updated = [...prev, newResponse];
      localStorage.setItem('gf_saved_responses', JSON.stringify(updated));
      return updated;
    });

    // Confetti
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff007f', '#ff85a2']
    });
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff007f', '#ff85a2']
    });

    // Proceed
    setTimeout(() => {
      setGfCurrentText('');
      setGfTimeLeft(30);
      
      if (currentIdx + 1 >= questions.length) {
        setGameState('gf_summary');
        triggerEndGfConfetti();
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 1000);
  };

  const triggerEndGfConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ec4899', '#f43f5e', '#f472b6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ec4899', '#f43f5e', '#f472b6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // --- RENDERING SCREENS ---

  if (gameState === 'selection') {
    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        <div className="glow-glow pink-glow"></div>

        <button onClick={onBack} className="btn btn-secondary backButton" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <div className="section-header animate-slide-up">
          <h2 className="section-title gradient-text" style={{ background: 'var(--grad-orange-pink)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mind Match</h2>
          <p className="section-subtitle">Choose your category to test your intellect and speed.</p>
        </div>

        <div className="game-cat-grid animate-slide-up">
          {[
            { id: 'science', name: 'Science & Space', icon: <Rocket size={32} color="#f97316" />, details: 'Classic Pool or Live AI Questions', color: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
            { id: 'gaming', name: 'Tech & Gaming', icon: <Star size={32} color="#ec4899" />, details: 'Classic Pool or Live AI Questions', color: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)' },
            { id: 'history', name: 'History & Myths', icon: <Globe size={32} color="#8b5cf6" />, details: 'Classic Pool or Live AI Questions', color: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)' },
            { id: 'girlfriend', name: 'For My Girlfriend ❤️', icon: <Heart size={32} color="#ef4444" style={{ fill: '#ef4444' }} />, details: 'Personal memory book Q&A in Arabic', color: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
          ].map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="glass-panel game-cat-card"
            >
              <div className="game-cat-icon-box" style={{ background: cat.color, borderColor: cat.border }}>
                {cat.icon}
              </div>
              <span className="cat-name" style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>{cat.name}</span>
              <span className="cat-details">{cat.details}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'gf_selection') {
    return (
      <div className="game-container">
        <div className="glow-glow pink-glow" style={{ background: '#f43f5e' }}></div>
        
        <button onClick={() => setGameState('selection')} className="btn btn-secondary backButton" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Categories
        </button>

        <div className="section-header animate-slide-up">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>For My Girlfriend ❤️</h2>
          <p className="section-subtitle">أسئلة لطيفة ومميزة لتخليد ذكرياتنا ومقارنة إجاباتنا معاً</p>
        </div>

        <div className="game-cat-grid animate-slide-up">
          {[
            { id: 'romantic', name: 'أسئلة رومانسية', details: '10 Romantic Qs about feelings & connection', color: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)' },
            { id: 'memories', name: 'أسئلة عن الذكريات', details: '10 Questions about first dates, gifts & days', color: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)' },
            { id: 'fun', name: 'أسئلة لطيفة وممتعة', details: '7 Fun Qs about jealousy, nicknames & habits', color: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)' }
          ].map((sub) => (
            <button 
              key={sub.id}
              onClick={() => startGfGame(sub.id)}
              className="glass-panel game-cat-card"
              style={{ borderColor: sub.border }}
            >
              <div className="game-cat-icon-box" style={{ background: sub.color, borderColor: sub.border }}>
                <Heart size={32} color="#f43f5e" style={{ fill: '#f43f5e' }} />
              </div>
              <span className="cat-name" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{sub.name}</span>
              <span className="cat-details">{sub.details}</span>
            </button>
          ))}
        </div>

        {localStorage.getItem('gf_saved_responses') && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }} className="animate-slide-up">
            <button 
              onClick={() => {
                try {
                  const saved = JSON.parse(localStorage.getItem('gf_saved_responses'));
                  setGfResponses(saved);
                  setGameState('gf_summary');
                  triggerEndGfConfetti();
                } catch (e) {
                  console.error('Failed to parse saved responses:', e);
                }
              }} 
              className="btn btn-outline-glow" 
              style={{ padding: '0.85rem 1.75rem', color: '#f43f5e', borderColor: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <BookOpen size={16} /> View Last Memory Book (عرض ذكرياتنا المحفوظة)
            </button>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'gf_playing') {
    const currentQuestion = questions[currentIdx];
    return (
      <div className="game-container">
        <div className="glow-glow pink-glow" style={{ background: '#f43f5e' }}></div>

        {/* Top Info Bar */}
        <div className="game-top-bar">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => {
                clearInterval(gfTimerRef.current);
                setGameState('gf_selection');
              }} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1rem' }}
            >
              <ArrowLeft size={14} /> Close
            </button>
            {gfResponses.length > 0 && (
              <button 
                onClick={() => {
                  clearInterval(gfTimerRef.current);
                  setGameState('gf_summary');
                  triggerEndGfConfetti();
                }} 
                className="btn btn-primary" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem', 
                  background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                  boxShadow: '0 4px 10px rgba(244, 63, 94, 0.3)'
                }}
              >
                End & Reveal ❤️
              </button>
            )}
          </div>

          <div className="game-stat-badges">
            <div className="score-badge" style={{ borderColor: 'rgba(244,63,94,0.4)', color: '#f43f5e' }}>
              <Heart size={14} style={{ fill: '#f43f5e' }} />
              <span>Memories Shared</span>
            </div>
            
            <div className="score-badge">
              <span>Saved Qs: {gfResponses.length}/{questions.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Timer */}
        <div className="game-progress-container">
          <div className="game-progress-bar-bg">
            <div 
              className="game-progress-bar-fill"
              style={{ 
                width: `${((currentIdx) / questions.length) * 100}%`,
                background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
              }}
            ></div>
          </div>
          <span className="progress-text" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'flex-end', fontWeight: 600 }}>Question {currentIdx + 1}/{questions.length}</span>
        </div>

        {/* Question Card */}
        <div 
          className="glass-panel game-question-card animate-shake" 
          style={{ 
            borderColor: 'rgba(244,63,94,0.3)',
            boxShadow: '0 10px 30px -10px rgba(244,63,94,0.2)'
          }}
        >
          <div className="game-timer-circle" style={{ borderColor: 'rgba(244,63,94,0.4)' }}>
            <span className="game-timer-num" style={{ 
              color: gfTimeLeft <= 7 ? '#f43f5e' : '#f472b6' 
            }}>{gfTimeLeft}</span>
          </div>

          <div className="game-word-section">
            <span className="game-dict-label" style={{ color: '#f43f5e' }}>GIRLFRIEND SPECIAL EDITION ❤️</span>
            <h2 className="game-question-title" style={{ fontSize: '1.85rem', direction: 'rtl', textRendering: 'optimizeLegibility' }}>
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Text Input area for Girlfriend Response */}
        <div className="game-gf-input-box animate-slide-up">
          <textarea
            placeholder="اكتبي إجابتكِ هنا بكل صراحة... ✍️"
            value={gfCurrentText}
            onChange={(e) => setGfCurrentText(e.target.value)}
            className="game-gf-textarea"
            rows={4}
          />
          
          <button 
            onClick={() => handleRecordGfResponse(gfCurrentText)}
            className="btn btn-primary game-gf-submit-btn"
          >
            Record Response & Next <Heart size={16} style={{ fill: '#ffffff' }} />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gf_summary') {
    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        <div className="glow-glow pink-glow"></div>

        <button onClick={() => setGameState('gf_selection')} className="btn btn-secondary backButton" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Choose Another Set
        </button>

        <div className="section-header animate-slide-up">
          <Heart size={44} color="#f43f5e" style={{ fill: '#f43f5e', marginBottom: '1rem', display: 'inline-block' }} />
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Our Memory Book: Responses
          </h2>
          <p className="section-subtitle">
            Here are the recorded answers! Take turns to read them aloud, share your own answers, and compare how your minds match.
          </p>
        </div>

        {/* Polaroid layout grid */}
        <div className="polaroid-container animate-slide-up">
          {gfResponses.map((item, idx) => {
            const rotation = (idx % 3 === 0) ? '-1.5deg' : (idx % 3 === 1) ? '1.2deg' : '-0.8deg';
            return (
              <div 
                key={idx} 
                className="polaroid-card animate-bounce-in"
                style={{ '--rotation': rotation }}
              >
                <h4 className="polaroid-question">{item.question}</h4>
                <p className="polaroid-answer">
                  {item.response}
                </p>
              </div>
            );
          })}
        </div>

        <div className="game-result-buttons animate-slide-up" style={{ marginTop: '4rem' }}>
          <button onClick={() => startGfGame(gfSubcategory)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' }}>
            <RefreshCw size={16} /> Play Category Again
          </button>
          <button onClick={() => setGameState('selection')} className="btn btn-secondary">
            Return to Games selection
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'mode_selection') {
    return (
      <div className="game-container">
        <div className="glow-glow purple-glow"></div>
        
        <button onClick={() => setGameState('selection')} className="btn btn-secondary backButton" style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Categories
        </button>

        <div className="section-header animate-slide-up">
          <h2 className="section-title gradient-text">Choose Quiz Mode</h2>
          <p className="section-subtitle">Play offline hand-crafted classic questions, or load fresh dynamically fetched AI questions.</p>
        </div>

        <div className="game-mode-grid animate-slide-up">
          
          {/* Classic Card */}
          <div className="glass-panel game-mode-card" onClick={() => startClassicTrivia(selectedCategory)}>
            <div className="game-mode-icon-box" style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <Star size={36} color="#3b82f6" />
            </div>
            <h3 className="mode-title" style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Classic Pool Mode</h3>
            <p className="mode-desc" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>Play our offline collection of handpicked, curated questions. Best for fast loading and speed-running.</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', background: 'var(--grad-cyan-blue)' }}>
              Play Classic
            </button>
          </div>

          {/* AI Live Card with Difficulty Choice */}
          <div className="glass-panel game-mode-card">
            <div className="game-mode-icon-box" style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <Sparkles size={36} color="#a855f7" className="animate-float" />
            </div>
            <h3 className="mode-title" style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>AI Live Mode</h3>
            <p className="mode-desc" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Fetches fresh trivia questions in real-time. Choose your difficulty below so questions match your preference!
            </p>

            {/* Difficulty selection selector to avoid hard questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 'bold', letterSpacing: '0.05em' }}>SELECT DIFFICULTY:</span>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                {['easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.5rem',
                      fontSize: '0.75rem',
                      background: difficulty === diff ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.03)',
                      borderColor: difficulty === diff ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      borderRadius: '8px'
                    }}
                  >
                    {diff === 'easy' ? 'Easy 😊' : diff === 'medium' ? 'Medium 😐' : 'Hard 🔥'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => startLiveTrivia(selectedCategory, difficulty)}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 'auto' }}
            >
              Play Live ({difficulty.toUpperCase()})
            </button>
          </div>

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
              <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Fetching Live AI Trivia</h3>
              <p style={{ color: 'var(--text-muted)' }}>Loading fresh {difficulty} questions from the trivia server...</p>
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
        <div className="glow-glow pink-glow"></div>

        {/* Top Info Bar */}
        <div className="game-top-bar">
          <button onClick={() => setGameState('selection')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={14} /> Exit
          </button>

          <div className="game-stat-badges">
            {timeLeft > 14 && selectedAnswer === null && (
              <div className="score-badge animate-float" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: '#ec4899' }}>
                <Sparkles size={14} />
                <span>2x Speed Bonus!</span>
              </div>
            )}
            
            <div className="score-badge">
              <Zap size={14} color="#ec4899" style={{ fill: '#ec4899' }} />
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
                width: `${((currentIdx) / questions.length) * 100}%`,
                background: 'var(--grad-orange-pink)'
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
              color: timeLeft <= 5 ? '#f43f5e' : '#f97316' 
            }}>{timeLeft}</span>
          </div>

          <div className="game-word-section">
            <span className="game-dict-label" style={{ color: '#f97316' }}>
              {selectedCategory.toUpperCase()} • {gameMode.toUpperCase()} • {difficulty.toUpperCase()}
            </span>
            <h2 className="game-question-title">{currentQuestion.question}</h2>
          </div>
        </div>

        {/* Options Grid */}
        <div className="game-options-grid">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.answer;
            
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
            {isPerfect ? 'Mind Master!' : 'Round Completed!'}
          </h2>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '450px' }}>
            {lives <= 0 ? 'Tough questions, but you showed great effort!' : 'Spectacular run! Your brain cells are on fire.'}
          </p>

          <div className="game-result-stats-grid">
            <div className="game-result-stat-card">
              <Award size={22} color="#f97316" />
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-white)' }}>{score}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Final Score</span>
            </div>

            <div className="game-result-stat-card">
              <Zap size={22} color="#ec4899" />
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
            <button 
              onClick={() => gameMode === 'classic' ? startClassicTrivia(selectedCategory) : startLiveTrivia(selectedCategory, difficulty)} 
              className="btn btn-primary" 
              style={{ background: 'var(--grad-orange-pink)' }}
            >
              <RefreshCw size={16} /> Replay Level
            </button>
            <button onClick={() => setGameState('selection')} className="btn btn-secondary">
              Change Category
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
