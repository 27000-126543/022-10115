export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getWeekday(date: string | Date = new Date()): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[new Date(date).getDay()];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getRankColor(rank: number): string {
  if (rank === 1) return '#FFB300';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return '#A38F99';
}

export function getTrendIcon(trend: 'up' | 'down' | 'flat'): string {
  if (trend === 'up') return '📈';
  if (trend === 'down') return '📉';
  return '➡️';
}

export function getPriorityLabel(priority: 'high' | 'medium' | 'low'): { text: string; color: string } {
  switch (priority) {
    case 'high':
      return { text: '紧急', color: 'tag-error' };
    case 'medium':
      return { text: '重要', color: 'tag-warning' };
    default:
      return { text: '普通', color: 'tag-secondary' };
  }
}
