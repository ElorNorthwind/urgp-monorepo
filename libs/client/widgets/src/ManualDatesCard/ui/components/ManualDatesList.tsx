import { useManualDates } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  ScrollArea,
  Skeleton,
  useAuth,
} from '@urgp/client/shared';
import { ManualDate } from '@urgp/shared/entities';
import { ManualDateItem } from './ManualDateItem';
import { isLastDayOfMonth } from 'date-fns';

type ManualDatesListProps = {
  items?: ManualDate[];
  isLoading?: boolean;
};
const ManualDatesList = ({
  items,
  isLoading,
}: ManualDatesListProps): JSX.Element | null => {
  if (isLoading) return <Skeleton className="h-20 w-full" />;

  if (!items || items?.length === 0)
    return (
      <h1 className="bg-muted/40 w-full rounded border border-dashed p-8 text-center">
        Нет пользовательских дат
      </h1>
    );

  return (
    <>
      {items.map((i) => (
        <ManualDateItem item={i} key={i.id} />
      ))}
    </>
  );
};

export { ManualDatesList };
