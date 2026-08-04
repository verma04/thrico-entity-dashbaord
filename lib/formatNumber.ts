export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  // Round to max 2 decimal places for floats
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
}
