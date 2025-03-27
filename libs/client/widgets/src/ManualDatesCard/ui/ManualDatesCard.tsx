import { useManualDates } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  ScrollArea,
  useAuth,
} from '@urgp/client/shared';
import { ManualDatesList } from './components/ManualDatesList';
import { ManualDateForm } from './components/ManualDateForm';

type ManualDatesCardProps = {
  buildingId: number;
  isOpen?: boolean;
  className?: string;
};
const ManualDatesCard = ({
  buildingId,
  isOpen = false,
  className,
}: ManualDatesCardProps): JSX.Element | null => {
  const user = useAuth();
  const {
    data: manualDates,
    isLoading: isLoadingManualDates,
    isFetching: isFetchingManualDAtes,
  } = useManualDates(buildingId, {
    skip: !buildingId,
  });

  const canEdit = user.roles.includes('admin') || user.roles.includes('editor');

  return (
    <Card
      className={cn(
        'w-detailsbar absolute bottom-0 top-0 flex flex-col',
        'transition-all ease-in-out',
        isOpen && canEdit ? 'w-detailsbar' : 'hidden w-0',
        className,
      )}
    >
      <CardHeader className="flex-shrink-0 border-b p-4">
        <CardTitle>Пользовательские даты</CardTitle>
      </CardHeader>
      <ScrollArea className="w-full flex-grow space-y-2 bg-slate-100 px-2">
        <ManualDatesList items={manualDates} />
      </ScrollArea>
      <CardFooter className="flex-shrink-0 border-t p-2">
        <ManualDateForm buildingId={buildingId} />
      </CardFooter>
    </Card>
  );
};

export { ManualDatesCard };
