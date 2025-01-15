import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectCaseFormState,
  selectCaseFormValues,
  selectEditCase,
  setCaseFormState,
  setCaseFormValuesEmpty,
  setCaseFormValuesFromDto,
  setEditCase,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCaseForm } from './CreateCaseForm';
import { useCurrentUserApprovers } from '../../../../classificators';
import { useForm } from 'react-hook-form';
import {
  caseFormValuesDto,
  CaseFormValuesDto,
  CaseUpdateDto,
} from '@urgp/shared/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { use } from 'passport';
import { useEffect, useState } from 'react';
import { ConfirmationAlertDialog } from '@urgp/client/features';
import { useUpdateCase } from '../../../api/casesApi';
import { toast } from 'sonner';
import { set } from 'date-fns';

type CreateCaseDialogProps = {
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateCaseDialog = ({
  className,
}: CreateCaseDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApprovers();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [updateCase] = useUpdateCase();

  const formState = useSelector(selectCaseFormState);
  const isEdit = formState === 'edit';
  const emptyValues = useSelector(selectCaseFormValues);
  const defaultValues = {
    ...emptyValues,
    approverId: emptyValues?.approverId || approvers?.cases?.[0]?.value,
  };
  const isMobile = useIsMobile();

  const form = useForm<CaseFormValuesDto>({
    resolver: zodResolver(caseFormValuesDto),
    defaultValues,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    form.reset(defaultValues);
  }, [formState]);

  const title = isEdit ? 'Изменить заявку' : 'Добавить заявку';
  const subTitle = isEdit
    ? 'Внесите данные для создания дела'
    : 'Внесите нужные правки по делу';
  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;
  const onOpenChange = (open: boolean) => {
    if (open === false) {
      if (form.formState.isDirty) {
        formState === 'edit'
          ? setConfirmationOpen(true)
          : dispatch(setCaseFormState('close')) &&
            dispatch(
              setCaseFormValuesFromDto({ ...form.getValues(), saved: true }),
            );
      } else {
        dispatch(setCaseFormState('close'));
      }
    }
  };

  const Wrapper = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  return (
    <Wrapper open={formState !== 'close'} onOpenChange={onOpenChange}>
      <Content
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          isMobile
            ? 'w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]'
            : `w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`,
        )}
      >
        <Header className="mb-2 text-left">
          <Title>{title}</Title>
          <Description>{subTitle}</Description>
        </Header>
        <CreateCaseForm
          form={form}
          className={className}
          popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
        />
      </Content>
      <ConfirmationAlertDialog
        title={'Сохранить изменения?'}
        description={'В дело были внесены изменения.'}
        confirmText={'Сохранить'}
        cancelText={'Сбросить'}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        onCancel={() => {
          dispatch(setCaseFormValuesEmpty());
          dispatch(setCaseFormState('close'));
        }}
        onConfirm={() =>
          form.handleSubmit((data) => {
            updateCase({
              ...data,
              class: 'control-incident',
            } as CaseUpdateDto)
              .unwrap()
              .then(() => {
                dispatch(setCaseFormValuesEmpty());
                dispatch(setCaseFormState('close'));
                toast.success('Заявка изменена');
              })
              .catch((rejected: any) => {
                dispatch(setCaseFormValuesEmpty());
                dispatch(setCaseFormState('close'));
                toast.error('Не удалось изменить заявку', {
                  description: rejected.data?.message || 'Неизвестная ошибка',
                });
              });
          })()
        }
      />
    </Wrapper>
  );
};

export { CreateCaseDialog };
