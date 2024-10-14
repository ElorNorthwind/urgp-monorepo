import {
  Button,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  selectCurrentUser,
} from '@urgp/client/shared';
import {
  approveStageForm,
  ApproveStageFormDto,
  ExtendedStage,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useApproveStage } from '../../api/stagesApi';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

type ApproveStageFormProps = {
  stage: ExtendedStage;
  className?: string;
  refetch?: () => void;
};

const initialValues = {
  approveNotes: '',
};

const approveText = {
  approved: '',
  pending: 'Ожидает подтверждения',
  rejected: 'Отклонено',
};

const ApproveStageForm = ({
  className,
  stage,
  refetch,
}: ApproveStageFormProps): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const form = useForm<ApproveStageFormDto>({
    resolver: zodResolver(approveStageForm),
    defaultValues: initialValues,
  });

  const [approveStage, { isLoading }] = useApproveStage();

  async function onSubmit(
    id: number,
    approveStatus: 'approved' | 'rejected',
    // approveNotes: string,
  ) {
    approveStage({
      id,
      approveStatus,
      approveNotes: form.getValues('approveNotes'),
    })
      .unwrap()
      .then(() => {
        approveStatus === 'approved' && refetch && refetch();
        form.reset(initialValues);
        toast.success(
          `Этап ${approveStatus === 'approved' ? 'одобрен' : 'отклонен'}`,
        );
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((rejected: any) =>
        toast.error(
          `Не удалось ${approveStatus === 'approved' ? 'одобрить' : 'отлонить'} этап`,
          {
            description: rejected.data?.message || 'Неизвестная ошибка',
          },
        ),
      );
  }

  if (
    stage.approveStatus !== 'pending' ||
    !user ||
    !(
      user.roles.includes('editor') ||
      user.roles.includes('admin') ||
      user.roles.includes('boss')
    )
  ) {
    return (
      <span
        className={cn(
          stage.approveStatus === 'rejected' && 'text-red-500',
          stage.approveStatus === 'pending' && 'text-amber-500',
        )}
      >
        {approveText[stage.approveStatus]}
      </span>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="-my-2 h-8">
          <span
            className={cn(
              //   stage.approveStatus === 'rejected' && 'text-red-500',
              stage.approveStatus === 'pending'
                ? 'text-amber-500'
                : 'text-red-500',
            )}
          >
            {approveText[stage.approveStatus]}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Утвердить этап</DialogTitle>
          <DialogDescription>
            <span>{`${stage.stageName}`}</span>{' '}
            <span>
              от {format(stage.docDate, 'dd.MM.yyyy')} № {stage.docNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(editStage ? onEditSubmit : onSubmit)}
            className={cn(
              'bg-background relative grid w-full gap-4 transition',
              className,
            )}
          >
            <FormField
              control={form.control}
              name="approveNotes"
              render={({ field }) => (
                <FormItem className="grid w-full">
                  {/* <FormLabel className="text-left">
                    {form.formState.errors.approveNotes ? (
                      <p className="flex justify-between truncate">
                        Примечания
                        <span className="w-full text-right text-xs font-light">
                          {form.formState.errors.approveNotes.message}
                        </span>
                      </p>
                    ) : (
                      'Примечания'
                    )}
                  </FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Примечания"
                      {...field}
                      name="messageContent"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="grid grid-cols-[1fr_max-content_max-content]">
          <DialogClose asChild>
            <Button variant={'outline'}>Отмена</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={'default'}
              className="bg-rose-800 hover:bg-rose-700"
              onClick={() => onSubmit(stage.id, 'rejected')}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              <span>Отклонить</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={'default'}
              className=""
              autoFocus
              onClick={() => onSubmit(stage.id, 'approved')}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              <span>Утвердить</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ApproveStageForm };
