import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@urgp/client/shared';
import { ChangePasswordForm } from '@urgp/client/widgets';

const ChangePasswordPage = (): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сменить пароль</CardTitle>
        <CardDescription>
          Введите текущий пароль и придумайте новый
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
};

export default ChangePasswordPage;
