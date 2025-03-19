import { zodResolver } from '@hookform/resolvers/zod';
import { Button, cn, Form, Skeleton } from '@urgp/client/shared';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  DirectionTypeSelector,
  useCurrentUserSettings,
  useSetCurrentUserDirections,
  useSetNotificationsSettings,
} from '@urgp/client/entities';
import { InputSkeleton } from '@urgp/client/features';
import { useEffect, useMemo } from 'react';
import { boolean, z } from 'zod';
import {
  NotificationPeriod,
  UserNotificationSettings,
  userNotificationSettingsSchema,
} from '@urgp/shared/entities';
import { CheckboxFormField, SelectFormField } from '../../FormField';

type ChangeNotificationsSettingsFormProps = {
  className?: string;
  popoverMinWidth?: string;
  disabled?: boolean;
};

const notificationPeriodOptions = [
  {
    value: NotificationPeriod.none,
    label: 'Не получать регулярные уведомления',
  },
  {
    value: NotificationPeriod.thrice,
    label: 'Три раза в день (ПН-ПТ) в 8:10, 12:10 и 16:10',
  },
  { value: NotificationPeriod.daily, label: 'Ежедневно (ПН-ПТ) в 8:15' },
  { value: NotificationPeriod.weekly, label: 'Еженедельно (ПН) в 8:00' },
];

const ChangeNotificationsSettingsForm = ({
  className,
  popoverMinWidth,
  disabled = false,
}: ChangeNotificationsSettingsFormProps): JSX.Element | null => {
  const { data: settings, isLoading: isSettingsLoading } =
    useCurrentUserSettings();

  const defaultValues = useMemo(() => {
    return (
      settings?.notifications || {
        period: NotificationPeriod.none,
        realtime: false,
      }
    );
  }, [settings, isSettingsLoading]);

  const form = useForm<UserNotificationSettings>({
    resolver: zodResolver(userNotificationSettingsSchema),
    defaultValues,
  });

  const [setNotifications, { isLoading: isMutationLoading }] =
    useSetNotificationsSettings();

  async function onSubmit(data: UserNotificationSettings) {
    setNotifications(data)
      .unwrap()
      .then(() => {
        toast.success('Настройки сохранены');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось сохранить настройки', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    form.reset(defaultValues);
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  if (isSettingsLoading) return <Skeleton className="h-8 w-full" />;

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SelectFormField
          form={form}
          options={notificationPeriodOptions}
          fieldName="period"
          label="Периодичность оповещений о делах у меня в работе"
          valueType="string"
          dirtyIndicator
        />
        <CheckboxFormField
          form={form}
          fieldName="realtime"
          label="Разрешить отправку сообщений в реальном времени"
          placeholder={
            'Мгновенные оповещения о новых поручениях, запросах пользователей и т.д.'
          }
        />
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-grow"
            disabled={
              isMutationLoading || form.formState.isDirty === false || disabled
            }
            onClick={() => {
              form.reset(defaultValues);
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={
              isMutationLoading || form.formState.isDirty === false || disabled
            }
            className="flex flex-grow flex-row gap-2"
          >
            <span>Сохранить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ChangeNotificationsSettingsForm };
