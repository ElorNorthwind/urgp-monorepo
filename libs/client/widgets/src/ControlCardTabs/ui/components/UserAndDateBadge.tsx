import { cn } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';

import { directionCategoryStyles } from '@urgp/client/entities';
import { format } from 'date-fns';

type UserAndDateBadgeProps = {
  user: CaseFull['author'];
  date?: string | null;
  className?: string;
};

const UserAndDateBadge = (props: UserAndDateBadgeProps): JSX.Element | null => {
  const { user, date, className } = props;

  if (!user || !date) return null;

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-3 border-b text-xs leading-none',
      )}
    >
      <div
        className={cn(
          'size-3 rounded-full',
          directionCategoryStyles?.[user?.department || '']?.iconStyle ||
            'bg-slate-500',
        )}
      />
      <div className="flex flex-col">
        <p className="w-full truncate">{user?.fio}</p>
        <p className="text-muted-foreground/80 w-full truncate">
          {format(date, 'dd.MM.yyyy')}
        </p>
      </div>
    </div>
  );
};

export { UserAndDateBadge };
