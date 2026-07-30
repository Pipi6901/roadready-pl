/** "20:00" -> "8:00 PM". */
export function formatTime(hhmm: string): string {
  const [rawH, rawM] = hhmm.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
