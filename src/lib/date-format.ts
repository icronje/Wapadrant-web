const AFRIKAANS_MONTHS = [
  "Januarie",
  "Februarie",
  "Maart",
  "April",
  "Mei",
  "Junie",
  "Julie",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const AFRIKAANS_DAYS = [
  "Sondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrydag",
  "Saterdag",
];

export function formatAfrikaansDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const day = AFRIKAANS_DAYS[d.getDay()];
  const dateNum = d.getDate();
  const month = AFRIKAANS_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}, ${dateNum} ${month} ${year} om ${hours}:${minutes}`;
}

export function formatAfrikaansDateShort(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const dateNum = d.getDate();
  const month = AFRIKAANS_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${dateNum} ${month} ${year}`;
}

export function formatZAR(amount: number | string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "R 0,00";
  return `R ${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
