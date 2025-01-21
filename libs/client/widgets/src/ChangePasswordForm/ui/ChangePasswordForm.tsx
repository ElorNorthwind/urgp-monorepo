import { zodResolver } from '@hookform/resolvers/zod';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useNavigate } from '@tanstack/react-router';
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
  selectCurrentUser,
  setUser,
  useChangePasswordMutation,
  useLoginMutation,
} from '@urgp/client/shared';
import {
  authUser,
  AuthUserDto,
  changePasswordFormValues,
  ChangeUserPasswordFormValues,
} from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type ChangePasswordFormProps = {
  className?: string;
  onSuccess?: () => void;
};

const ChangePasswordForm = ({
  className,
  onSuccess,
}: ChangePasswordFormProps): JSX.Element => {
  const form = useForm<ChangeUserPasswordFormValues>({
    resolver: zodResolver(changePasswordFormValues),
    defaultValues: {
      id: 0,
      oldPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  const user = useSelector(selectCurrentUser);
  const [changePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();

  async function onSubmit(data: ChangeUserPasswordFormValues) {
    changePassword({ ...data, id: user?.id || 0 })
      .unwrap()
      .then(() => {
        toast.success('Пароль успешно изменен');
        onSuccess && onSuccess();
      })
      .catch((rejected) =>
        toast.error('Не удалось изменить пароль', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('grid gap-4 text-center', className)}>
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className=" text-left">
                  {form.formState.errors.oldPassword ? (
                    <p className="flex justify-between truncate">
                      Текущий пароль
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.oldPassword.message}
                      </span>
                    </p>
                  ) : (
                    'Текущий пароль'
                  )}
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className=" text-left">
                  {form.formState.errors.password ? (
                    <p className="flex justify-between truncate">
                      Новый пароль
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.password.message}
                      </span>
                    </p>
                  ) : (
                    'Новый пароль'
                  )}
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className=" text-left">
                  {form.formState.errors.passwordConfirmation ? (
                    <p className="flex justify-between truncate">
                      Повторите пароль
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.passwordConfirmation.message}
                      </span>
                    </p>
                  ) : (
                    'Повторите пароль'
                  )}
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="ml-auto mt-2 px-12"
            disabled={isLoading}
          >
            Сменить пароль
          </Button>
          <div className="text-red-500">
            {isError && ((error as any).data.message as string)}
          </div>
        </div>
      </form>
    </Form>
  );
};

export { ChangePasswordForm };
