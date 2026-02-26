export function Keyboard({ activeLetters, inactiveLetters, addGuessedLetter, disabled = false }) {
  const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="keyboard">
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            key={key}
            onClick={() => addGuessedLetter(key)}
            className={`key ${isActive ? "correct" : ""} ${isInactive ? "wrong" : ""}`}
            disabled={isActive || isInactive || disabled}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}