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
  CaseTypesFilter,
  DepartmentsFilter,
  DirectionsFilter,
  StatusFilter,
  ViewStatusFilter,
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
        <ScrollArea className={cn('h-full')}>
          <div className="flex h-full flex-col gap-2">
            {/* <span>{JSON.stringify(userSettings?.casesFilter || {})}</span>
            <span>{JSON.stringify(search || {})}</span>
            <span>{isDirty ? 'Dirty' : 'Clean'}</span> */}
            {/* <QueryFilter
              className="h-8 flex-shrink-0"
              route="/control/settings/filter"
            />
            <NumberFilter
              className="h-8 flex-shrink-0"
              route="/control/settings/filter"
            />
            <DueDateFilter
              className="flex-shrink-0"
              route="/control/settings/filter"
            /> */}
            <Accordion type="multiple" defaultValue={['departments']}>
              <DepartmentsFilter
                variant="accordion"
                route="/control/settings/filter"
              />
              <StatusFilter
                variant="accordion"
                route="/control/settings/filter"
              />
              <DirectionsFilter
                variant="accordion"
                route="/control/settings/filter"
              />
              <CaseTypesFilter
                variant="accordion"
                route="/control/settings/filter"
              />
              <ViewStatusFilter
                variant="accordion"
                route="/control/settings/filter"
              />
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
