// Static catalog of the game's topics ("album pages"). Pure data — no DOM,
// no storage. All topics are live, each with a question-bank data file.

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
    status: "live",
    dataFile: "data/premier-league.json",
  },
  {
    id: "la-liga",
    emoji: "⚽",
    label: "לה ליגה",
    status: "live",
    dataFile: "data/la-liga.json",
  },
  {
    id: "champions-league",
    emoji: "⚽",
    label: "ליגת האלופות",
    status: "live",
    dataFile: "data/champions-league.json",
  },
];
