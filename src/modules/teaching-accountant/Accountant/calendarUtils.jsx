// Shared helpers for building a 7-column month calendar grid.
// Used by MiniCalendar (dashboard).

export const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Trailing days from the previous month, to fill the first week.
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({ day, currentMonth: false, date: new Date(year, month - 1, day) });
  }

  // Days in the current month.
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, currentMonth: true, date: new Date(year, month, day) });
  }

  // Leading days from the next month, to complete the final week.
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, currentMonth: false, date: new Date(year, month + 1, nextDay) });
    nextDay += 1;
  }

  return cells;
}

export const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const monthLabel = (year, month) =>
  new Date(year, month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
