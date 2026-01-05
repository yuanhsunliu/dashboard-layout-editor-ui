import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff <= 7) {
    return formatDistanceToNow(date, { addSuffix: true, locale: zhTW });
  }
  return format(date, 'yyyy/MM/dd', { locale: zhTW });
}
