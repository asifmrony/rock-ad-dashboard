// Shared date helpers for the analytics pages.

/**
 * Converts a picked Date to a `yyyy-mm-dd` string in Bangladesh Standard Time
 * (UTC+6), which is the timezone the analytics endpoints expect.
 */
export const bdStandardTime = (pickedDate: Date): string => {
  const convertedDate = new Date(pickedDate);
  // BST is +6 hours from UTC
  const bstOffset = 6 * 60 * 60 * 1000;
  const adjustedTime = new Date(convertedDate.getTime() + bstOffset);
  const bstIsoString = adjustedTime.toISOString().replace("Z", "+06:00");
  return bstIsoString.split("T")[0];
};

/**
 * Returns a `yyyy-mm-dd` string for the start of a relative range
 * ("lastMonth" | "lastThreeMonth" | "lastSixMonth"). Any other value
 * (e.g. "today") yields the current date.
 */
export const getFilteredDate = (dateRange: string): string => {
  const currentDate = new Date();
  if (dateRange === "lastMonth") {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else if (dateRange === "lastThreeMonth") {
    currentDate.setMonth(currentDate.getMonth() - 3);
  } else if (dateRange === "lastSixMonth") {
    currentDate.setMonth(currentDate.getMonth() - 6);
  }

  // Format the date as yyyy-mm-dd (months are 0-based)
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
