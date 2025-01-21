import {
  DirectionTypeSelector,
  useCurrentUserApprovers,
} from '@urgp/client/entities';
import { InfoBox } from '@urgp/client/features';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  selectCurrentUser,
  Separator,
} from '@urgp/client/shared';
import { ChangeDirectionsForm } from '@urgp/client/widgets';
import { useSelector } from 'react-redux';

const ControlAccountPage = (): JSX.Element => {
  const user = useSelector(selectCurrentUser);
  const {
    data: approvers,
    isLoading: isApproversLoading,
    isFetching: isApproversFetching,
  } = useCurrentUserApprovers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Учетная запись</CardTitle>
        <CardDescription>Информация о Вашей учетной записи</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* <h2 className="text-xl">Общие сведения</h2> */}
        {/* <Separator /> */}
        <div className="flex flex-row justify-between gap-8 text-nowrap">
          <InfoBox label="ID:" value={user?.id} />
          <InfoBox label="Логин:" value={user?.login} />
          <InfoBox label="ФИО:" value={user?.fio} />
        </div>
        <InfoBox label="Роли:" value={user?.controlData?.roles.join(', ')} />
        <InfoBox
          label="Согласующие по заявкам:"
          value={approvers?.cases
            .map((a) =>
              a.label === 'Утвердить лично' ? 'Утверждает сам' : a.label,
            )
            .join(', ')}
        />
        <InfoBox
          label="Согласующие по операциям:"
          value={approvers?.operations
            .map((a) =>
              a.label === 'Утвердить лично' ? 'Утверждает сам' : a.label,
            )
            .join(', ')}
        />
        <ChangeDirectionsForm />
      </CardContent>
    </Card>
  );
};

export { ControlAccountPage };
