import { useState, useEffect, useCallback, useMemo } from "react";
import words from "./data/words.json";
import { HangmanDrawing } from "./components/HangmanDrawing";
import { WordDisplay } from "./components/WordDisplay";
import { Keyboard } from "./components/Keyboard";
import { fetchPlayer, updatePlayerRecord } from "./api/api"; 
import "./index.css";

function App() {
  // --- AUTH & USER STATE ---
  const [playerName, setPlayerName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerData, setPlayerData] = useState({ username: "", wins: 0, losses: 0 });

  // --- GAME STATE ---
  const [gameStarted, setGameStarted] = useState(false);
  const [wordToGuess, setWordToGuess] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [scoreTracked, setScoreTracked] = useState(false);

  // Logic: Calculate Win % for the UI
  const winPercentage = useMemo(() => {
    const total = playerData.wins + playerData.losses;
    return total > 0 ? ((playerData.wins / total) * 100).toFixed(1) : "0.0";
  }, [playerData]);

  const activeLetters = guessedLetters.filter(l => wordToGuess.includes(l));
  const inactiveLetters = guessedLetters.filter(l => !wordToGuess.includes(l));

  const isLoser = inactiveLetters.length >= 6;
  const isWinner = wordToGuess.length > 0 && wordToGuess.split("").every(l => guessedLetters.includes(l));

  // --- API HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const result = await fetchPlayer(playerName);
    if (result) {
      setPlayerData(result.player);
      setIsLoggedIn(true);
      
      // FIX: Remove focus from the input so the keyboard works for the game
      if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
      }
    }
  };

  const setupNewGame = useCallback((diff = difficulty) => {
    const filtered = diff === "All" ? words : words.filter(w => w.difficulty === diff);
    const randomEntry = filtered[Math.floor(Math.random() * filtered.length)];
    
    setWordToGuess(randomEntry.word.toUpperCase());
    setCategory(randomEntry.category);
    setGuessedLetters([]);
    setShowModal(false);
    setScoreTracked(false);
    setGameStarted(true);
  }, [difficulty]);

  const addGuessedLetter = useCallback((letter) => {
    const upper = letter.toUpperCase();
    if (!upper.match(/^[A-Z]$/) || guessedLetters.includes(upper) || isWinner || isLoser || !gameStarted) return;
    setGuessedLetters(curr => [...curr, upper]);
  }, [guessedLetters, isWinner, isLoser, gameStarted]);

  // FIX: Handle Keyboard events with an Input Guard
  useEffect(() => {
    const handler = (e) => {
      // Don't trigger game keys if user is typing in a text box
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      
      if (!e.key.match(/^[a-z]$/i)) return;
      
      e.preventDefault();
      addGuessedLetter(e.key);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addGuessedLetter]);

  // Handle Win/Loss Logic and Sync with DB
  useEffect(() => {
    if ((isWinner || isLoser) && !scoreTracked) {
      setShowModal(true);
      const result = isWinner ? 'win' : 'loss';
      
      // 1. Update locally instantly
      setPlayerData(prev => ({
        ...prev,
        wins: isWinner ? prev.wins + 1 : prev.wins,
        losses: isLoser ? prev.losses + 1 : prev.losses
      }));

      // 2. Persist to DynamoDB
      updatePlayerRecord(playerData.username, result);
      setScoreTracked(true);
    }
  }, [isWinner, isLoser, scoreTracked, playerData.username]);

  // --- SCREENS ---

  if (!isLoggedIn) {
    return (
      <div className="start-screen">
        <h1 className="title-glow">HANGMAN</h1>
        <form className="difficulty-card" onSubmit={handleLogin}>
          <h2>Enter Player Name</h2>
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Username..."
            className="name-input"
            autoFocus
          />
          <button type="submit" className="primary-btn">Login / Join</button>
        </form>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1 className="title-glow">WELCOME, {playerData.username}</h1>
        <div className="difficulty-card">
          <h2>Stats: {winPercentage}% Wins</h2>
          <div className="diff-options">
            {["All", "Easy", "Medium", "Hard"].map((level) => (
              <button key={level} onClick={() => setupNewGame(level)}>
                {level === "All" ? "Any" : level}
              </button>
            ))}
          </div>
          <button className="secondary-btn" onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrapper">
      <div className="top-actions">
        <button className="secondary-btn" onClick={() => setGameStarted(false)}>Main Menu</button>
        <button className="primary-btn" onClick={() => setupNewGame()}>New Word</button>
      </div>
      
      <div className="game-container">
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2 className={isWinner ? "win" : "lose"}>{isWinner ? "Victory!" : "Defeat!"}</h2>
              <p>Word: <strong>{wordToGuess}</strong></p>
              <div className="modal-buttons">
                <button onClick={() => setupNewGame()}>Next Round</button>
                <button className="outline" onClick={() => setGameStarted(false)}>Menu</button>
              </div>
            </div>
          </div>
        )}

        <header className="compact-header">
          <div className="player-info"><b>{playerData.username}</b> ({winPercentage}%)</div>
          <div className="score-strip">
            <span>W: <b className="win">{playerData.wins}</b></span>
            <span>L: <b className="lose">{playerData.losses}</b></span>
          </div>
          <div className="category-tag">Category: <b>{category}</b></div>
        </header>

        <div className="drawing-mini">
          <HangmanDrawing numberOfGuesses={inactiveLetters.length} />
        </div>

        <div className="word-center">
          <WordDisplay reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
        </div>

        <div className="keyboard-base">
          <Keyboard 
            disabled={isWinner || isLoser} 
            activeLetters={activeLetters} 
            inactiveLetters={inactiveLetters} 
            addGuessedLetter={addGuessedLetter} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;