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