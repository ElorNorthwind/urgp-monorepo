import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  selectCurrentUser,
} from '@urgp/client/shared';
import { useSelector } from 'react-redux';

const AccountPage = (): JSX.Element => {
  const user = useSelector(selectCurrentUser);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Учетная запись</CardTitle>
        <CardDescription>Информация о Вашей учетной записи</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <h2>
          <span className="font-bold">ID:</span> {user?.id || '0'}
        </h2>
        <h2>
          <span className="font-bold">Логин:</span> {user?.login || 'guest'}
        </h2>
        <h2>
          <span className="font-bold">ФИО:</span> {user?.fio || 'Гость'}
        </h2>
        <Button disabled className="w-full">
          Сохранить изменения (TBD)
        </Button>
      </CardContent>
    </Card>
  );
};

export { AccountPage };
