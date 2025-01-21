import { useCurrentUserApprovers } from '@urgp/client/entities';
import {
  Accordion,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  ScrollArea,
  selectCurrentUser,
} from '@urgp/client/shared';
import {
  CaseTypesFilter,
  DepartmentsFilter,
  DirectionsFilter,
  DueDateFilter,
  NumberFilter,
  QueryFilter,
  StatusFilter,
  ViewStatusFilter,
} from '@urgp/client/widgets';
import { useSelector } from 'react-redux';

const ControlFilterSettingsPage = (): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройка личного фильтра</CardTitle>
        <CardDescription>Мои условия быстрого поиска</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ScrollArea className={cn('h-full')}>
          <div className="flex h-full flex-col gap-2">
            <QueryFilter
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
            />
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export { ControlFilterSettingsPage };
