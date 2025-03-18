import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  useCurrentUserSettings,
  useSetNotificationsSettings,
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
import { useEffect } from 'react';
import { toast } from 'sonner';

const ControlNotificationsSettingsPage = (): JSX.Element => {
  const {
    data: userSettings,
    isLoading,
    isFetching,
  } = useCurrentUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки оповещений</CardTitle>
        <CardDescription>Мои оповещения через Telegram-бота</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ScrollArea className={cn('-m-3 h-full')}>
          <ChangeNotificationsSettingsForm className="m-4" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ControlNotificationsSettingsPage;
