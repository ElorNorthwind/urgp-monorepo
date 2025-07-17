import { Button, cn } from '@urgp/client/shared';
import { BookmarkCheck, Eye, EyeOff, SquarePlus, X } from 'lucide-react';
import {
  CaseFull,
  EquityObject,
  EquityOperationLogItem,
  ViewStatus,
} from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import {
  CreateEquityOperationButton,
  useMarkReminderAsWatched,
  useMarkReminders,
} from '@urgp/client/entities';
import { se } from 'date-fns/locale';
type SelectedEquityObjectsActionBarProps = {
  selected?: Row<EquityObject>[] | Row<EquityOperationLogItem>[];
  className?: string;
};

const SelectedEquityObjectsActionBar = ({
  selected = [],
  className,
}: SelectedEquityObjectsActionBarProps): JSX.Element | null => {
  if (!selected || selected?.length === 0) return null;

  return (
    <div
      className={cn(
        'bg-background absolute bottom-0 rounded-tr-lg border-r border-t p-1',
        'flex flex-row items-center gap-2',
        className,
      )}
    >
      <div className="px-2">{`Выбрано: ${selected?.length || 0}`}</div>

      <CreateEquityOperationButton
        objectId={selected.map((s) => s.original?.id)}
        className="flex-shrink-0 px-2"
        label={'Добавить этапы'}
        disabled={selected?.length > 100}
        variant={'ghost'}
      />
    </div>
  );
};

export { SelectedEquityObjectsActionBar };
