export function WordDisplay({ wordToGuess, guessedLetters, reveal = false }) {
  return (
    <div className="word-display">
      {wordToGuess.split("").map((letter, index) => (
        <span key={index} className="letter-slot">
          <span
            style={{
              visibility: guessedLetters.includes(letter) || reveal ? "visible" : "hidden",
              color: !guessedLetters.includes(letter) && reveal ? "#f87171" : "white",
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}