const HEAD = (
  <div key="head" style={{ 
    width: "30px", height: "30px", borderRadius: "100%", 
    border: "6px solid white", position: "absolute", 
    top: "35px", right: "-16px" 
  }} />
);

const BODY = (
  <div key="body" style={{ 
    width: "6px", height: "60px", background: "white", 
    position: "absolute", top: "71px", right: 0 
  }} />
);

const RIGHT_ARM = (
  <div key="r-arm" style={{ 
    width: "50px", height: "6px", background: "white", 
    position: "absolute", top: "90px", right: "-50px", 
    rotate: "-30deg", transformOrigin: "left bottom" 
  }} />
);

const LEFT_ARM = (
  <div key="l-arm" style={{ 
    width: "50px", height: "6px", background: "white", 
    position: "absolute", top: "90px", right: "6px", 
    rotate: "30deg", transformOrigin: "right bottom" 
  }} />
);

const RIGHT_LEG = (
  <div key="r-leg" style={{ 
    width: "50px", height: "6px", background: "white", 
    position: "absolute", top: "125px", right: "-45px", 
    rotate: "60deg", transformOrigin: "left bottom" 
  }} />
);

const LEFT_LEG = (
  <div key="l-leg" style={{ 
    width: "50px", height: "6px", background: "white", 
    position: "absolute", top: "125px", right: "1px", 
    rotate: "-60deg", transformOrigin: "right bottom" 
  }} />
);

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

export function HangmanDrawing({ numberOfGuesses }) {
  return (
    <div style={{ position: "relative", height: "200px", width: "150px" }}>
      {/* The drawing of the man */}
      {BODY_PARTS.slice(0, numberOfGuesses)}

      {/* The Shortened Gallows */}
      {/* Small hook */}
      <div style={{ height: "35px", width: "6px", background: "white", position: "absolute", top: 0, right: 0 }} />
      {/* Top bar */}
      <div style={{ height: "6px", width: "100px", background: "white", marginLeft: "50px" }} />
      {/* Main vertical pole (Reduced from 400px to 190px) */}
      <div style={{ height: "190px", width: "6px", background: "white", marginLeft: "50px" }} />
      {/* Base */}
      <div style={{ height: "6px", width: "120px", background: "white" }} />
    </div>
  );
}