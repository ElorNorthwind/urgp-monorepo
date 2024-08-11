import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  Button,
  clearUser,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  setUser,
  useLoginMutation,
} from '@urgp/client/shared';
import { authUser, AuthUserDto } from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

type LoginMenuProps = {
  className?: string;
};

const LoginForm = ({ className }: LoginMenuProps): JSX.Element => {
  const form = useForm<AuthUserDto>({
    resolver: zodResolver(authUser),
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { redirect } = getRouteApi('/login').useSearch();
  const [login, { isLoading, isError }] = useLoginMutation();

  async function onSubmit(data: AuthUserDto) {
    login(data)
      .unwrap()
      .then((fulfilled) => {
        dispatch(setUser(fulfilled));
        navigate({ to: redirect ? redirect : '/renovation' });
      })
      .catch((rejected) =>
        toast.error('Не удалось войти', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  const onSetGuest = () => {
    dispatch(clearUser());
    navigate({ to: '/renovation' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('grid gap-4 text-center', className)}>
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className="text-left">Логин</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className=" text-left">Пароль</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Вход
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onSetGuest();
            }}
          >
            Войти как гость
          </Button>
          <div className="text-red-500">
            {isError && 'Неверный логин или пароль'}
          </div>
        </div>
      </form>
    </Form>
  );
};

export { LoginForm };
