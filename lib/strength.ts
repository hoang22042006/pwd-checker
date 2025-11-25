
export type Level = 0|1|2|3|4;
export const levelLabels = ["Rất yếu","Yếu","Trung bình","Mạnh","Rất mạnh"] as const;

export function analyze(pw: string){
  const reasons: string[] = [];
  if (!pw) return { score: 0 as Level, reasons, label: "" };
  const len = pw.length, lower=/[a-z]/.test(pw), upper=/[A-Z]/.test(pw), num=/[0-9]/.test(pw), spec=/[^A-Za-z0-9]/.test(pw);
  let score: Level = 0;
  if (len >= 12) score += 1; else reasons.push("Nên dài ≥ 12 ký tự.");
  if (len >= 16) score += 1;
  if (len < 8) { score = 0; reasons.push("Quá ngắn (<8 ký tự)."); }
  const kinds = [lower, upper, num, spec].filter(Boolean).length;
  if (kinds >= 4) score += 2; else if (kinds === 3) score += 1;
  if (!lower) reasons.push("Thiếu chữ thường (a-z).");
  if (!upper) reasons.push("Thiếu chữ hoa (A-Z).");
  if (!num) reasons.push("Thiếu chữ số (0-9).");
  if (!spec) reasons.push("Thiếu ký tự đặc biệt (!@#$...).");
  if (score > 4) score = 4;
  const label = levelLabels[score];
  return { score, reasons, label };
}
