/**
 * Calculates an ISO date cutoff string (YYYY-MM-DD) subtracted from the current UTC time.
 * @param {'day'|'week'|'month'|'year'} duration
 * @returns {string} Cutoff date in YYYY-MM-DD format
 */
export function getStartDate(duration) {
  const now = new Date();

  switch (duration) {
    case "day":
      now.setUTCDate(now.getUTCDate() - 1);
      break;
    case "week":
      now.setUTCDate(now.getUTCDate() - 7);
      break;
    case "month":
      now.setUTCMonth(now.getUTCMonth() - 1);
      break;
    case "year":
      now.setUTCFullYear(now.getUTCFullYear() - 1);
      break;
    default:
      throw new Error(
        `Unsupported duration: "${duration}". Valid values: day, week, month, year.`,
      );
  }

  return now.toISOString().split("T")[0];
}
