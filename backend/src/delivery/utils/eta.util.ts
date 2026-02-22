/**
 * Formats estimated minutes into a human-readable message.
 * @param minutes Minutes until delivery
 */
export const formatETAMessage = (minutes: number): string => {
  if (minutes < 1) return "Arriving now";
  if (minutes < 60)
    return `Estimated delivery in ${Math.round(minutes)} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (remainingMinutes === 0) {
    return `Estimated delivery in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `Estimated delivery in ${hours} ${hours === 1 ? "hour" : "hours"} and ${remainingMinutes} minutes`;
};

/**
 * Adds minutes to a Date object.
 */
export const addMinutesToDate = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};
