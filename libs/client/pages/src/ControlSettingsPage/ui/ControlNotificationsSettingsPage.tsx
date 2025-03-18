import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  useCurrentUserSettings,
  useSetNotificationsSettings,
  useUserTelegramStatus,
} from '@urgp/client/entities';
import {
  Accordion,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  ScrollArea,
  Skeleton,
} from '@urgp/client/shared';
import {
  AuthorFilter,
  CaseTypesFilter,
  DepartmentsFilter,
  DirectionsFilter,
  RelevantFilter,
  StatusFilter,
  ViewStatusFilter,
  PendingActionsFilter,
  ChangeNotificationsSettingsForm,
} from '@urgp/client/widgets';
import { UserNotificationSettings } from '@urgp/shared/entities';
import { Send } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ControlNotificationsSettingsPage = (): JSX.Element => {
  const {
    data: telegramStatus,
    isLoading,
    isFetching,
  } = useUserTelegramStatus();

  const botName = import.meta.env.DEV ? 'urgp_dev_bot' : 'urgp_bot';

  // https://t.me/urgp_bot?start=cef2b525-35d0-4c93-a901-2dbe906b51fe
  // tg://resolve?domain=urgp_bot&start=cef2b525-35d0-4c93-a901-2dbe906b51fe

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Настройки оповещений</CardTitle>
        <CardDescription>Мои оповещения через Telegram-бота</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        {!telegramStatus?.connected &&
          (isLoading || isFetching ? (
            <Skeleton className="m-3 h-8" />
          ) : (
            <Button
              role="button"
              className="mb-6 flex w-full flex-grow flex-row gap-2"
              disabled={telegramStatus?.connected}
              onClick={() =>
                window.open(
                  `https://t.me/${botName}?start=${telegramStatus?.token}`,
                )
              }
            >
              <Send className="size-5 flex-shrink-0" />
              <p>
                {telegramStatus?.connected
                  ? 'Telegram-бот уже подключен!'
                  : 'Подключить Telegram-бота'}
              </p>
            </Button>
          ))}

        <ChangeNotificationsSettingsForm
          className=""
          disabled={isLoading || isFetching || !telegramStatus?.connected}
        />
      </CardContent>
    </Card>
  );
};

export default ControlNotificationsSettingsPage;
