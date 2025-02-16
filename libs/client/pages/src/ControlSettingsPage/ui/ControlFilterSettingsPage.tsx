import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  useCurrentUserSettings,
  useSetCurrentUserCaseFilter,
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
} from '@urgp/client/widgets';
import { CasesPageFilter } from '@urgp/shared/entities';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ControlFilterSettingsPage = (): JSX.Element => {
  const {
    data: userSettings,
    isLoading,
    isFetching,
  } = useCurrentUserSettings();

  const [setFilter, { isLoading: isMudationLoading }] =
    useSetCurrentUserCaseFilter();

  const navigate = useNavigate({
    from: '/control/settings/filter',
  });

  const search = getRouteApi(
    '/control/settings/filter',
  ).useSearch() as CasesPageFilter;

  useEffect(() => {
    navigate({
      search: () => userSettings?.casesFilter,
    });
  }, [userSettings?.casesFilter, isLoading, isFetching]);

  const isDirty =
    JSON.stringify(userSettings?.casesFilter || {}) !==
    JSON.stringify(search || {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрый фильтр</CardTitle>
        <CardDescription>Мои условия поиска заявок</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ScrollArea className={cn('-m-3 h-full')}>
          <div className="m-3 flex h-full flex-col gap-2">
            {/* <span>{JSON.stringify(userSettings?.casesFilter || {})}</span>
            <span>{JSON.stringify(search || {})}</span>
            <span>{isDirty ? 'Dirty' : 'Clean'}</span> */}
            {/* <QueryFilter
              className="h-8 flex-shrink-0"
            />
            <NumberFilter
              className="h-8 flex-shrink-0"
            />
            <DueDateFilter
              className="flex-shrink-0"
            /> */}
            <AuthorFilter className="h-8 flex-shrink-0" />
            <RelevantFilter className="h-8 flex-shrink-0" />
            <Accordion type="multiple" defaultValue={['departments']}>
              <DepartmentsFilter variant="accordion" />
              <StatusFilter variant="accordion" />
              <DirectionsFilter variant="accordion" />
              <CaseTypesFilter variant="accordion" />
              <ViewStatusFilter variant="accordion" />
              <PendingActionsFilter variant="accordion" />
            </Accordion>
            {isDirty && (
              <Button
                role="button"
                disabled={isMudationLoading}
                className="ml-auto px-6"
                onClick={() => {
                  setFilter(search)
                    .unwrap()
                    .then(() => {
                      toast.success('Изменения сохранены');
                    })
                    .catch((rejected: any) =>
                      toast.error('Не удалось сохранить изменения', {
                        description:
                          rejected.data?.message || 'Неизвестная ошибка',
                      }),
                    );
                }}
              >
                Сохранить изменения
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export { ControlFilterSettingsPage };
