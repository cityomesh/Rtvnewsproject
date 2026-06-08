export function formatISOToDateTimeLocal(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // January is 0!
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }