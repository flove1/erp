export function parseDuration(duration: string): number {
  const match = /^(\d+)([smhd])$/i.exec(duration);
  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case "s": return value * 1000;
      case "m": return value * 60 * 1000;
      case "h": return value * 60 * 60 * 1000;
      case "d": return value * 24 * 60 * 60 * 1000;
    }
  }
  return Number(duration) * 1000;
}