// Simple, stable date/time helpers using string formats.
// Date format: YYYY-MM-DD   Time format: HH:mm

function pad2(n) {
  const s = String(Math.abs(Math.trunc(Number(n) || 0)));
  return s.length >= 2 ? s : '0' + s;
}

// Returns YYYY-MM-DD for a Date (defaults to now).
export function toDateString(date) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Returns HH:mm for a Date (defaults to now).
export function toTimeString(date) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function todayString() {
  return toDateString(new Date());
}

export function nowTimeString() {
  return toTimeString(new Date());
}

// Validate a YYYY-MM-DD string.
export function isValidDateString(value) {
  if (typeof value !== 'string') return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

// Validate an HH:mm string.
export function isValidTimeString(value) {
  if (typeof value !== 'string') return false;
  const m = /^(\d{2}):(\d{2})$/.exec(value);
  if (!m) return false;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

// Parse a valid date string to a Date at local midnight, or null.
export function parseDateString(value) {
  if (!isValidDateString(value)) return null;
  const [y, mo, d] = value.split('-').map((x) => Number(x));
  return new Date(y, mo - 1, d);
}

// Get hour (0-23) from an HH:mm string, or fallback.
export function hourFromTimeString(value, fallback = 0) {
  if (!isValidTimeString(value)) return fallback;
  return Number(value.split(':')[0]);
}

// Add/subtract days from a date string. Returns YYYY-MM-DD.
export function addDays(dateStr, delta) {
  const base = parseDateString(dateStr) || new Date();
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + (Number(delta) || 0));
  return toDateString(d);
}

// Human friendly label for a date string, e.g. "Fri, Jul 3, 2026".
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDateLabel(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return 'Unknown date';
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return '--';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function monthLabel(year, monthIndex) {
  const safeMonth = Math.min(11, Math.max(0, Number(monthIndex) || 0));
  const safeYear = Number(year) || new Date().getFullYear();
  return `${MONTH_NAMES[safeMonth]} ${safeYear}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Build a calendar matrix for a given month. Returns array of weeks,
// each week is an array of 7 items: { dateStr } or null for blanks.
export function buildMonthGrid(year, monthIndex) {
  const safeYear = Number(year) || new Date().getFullYear();
  const safeMonth = Math.min(11, Math.max(0, Number(monthIndex) || 0));
  const first = new Date(safeYear, safeMonth, 1);
  const startWeekday = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(safeYear, safeMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ dateStr: toDateString(new Date(safeYear, safeMonth, day)), day });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
