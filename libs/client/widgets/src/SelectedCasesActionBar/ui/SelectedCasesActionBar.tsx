import { Button, cn } from '@urgp/client/shared';
import { BookmarkCheck, Eye, EyeOff } from 'lucide-react';
import { CaseFull, ViewStatus } from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import {
  useMarkReminderAsWatched,
  useMarkReminders,
} from '@urgp/client/entities';
type SelectedCaseActionBarProps = {
  selected?: Row<CaseFull>[];
  className?: string;
};

const SelectedCasesActionBar = ({
  selected = [],
  className,
}: SelectedCaseActionBarProps): JSX.Element | null => {
  if (!selected || selected?.length === 0) return null;
  const [mark, { isLoading: isMarkLoading }] = useMarkReminders();
  const [markAsWatched, { isLoading: isMarkAsWatchedLoading }] =
    useMarkReminderAsWatched();

  const upwatchedIds = selected
    .filter((c) => c.original.viewStatus === ViewStatus.unwatched)
    .map((c) => c.original.id);

  const watchedIds = selected
    .filter((c) => c.original.viewStatus !== ViewStatus.unwatched)
    .map((c) => c.original.id);

  const unseenIds = selected
    .filter(
      (c) =>
        c.original.viewStatus === ViewStatus.new ||
        c.original.viewStatus === ViewStatus.changed,
    )
    .map((c) => c.original.id);

  return (
    <div
      className={cn(
        'bg-background absolute bottom-0 border-r border-t p-2',
        'flex flex-row gap-2',
        className,
      )}
    >
      {upwatchedIds.length > 0 && (
        <Button
          role="button"
          variant="ghost"
          className="flex flex-row gap-2"
          onClick={() => markAsWatched(upwatchedIds)}
          disabled={isMarkAsWatchedLoading}
        >
          <Eye className="size-4 flex-shrink-0" />
          <span>Отслеживать:</span>
          <span className="font-semibold">{upwatchedIds.length}</span>
        </Button>
      )}
      {watchedIds.length > 0 && (
        <Button
          role="button"
          variant="ghost"
          className="flex flex-row gap-2"
          onClick={() => mark({ mode: 'done', case: watchedIds })}
          disabled={isMarkLoading}
        >
          <EyeOff className="size-4 flex-shrink-0" />
          <span>Перестать отслеживать:</span>
          <span className="font-semibold">{watchedIds.length}</span>
        </Button>
      )}
      {unseenIds.length > 0 && (
        <Button
          role="button"
          variant="ghost"
          className="flex flex-row gap-2"
          onClick={() => mark({ mode: 'seen', case: unseenIds })}
          disabled={isMarkLoading}
        >
          <BookmarkCheck className="size-4 flex-shrink-0" />
          <span>Пометить как отсмотренное:</span>
          <span className="font-semibold">{unseenIds.length}</span>
        </Button>
      )}
    </div>
  );
};

export { SelectedCasesActionBar };
