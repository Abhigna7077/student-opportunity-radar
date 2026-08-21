/**
 * Calculates human-readable deadline status relative to the current date.
 * 
 * @param {string|null} deadlineISO - Standard ISO-8601 date string
 * @param {string|null} rawDeadline - Fallback raw deadline string
 * @returns {string} Relative status ("Due today", "1 day left", "X days left", "Deadline passed", "Deadline unavailable")
 */
export function calculateDeadlineStatus(deadlineISO, rawDeadline) {
  if (deadlineISO) {
    const deadlineDate = new Date(deadlineISO);
    if (!isNaN(deadlineDate.getTime())) {
      const now = new Date();
      const refMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const deadlineMidnight = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
      const diffDays = Math.round((deadlineMidnight.getTime() - refMidnight.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return 'Deadline passed';
      if (diffDays === 0) return 'Due today';
      if (diffDays === 1) return '1 day left';
      return `${diffDays} days left`;
    }
  }

  if (rawDeadline && typeof rawDeadline === 'string' && rawDeadline.trim()) {
    return rawDeadline;
  }

  return 'Deadline unavailable';
}
