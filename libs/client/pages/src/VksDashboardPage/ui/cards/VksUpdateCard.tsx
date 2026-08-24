import {
  useDmUpdateStream,
  useTriggerDmUpdate,
  useTriggerVksUpdate,
  useVksUpdateStream,
} from '@urgp/client/entities';
import {
  Button,
  Card,
  ProgressCircle,
  cn,
  useVksAbility,
} from '@urgp/client/shared';
import { UPDATE_STATES } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type CardProps = {
  className?: string;
};

const VksUpdateCard = ({ className }: CardProps): JSX.Element | null => {
  const [triggerUpdate, { isLoading: isMudationTriggering }] =
    useTriggerVksUpdate();
  const { data: status } = useVksUpdateStream();

  const i = useVksAbility();

  if (i.cannot('read', 'VksDepartmentReport')) return null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        disabled={
          isMudationTriggering || status?.state === UPDATE_STATES['RUNNING']
        }
        variant="outline"
        role="button"
        className="flex w-full gap-2"
        onClick={(e) => {
          e.preventDefault();
          triggerUpdate()
            .unwrap()
            .then(() => {
              toast.success('Обновление запущено');
            })
            .catch((err: any) =>
              toast.error(
                'Не удалось запустить обновление: ' + err?.data?.message ||
                  'Неизвестная ошибка',
              ),
            );
        }}
      >
        <RefreshCw className="size-4 flex-shrink-0" />
        <span>Обновить данные по ВКС</span>
      </Button>

      <Card className="flex flex-row items-center justify-start gap-2 px-4 py-2">
        {status?.state === UPDATE_STATES['RUNNING'] ? (
          <>
            <ProgressCircle
              value={status?.progress || 0}
              units="%"
              variant="gauge"
              className="text-blue-600"
            />
            <div className="text-sm">
              <div>{status?.message || 'Загружаем данные...'}</div>
              <div className="text-muted-foreground">
                {status?.startedAt
                  ? 'Обновление запущено: ' +
                    format(status?.startedAt, 'dd.mm.yyyy HH:mm')
                  : 'Дата запуска обновления не доступна'}
              </div>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-row gap-2">
            <Calendar className="size-5 flex-shrink-0" />
            <p>
              {status?.completetAt
                ? 'Последнее обновление: ' +
                  format(status?.completetAt, 'dd.mm.yyyy HH:mm')
                : 'Дата последнего обновления не доступна'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export { VksUpdateCard };
