import {
  Button,
  Checkbox,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  selectCurrentUser,
  Textarea,
} from '@urgp/client/shared';
import {
  controlStageCreateFormValues,
  ControlStageCreateFormValuesDto,
  CreateMessageFormValuesDto,
  CreateStageFormValuesDto,
  ExtendedMessage,
  Message,
  messageCreateFormValues,
  UpdateMessageFormValuesDto,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useCreateStage } from '../../api/operationsApi';

type CreateStageFormProps = {
  caseId: number;
  className?: string;
  // editMessage?: Message | null;
  // setEditMessage?: React.Dispatch<React.SetStateAction<ExtendedMessage | null>>;
};

const emptyStage = {
  type: undefined,
  doneDate: undefined,
  num: undefined,
  description: undefined,
  approver: undefined,
};

const CreateStageForm = ({
  caseId,
  className,
  // editMessage,
  // setEditMessage,
}: CreateStageFormProps): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const form = useForm<ControlStageCreateFormValuesDto>({
    resolver: zodResolver(controlStageCreateFormValues),
    defaultValues: emptyStage,
  });

  const [createStage, { isLoading }] = useCreateStage();

  async function onSubmit(data: ControlStageCreateFormValuesDto) {
    createStage({ ...data, caseId })
      .unwrap()
      .then(() => {
        form.reset(emptyStage);
        toast.success('Этап добавлен');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось создать этап', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  // async function onEditSubmit(data: UpdateMessageFormValuesDto) {
  //   updateMessage({ ...data, id: editMessage?.id || 0 })
  //     .unwrap()
  //     .then(() => {
  //       refetch && refetch();
  //       form.reset({ messageContent: '', validUntil: null });
  //       setEditMessage && setEditMessage(null);
  //       toast.success('Сообщение изменено');
  //     })
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     .catch((rejected: any) =>
  //       toast.error('Не удалось изменить сообщение', {
  //         description: rejected.data?.message || 'Неизвестная ошибка',
  //       }),
  //     );
  // }

  // useEffect(() => {
  //   if (editMessage) {
  //     form.reset(editMessage);
  //   }
  // }, [editMessage, form]);

  // if (
  //   !user ||
  //   (!user.roles.includes('user') &&
  //     !user.roles.includes('editor') &&
  //     !user.roles.includes('admin') &&
  //     !user.roles.includes('boss'))
  // ) {
  //   return null;
  // }

  //   return (
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
  //         {form.formState.errors.messageContent && (
  //           <span className="pointer-events-none absolute right-4 top-4 w-full text-right text-xs font-light text-rose-600">
  //             {form.formState.errors.messageContent.message}
  //           </span>
  //         )}
  //         <FormField
  //           control={form.control}
  //           name="messageContent"
  //           render={({ field }) => (
  //             <FormItem className="grid">
  //               {/* <FormLabel className="text-left">
  //                 {form.formState.errors.messageContent ? (
  //                   <p className="flex justify-between truncate">
  //                     Текст сообщения
  //                     <span className="w-full text-right text-xs font-light">
  //                       {form.formState.errors.messageContent.message}
  //                     </span>
  //                   </p>
  //                 ) : (
  //                   'Текст сообщения'
  //                 )}
  //               </FormLabel> */}
  //               <FormControl>
  //                 <Textarea
  //                   placeholder="Введите сообщение"
  //                   {...field}
  //                   name="messageContent"
  //                 />
  //               </FormControl>
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="needsAnswer"
  //           render={({ field }) => (
  //             <FormItem className="flex flex-row items-start space-x-2 space-y-0">
  //               <FormControl>
  //                 <Checkbox
  //                   id="needsAnswer"
  //                   checked={field.value === true}
  //                   onCheckedChange={(checked) => {
  //                     field.onChange(checked);
  //                     return checked;
  //                   }}
  //                 />
  //               </FormControl>
  //               <FormLabel className="flex-1 font-normal" htmlFor="needsAnswer">
  //                 На контроль
  //               </FormLabel>
  //             </FormItem>
  //           )}
  //         />

  //         {editMessage && setEditMessage ? (
  //           <div className="flex w-full items-center justify-between gap-2">
  //             <Button type="submit" className="flex-1" disabled={isUpdateLoading}>
  //               Сохранить
  //             </Button>
  //             <Button
  //               className="flex-1"
  //               type="button"
  //               variant={'outline'}
  //               disabled={isUpdateLoading}
  //               onClick={() => {
  //                 setEditMessage(null);
  //                 form.reset({
  //                   messageContent: '',
  //                   validUntil: null,
  //                   needsAnswer: false,
  //                 });
  //               }}
  //             >
  //               Отмена
  //             </Button>
  //           </div>
  //         ) : (
  //           <Button type="submit" className="w-full" disabled={isLoading}>
  //             Отправить сообщение
  //           </Button>
  //         )}
  //       </form>
  //     </Form>
  //   );
  return null;
};

export { CreateStageForm };
