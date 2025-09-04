// Normalize names (handles multiple words, e.g., firstName: "AnGel MILk" -> "Angel Milk")
export const normalizeNames = (names) => {
  if (!names) return "";
  return names
    .split(/\s+/) // split by one or more spaces
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Format a Date object into { date: "dd/mm/yyyy", month: "MonthName" }
export const formatDateAndMonth = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return { date: "", month: "" };

  const day = String(dateObj.getDate()).padStart(2, "0"); // dd
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // mm
  const year = dateObj.getFullYear(); // yyyy

  const monthName = dateObj.toLocaleString("en-US", { month: "long" }); // e.g. "January"

  return {
    date: `${day}/${month}/${year}`,
    month: monthName
  };
};

// Check if text is within max sentences (e.g., maxSentences=3 allows up to 3 sentences)
export const isWithinMaxSentences = (text, maxSentences) => {
  if (!text) return true; // empty is fine

  // Split text into sentences
  const sentences = text
    .split(/(?<=[.?!])\s+/) // look for ., ?, ! followed by space(s)
    .filter((s) => s.trim().length > 0); // remove empty strings

  return sentences.length <= maxSentences;
};