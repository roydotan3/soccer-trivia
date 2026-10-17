// Static catalog of the game's topics ("album pages"). Pure data — no DOM,
// no storage. Two topics are live (with a question-bank data file); the
// rest are "soon" placeholders shown but not tappable.

export const TOPICS = [
  {
    id: "israeli-football",
    emoji: "⚽",
    label: "כדורגל ישראלי",
    sublabel: "ליגת העל + הנבחרת",
    status: "live",
    dataFile: "data/israeli-football.json",
  },
  {
    id: "world-cup",
    emoji: "🌍",
    label: "נבחרות ומונדיאל",
    sublabel: "כולל מונדיאל 2026",
    status: "live",
    dataFile: "data/world-cup.json",
  },
  {
    id: "premier-league",
    emoji: "⚽",
    label: "הפרמייר ליג",
    status: "soon",
  },
  {
    id: "la-liga",
    emoji: "⚽",
    label: "לה ליגה",
    status: "soon",
  },
  {
    id: "champions-league",
    emoji: "⚽",
    label: "ליגת האלופות",
    status: "soon",
  },
];
