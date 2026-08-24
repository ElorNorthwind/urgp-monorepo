import { useDmUpdateStream, useTriggerDmUpdate } from '@urgp/client/entities';
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

const DmUpdateCard = ({ className }: CardProps): JSX.Element | null => {
  const [triggerDmUpdate, { isLoading: isDmMudationTriggering }] =
    useTriggerDmUpdate();
  const { data: dmStatus } = useDmUpdateStream();

  const i = useVksAbility();

  if (i.cannot('read', 'VksDepartmentReport')) return null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        disabled={
          isDmMudationTriggering || dmStatus?.state === UPDATE_STATES['RUNNING']
        }
        variant="outline"
        role="button"
        className="flex w-full gap-2"
        onClick={(e) => {
          e.preventDefault();
          triggerDmUpdate()
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
        <span>Обновить данные Документоконтроля</span>
      </Button>

      <Card className="flex flex-row items-center justify-start gap-2 px-4 py-2">
        {dmStatus?.state === UPDATE_STATES['RUNNING'] ? (
          <>
            <ProgressCircle
              value={dmStatus?.progress || 0}
              units="%"
              variant="gauge"
              className="text-blue-600"
            />
            <div className="text-sm">
              <div>{dmStatus?.message || 'Загружаем данные...'}</div>
              <div className="text-muted-foreground">
                {dmStatus?.startedAt
                  ? 'Обновление запущено: ' +
                    format(dmStatus?.startedAt, 'dd.mm.yyyy HH:mm')
                  : 'Дата запуска обновления не доступна'}
              </div>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-row gap-2">
            <Calendar className="size-5 flex-shrink-0" />
            <p>
              {dmStatus?.completetAt
                ? 'Последнее обновление: ' +
                  format(dmStatus?.completetAt, 'dd.mm.yyyy HH:mm')
                : 'Дата последнего обновления не доступна'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export { DmUpdateCard };
