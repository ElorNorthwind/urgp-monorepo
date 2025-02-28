import {
  useCurrentUserApproveTo,
  useCurrentUserSettings,
  useUserControlTo,
} from '@urgp/client/entities';
import { InfoBox } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  selectCurrentUser,
} from '@urgp/client/shared';
import { ApproveChainsTab, ChangeDirectionsForm } from '@urgp/client/widgets';
import { useSelector } from 'react-redux';

const ControlAccountPage = (): JSX.Element => {
  const user = useSelector(selectCurrentUser);
  const {
    data: approveTo,
    isLoading: isApproveToLoading,
    isFetching: isApproveToFetching,
  } = useCurrentUserApproveTo();

  const {
    data: controlTo,
    isLoading: isControlToLoading,
    isFetching: isControlToFetching,
  } = useUserControlTo();

  const {
    data: userSettings,
    isLoading: isSettingsLoading,
    isFetching: isSettingsFetching,
  } = useCurrentUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Учетная запись</CardTitle>
        <CardDescription>Информация о Вашей учетной записи</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pb-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-4 text-nowrap">
            <InfoBox label="ID:" value={user?.id} />
            <InfoBox label="Логин:" value={user?.login} />
            <InfoBox label="ФИО:" value={user?.fio} />
          </div>
          <div className="flex flex-row justify-between gap-4 text-nowrap">
            <InfoBox
              label="Управление:"
              isLoading={isSettingsLoading || isSettingsFetching}
              value={userSettings?.department}
            />
            <InfoBox
              label="Роли:"
              value={user?.controlData?.roles?.join(', ')}
            />
          </div>
          <InfoBox
            isLoading={isApproveToLoading || isApproveToFetching}
            label="Согласующие:"
            value={approveTo
              ?.filter((a) => a.value !== 0)
              ?.map((a) =>
                a.label === 'Утвердить лично' ? 'Утверждает сам' : a.label,
              )
              .join(', ')}
          />
          <InfoBox
            isLoading={isControlToLoading || isControlToFetching}
            label="Подчиненные:"
            value={controlTo
              ?.find((item) => item.value === 'controlTo')
              ?.items?.map((a) => a.label)
              .join(', ')}
          />
        </div>
        <CardFooter className="-mx-6 flex-col items-start gap-4 border-t pt-6">
          <h2 className="tracking-tigh text-2xl font-semibold leading-none">
            Отслеживать на заявки по направлениям:
          </h2>
          <ChangeDirectionsForm popoverMinWidth="39rem" className="w-full" />
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export { ControlAccountPage };
