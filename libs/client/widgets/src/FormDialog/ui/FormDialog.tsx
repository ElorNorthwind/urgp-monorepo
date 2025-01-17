import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFormState,
  DialogHeader,
  DialogTitle,
  Form,
  RootState,
  setStageFormState,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmationAlertDialog } from '@urgp/client/features';
import { toast } from 'sonner';
import { ZodObject } from 'zod';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { MutationDefinition } from '@reduxjs/toolkit/query';
import { TypedUseMutation } from '@reduxjs/toolkit/dist/query/react';

// const entitySliceFormHelpers = {
//   stage: {
//     entityType: 'operation',
//     dto: controlStageFormValuesDto,

//     stateSelector: selectStageFormState,
//     valuesSelector: selectStageFormValues,

//     stateDispatch: setStageFormState,
//     valuesEmptyDispatch: setStageFormValuesEmpty,
//     valuesDtoDispatch: setStageFormValuesFromDto,
//     valuesObjectDispatch: setStageFormValuesFromStage,

//     updateHook: useUpdateControlStage,
//     createHook: useCreateControlStage,
//     deleteHook: useDeleteOperation,
//   },
// };

export type FieldsArrayProps<TDto extends FieldValues> = {
  form: UseFormReturn<TDto, any, undefined>;
  isEdit?: boolean;
  popoverMinWidth?: string;
};

type UseAnyMutation = TypedUseMutation<
  MutationDefinition<any, any, any, any>,
  any,
  any
>;

type CreateStageDialogProps<TDto extends FieldValues> = {
  entityType: 'operation' | 'case';
  dto: ZodObject<TDto>;

  stateSelector: (state: RootState) => DialogFormState;
  valuesSelector: (state: RootState) => DefaultValues<TDto>;

  stateDispatch: ActionCreatorWithPayload<DialogFormState, any>;
  valuesEmptyDispatch: ActionCreatorWithoutPayload<any>;
  valuesDtoDispatch: ActionCreatorWithPayload<TDto, any>;

  updateHook: UseAnyMutation;
  createHook: UseAnyMutation;
  deleteHook: UseAnyMutation;

  FieldsArray: (props: FieldsArrayProps<TDto>) => ReactElement;

  customizeDefaultValues?: (values: DefaultValues<TDto>) => DefaultValues<TDto>;
  customizeCreateValues?: (values: TDto) => TDto;
  customizeUpdateValues?: (values: TDto) => TDto;

  dialogWidth?: string;
  className?: string;

  createTitle?: string;
  editTitle?: string;
  createDescription?: string;
  editDescription?: string;
};

const CreateStageDialog = <TDto extends FieldValues>(
  props: CreateStageDialogProps<TDto>,
): JSX.Element | null => {
  const {
    entityType,
    dto,
    valuesSelector,
    stateSelector,
    stateDispatch,
    valuesEmptyDispatch,
    valuesDtoDispatch,
    // valuesObjectDispatch,
    updateHook,
    createHook,
    deleteHook,
    FieldsArray,
    customizeDefaultValues,
    customizeCreateValues,
    customizeUpdateValues,
    dialogWidth = '600px',
    className,
    createTitle = 'Добавить запись',
    editTitle = 'Изменить запись',
    createDescription = 'Внесите данные для создания записи',
    editDescription = 'Внесите изменения в запись',
  } = props;

  const dispatch = useDispatch();

  const defaultValues = customizeDefaultValues
    ? customizeDefaultValues(useSelector(valuesSelector))
    : useSelector(valuesSelector);

  const formState = useSelector(stateSelector);
  const isEdit = formState === 'edit';

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<TDto>({
    resolver: zodResolver(dto),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [formState]);

  const title = isEdit ? editTitle : createTitle;
  const subTitle = isEdit ? editDescription : createDescription;

  const contentStyle = {
    '--dialog-width': dialogWidth,
  } as React.CSSProperties;

  const [createEntity, { isLoading: isCreateLoading }] = createHook();
  const [updateEntity, { isLoading: isUpdateLoading }] = updateHook();
  const [deleteEntity, { isLoading: isDeleteLoading }] = deleteHook();

  const closeAndReset = () => {
    dispatch(valuesEmptyDispatch()); // Сбрасываем стейт в состояние пустого
    dispatch(stateDispatch('close')); // Закрываем форму (диалог)
  };

  async function onEdit(data: TDto) {
    updateEntity(customizeUpdateValues ? customizeUpdateValues(data) : data)
      .unwrap()
      .then(() => {
        toast.success('Изменения внесены');
        closeAndReset();
      })
      .catch((rejected: any) =>
        toast.error('Не удалось внести изменения', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  async function onCreate(data: TDto) {
    createEntity(customizeCreateValues ? customizeCreateValues(data) : data)
      .unwrap()
      .then(() => {
        toast.success('Запись добавлена');
        closeAndReset();
      })
      .catch((rejected: any) =>
        toast.error('Не удалось добавить запись', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  async function onSubmit(data: TDto) {
    isEdit ? onEdit(data) : onCreate(data);
  }

  const onOpenChange = (open: boolean) => {
    if (open === false) {
      if (form.formState.isDirty) {
        formState === 'edit'
          ? setConfirmationOpen(true)
          : dispatch(stateDispatch('close')) &&
            dispatch(
              valuesDtoDispatch({
                ...form.getValues(),
                saved: true,
              } as unknown as TDto),
            );
      } else {
        formState === 'edit' && dispatch(valuesEmptyDispatch());
        dispatch(setStageFormState('close'));
      }
    }
  };

  const Wrapper = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Footer = isMobile ? SheetFooter : DialogFooter;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  <Fragment />;
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
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit as any)}
            className={cn('flex flex-col gap-4', className)}
          >
            <FieldsArray
              isEdit={isEdit}
              form={form}
              popoverMinWidth={`calc(${dialogWidth} - 3rem)`}
            />
          </form>
        </Form>
      </Content>
      <Footer>
        <Button
          className="flex-1"
          type="button"
          variant={'outline'}
          disabled={isCreateLoading || isUpdateLoading}
          onClick={closeAndReset}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isCreateLoading || isUpdateLoading}
          onClick={form.handleSubmit(onSubmit as any)}
        >
          Сохранить
        </Button>
      </Footer>

      <ConfirmationAlertDialog
        title={'Сохранить изменения?'}
        description={'Имеются несохраненные изменения'}
        confirmText={'Сохранить'}
        cancelText={'Сбросить'}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        onCancel={() => {
          closeAndReset();
        }}
        // onConfirm={() => form.handleSubmit(onEdit as any)()}
        onConfirm={form.handleSubmit(onEdit as any)}
      />
    </Wrapper>
  );
};

export { CreateStageDialog };
