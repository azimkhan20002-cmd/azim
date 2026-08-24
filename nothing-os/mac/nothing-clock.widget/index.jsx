// ============================================================
//  nothing-clock.widget - dot-matrix desktop clock for Übersicht
//
//  Draws real 5x7 dot-matrix digits as dots: white digits, faint
//  off-dots, red colon (#D71921 - the screen's one red element).
//  Below the clock: date + battery in small mono caps.
//
//  No fonts needed. Install: copy this .widget folder into
//  ~/Library/Application Support/Übersicht/widgets/
//
//  Position is the two numbers at the bottom of this file.
// ============================================================

export const command =
  "date '+%H:%M'; date '+%a %b %d' | tr '[:lower:]' '[:upper:]'; " +
  "pmset -g batt | grep -Eo '[0-9]+%' | head -1";

export const refreshFrequency = 1000; // ms

// ---- look ---------------------------------------------------
const DOT = 7;        // dot diameter, px
const GAP = 5;        // gap between dots, px
const ON = "rgba(255,255,255,0.92)";
const OFF = "rgba(255,255,255,0.05)";
const RED = "#D71921";

// ---- 5x7 glyphs ---------------------------------------------
const GLYPHS = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
};

const cell = DOT + GAP;

const dotStyle = (lit, color) => ({
  position: "absolute",
  width: DOT,
  height: DOT,
  borderRadius: "50%",
  background: lit ? color : OFF,
});

const Glyph = ({ ch }) => {
  const rows = GLYPHS[ch];
  if (!rows) return null;
  const cols = rows[0].length;
  const color = ch === ":" ? RED : ON;
  const dots = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <span
          key={`${r}-${c}`}
          style={{ ...dotStyle(rows[r][c] === "1", color), left: c * cell, top: r * cell }}
        />
      );
    }
  }
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: cols * cell - GAP,
        height: 7 * cell - GAP,
        marginRight: cell * 1.4,
      }}
    >
      {dots}
    </span>
  );
};

export const render = ({ output }) => {
  const lines = (output || "").trim().split("\n");
  const time = lines[0] || "--:--";
  const date = lines[1] || "";
  const batt = lines[2] || "";
  return (
    <div>
      <div style={{ whiteSpace: "nowrap" }}>
        {time.split("").map((ch, i) => (
          <Glyph key={i} ch={ch} />
        ))}
      </div>
      <div
        style={{
          marginTop: cell * 1.6,
          fontFamily: "Menlo, monospace",
          fontSize: 13,
          letterSpacing: "0.35em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {date}
        {batt ? `  ·  ${batt}` : ""}
      </div>
    </div>
  );
};

// ---- position: distance from the screen edges, in px --------
const LEFT = 80;
const BOTTOM = 120;

export const className = {
  position: "absolute",
  left: LEFT,
  bottom: BOTTOM,
};
