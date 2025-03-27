import { useDeleteManualDate, useManualDates } from '@urgp/client/entities';
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
import { ManualDate } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { ConfirmationButton } from '../../../ConfirmationButton';
import { toast } from 'sonner';

type ManualDateItemProps = {
  item: ManualDate;
  className?: string;
};
const ManualDateItem = ({
  item,
  className,
}: ManualDateItemProps): JSX.Element | null => {
  const user = useAuth();
  const canEdit = user.roles.includes('admin') || user.roles.includes('editor');
  const [deleteDate, { isLoading }] = useDeleteManualDate();

  return (
    <Card className="relative overflow-hidden">
      <div className="bg-muted-foreground/5 text-thin truncate p-2 text-xs">
        {item?.type}
      </div>
      <div className="flex flex-row gap-2 divide-x [&>*]:px-2 [&>*]:py-1">
        <div className="flex-grow truncate">
          {'№ ' + (item?.documents || ' б/н')}
        </div>
        <div className="flex-shrink-0">
          {format(item?.controlDate, 'dd.MM.yyyy')}
        </div>
      </div>
      {item?.notes && (
        <div className="border-t p-2 text-xs font-light">{item?.notes}</div>
      )}
      {canEdit && item?.id && (
        <div className="bg-background absolute right-2 top-1 rounded-full">
          <ConfirmationButton
            onAccept={() => {
              deleteDate(item.id)
                .unwrap()
                .then(() => {
                  toast.success('Дата удалена');
                })
                .catch((rejected: any) =>
                  toast.error('Не удалось удалить дату', {
                    description: rejected.data?.message || 'Неизвестная ошибка',
                  }),
                );
            }}
            label="Удалить?"
          />
        </div>
      )}
    </Card>
  );
};

export { ManualDateItem };
