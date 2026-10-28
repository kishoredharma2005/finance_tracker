export const pad = (n) => String(n).padStart(2, '0');
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && toISO(parseISO(s)) === s;
export const monthKey = (s) => s.slice(0, 7);
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const monthLabel = (key) => { const [y, m] = key.split('-').map(Number); return `${MONTHS[m - 1]} ${y}`; };
export const shortMonth = (key) => MONTHS[Number(key.split('-')[1]) - 1].slice(0, 3);
export const shiftMonth = (key, delta) => { const [y, m] = key.split('-').map(Number); const d = new Date(y, m - 1 + delta, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
export const weekRange = () => {
  const now = new Date();
  const s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); // Monday
  const e = new Date(s); e.setDate(s.getDate() + 6);
  return [toISO(s), toISO(e)];
};
export const sum = (list, type) => list.filter((t) => t.type === type).reduce((a, t) => a + t.amount, 0);
export const money = (n) => {
  const [i, d] = Number(n).toFixed(2).split('.');
  return '₹' + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d === '00' ? '' : '.' + d);
};
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isPhone = (s) => /^[6-9]\d{9}$/.test(s);
