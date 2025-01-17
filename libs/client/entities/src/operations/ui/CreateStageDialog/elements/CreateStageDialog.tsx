import {
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  selectStageFormState,
  selectStageFormValues,
  setStageFormState,
  setStageFormValuesEmpty,
  setStageFormValuesFromDto,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useIsMobile,
} from '@urgp/client/shared';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  controlStageFormValuesDto,
  ControlStageFormValuesDto,
  ControlStageUpdateDto,
} from '@urgp/shared/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmationAlertDialog } from '@urgp/client/features';
import { toast } from 'sonner';
import { CreateStageForm } from './CreateStageForm';
import {
  useCurrentUserApprovers,
  useUpdateControlStage,
} from '@urgp/client/entities';

type CreateStageDialogProps = {
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateStageDialog = ({
  className,
}: CreateStageDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApprovers();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [updateStage] = useUpdateControlStage();

  const emptyValues = useSelector(selectStageFormValues);
  const formState = useSelector(selectStageFormState);
  const isEdit = formState === 'edit';
  const defaultValues = {
    ...emptyValues,
    approverId: emptyValues?.approverId || approvers?.operations?.[0]?.value,
  };
  const isMobile = useIsMobile();

  const form = useForm<ControlStageFormValuesDto>({
    resolver: zodResolver(controlStageFormValuesDto),
    defaultValues,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    form.reset(defaultValues);
  }, [formState]);

  const title = isEdit ? 'Изменить этап' : 'Добавить этап';
  const subTitle = isEdit
    ? 'Внесите данные для создания этапа'
    : 'Внесите нужные правки по этапу';
  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;
  const onOpenChange = (open: boolean) => {
    if (open === false) {
      if (form.formState.isDirty) {
        formState === 'edit'
          ? setConfirmationOpen(true)
          : dispatch(setStageFormState('close')) &&
            dispatch(
              setStageFormValuesFromDto({ ...form.getValues(), saved: true }),
            );
      } else {
        formState === 'edit' && dispatch(setStageFormValuesEmpty());
        dispatch(setStageFormState('close'));
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
        <CreateStageForm
          form={form}
          className={className}
          popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
        />
      </Content>
      <ConfirmationAlertDialog
        title={'Сохранить изменения?'}
        description={'В этап были внесены изменения.'}
        confirmText={'Сохранить'}
        cancelText={'Сбросить'}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        onCancel={() => {
          dispatch(setStageFormValuesEmpty());
          dispatch(setStageFormState('close'));
        }}
        onConfirm={() =>
          form.handleSubmit((data) => {
            updateStage({
              ...data,
              class: 'stage',
            } as ControlStageUpdateDto)
              .unwrap()
              .then(() => {
                dispatch(setStageFormValuesEmpty());
                dispatch(setStageFormState('close'));
                toast.success('Этап изменен');
              })
              .catch((rejected: any) => {
                dispatch(setStageFormValuesEmpty());
                dispatch(setStageFormState('close'));
                toast.error('Не удалось изменить этап', {
                  description: rejected.data?.message || 'Неизвестная ошибка',
                });
              });
          })()
        }
      />
    </Wrapper>
  );
};

export { CreateStageDialog };
