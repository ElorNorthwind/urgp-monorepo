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
import { useSelector } from 'react-redux';

const EquityAccountPage = (): JSX.Element => {
  const user = useSelector(selectCurrentUser);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Учетная запись</CardTitle>
        <CardDescription>Информация о Вашей учетной записи</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pb-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-4 whitespace-nowrap text-nowrap">
            <InfoBox label="ID:" value={user?.id} />
            <InfoBox label="Логин:" value={user?.login} />
            <InfoBox label="ФИО:" value={user?.fio} />
          </div>
        </div>
        <CardFooter className="-mx-6 flex-col items-start gap-4 border-t pt-6"></CardFooter>
      </CardContent>
    </Card>
  );
};

export default EquityAccountPage;
