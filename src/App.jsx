import { useState, useEffect, useCallback } from "react";
import words from "./data/words.json";
import { HangmanDrawing } from "./components/HangmanDrawing";
import { WordDisplay } from "./components/WordDisplay";
import { Keyboard } from "./components/Keyboard";
import "./index.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [wordToGuess, setWordToGuess] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [showModal, setShowModal] = useState(false);

  const activeLetters = guessedLetters.filter(l => wordToGuess.includes(l));
  const inactiveLetters = guessedLetters.filter(l => !wordToGuess.includes(l));

  const isLoser = inactiveLetters.length >= 6;
  const isWinner = wordToGuess.length > 0 && wordToGuess.split("").every(l => guessedLetters.includes(l));

  const setupNewGame = useCallback((diff = difficulty) => {
    const filtered = diff === "All" ? words : words.filter(w => w.difficulty === diff);
    const randomEntry = filtered[Math.floor(Math.random() * filtered.length)];
    
    setWordToGuess(randomEntry.word.toUpperCase());
    setCategory(randomEntry.category);
    setGuessedLetters([]);
    setShowModal(false);
    setGameStarted(true);
  }, [difficulty]);

  const addGuessedLetter = useCallback((letter) => {
    const upper = letter.toUpperCase();
    if (!upper.match(/^[A-Z]$/) || guessedLetters.includes(upper) || isWinner || isLoser || !gameStarted) return;
    setGuessedLetters(curr => [...curr, upper]);
  }, [guessedLetters, isWinner, isLoser, gameStarted]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.key.match(/^[a-z]$/i)) return;
      e.preventDefault();
      addGuessedLetter(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addGuessedLetter]);

  useEffect(() => {
    if (isWinner || isLoser) setShowModal(true);
  }, [isWinner, isLoser]);

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1 className="title-glow">HANGMAN</h1>
        <div className="difficulty-card">
          <h2>Select Difficulty</h2>
          <div className="diff-options">
            {["All", "Easy", "Medium", "Hard"].map((level) => (
              <button key={level} onClick={() => { setDifficulty(level); setupNewGame(level); }}>
                {level === "All" ? "Any Difficulty" : level}
              </button>
            ))}
          </div>
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
          <div className="difficulty-label">Difficulty: {difficulty}</div>
          <div className="score-strip">
            <span>Wins: <b className="win">{score.wins}</b></span>
            <span>Losses: <b className="lose">{score.losses}</b></span>
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