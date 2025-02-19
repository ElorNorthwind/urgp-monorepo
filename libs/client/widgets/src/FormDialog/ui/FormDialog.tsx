import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { TypedUseMutation } from '@reduxjs/toolkit/dist/query/react';
import { MutationDefinition } from '@reduxjs/toolkit/query';
import { ConfirmationAlertDialog } from '@urgp/client/features';
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  RootState,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import { DialogFormState } from '@urgp/shared/entities';
import { Save, SquareX, Trash2 } from 'lucide-react';
import { ReactElement, useEffect, useState } from 'react';
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ZodObject } from 'zod';

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

export type FormDialogProps<TDto extends FieldValues> = {
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
  allowDelete?: boolean;

  FieldsArray: (props: FieldsArrayProps<TDto>) => ReactElement;

  customizeDefaultValues?: (values: DefaultValues<TDto>) => DefaultValues<TDto>;
  customizeCreateValues?: (values: TDto) => TDto;
  customizeUpdateValues?: (values: TDto) => TDto;
  customizeDeleteValues?: (values: TDto) => any;

  dialogWidth?: string;
  className?: string;
  skeletonClassName?: string;
  isLoading?: boolean;
  displayedElement?: JSX.Element | null;

  createTitle?: string;
  editTitle?: string;
  createDescription?: string;
  editDescription?: string;
  cancelButtonLabel?: string;
  deleteButtonLabel?: string;
  saveButtonLabel?: string;
  alwaysSaveEdit?: boolean;
};

const FormDialog = <TDto extends FieldValues>(
  props: FormDialogProps<TDto>,
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
    allowDelete = false,
    FieldsArray,
    customizeDefaultValues,
    customizeCreateValues,
    customizeUpdateValues,
    customizeDeleteValues,
    dialogWidth = '600px',
    className,
    skeletonClassName = 'h-[35rem] w-full',
    isLoading = false,
    displayedElement,
    createTitle = 'Добавить запись',
    editTitle = 'Изменить запись',
    createDescription = 'Внесите данные для создания записи',
    editDescription = 'Внесите изменения в запись',
    cancelButtonLabel = 'Отмена',
    deleteButtonLabel = 'Удалить',
    saveButtonLabel = 'Сохранить',
    alwaysSaveEdit = false,
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
    setConfirmationOpen(false);
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

  async function onDelete(data: TDto) {
    deleteEntity &&
      deleteEntity(customizeDeleteValues ? customizeDeleteValues(data) : data)
        .unwrap()
        .then(() => {
          toast.success('Запись удалена');
          closeAndReset();
        })
        .catch((rejected: any) =>
          toast.error('Не удалось удалить запись', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
  }

  async function onSubmit(data: TDto) {
    isEdit ? onEdit(data) : onCreate(data);
  }

  const onOpenChange = (open: boolean) => {
    const dirty = form.formState.isDirty;
    form.trigger();
    const isValid = form.formState.isValid; // Очень очень нестабильно. Проверить дебаунсы?
    if (open === false) {
      if (dirty) {
        formState === 'edit'
          ? isValid
            ? setConfirmationOpen(true)
            : form.trigger()
          : dispatch(stateDispatch('close')) &&
            dispatch(
              valuesDtoDispatch({
                ...form.getValues(),
                saved: true,
              } as unknown as TDto),
            );
      } else {
        formState === 'edit' && dispatch(valuesEmptyDispatch());
        dispatch(stateDispatch('close'));
      }
    }
  };

  const Wrapper = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Footer = isMobile ? SheetFooter : DialogFooter;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  if (isLoading) return <Skeleton className={skeletonClassName} />;

  return (
    <Wrapper open={formState !== 'close'} onOpenChange={onOpenChange}>
      <Content
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          'max-h-[calc(100vh-0.5rem)]', // TODO: Отрефактори со скролл эриа как белый человек йопт
          isMobile
            ? 'w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]'
            : `w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`,
        )}
      >
        <Header className="bg-muted-foreground/5 -m-6 mb-0 px-6 py-4 text-left">
          <Title>{title}</Title>
          <Description>{subTitle}</Description>
          {/* {Object.entries(form?.formState?.errors || {}).map((error) => (
            <div key={error[0]}>
              <p className="text-red-600">{error[1]?.message}</p>
            </div>
          ))} */}
        </Header>
        {displayedElement}
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit as any)}
            className={cn('relative flex flex-col gap-2', className)}
          >
            <FieldsArray
              isEdit={isEdit}
              form={form}
              popoverMinWidth={`calc(${dialogWidth} - 3rem)`}
            />
            <Footer
              className={cn(
                'bg-muted-foreground/5 -m-6 mt-4 px-6 py-4',
                isMobile && 'flex-shrink-0 gap-2',
              )}
            >
              <Button
                className="flex flex-1 flex-row gap-1"
                type="button"
                variant={'outline'}
                disabled={isCreateLoading || isUpdateLoading}
                onClick={closeAndReset}
              >
                <SquareX className="size-4 flex-shrink-0" />
                <span>{cancelButtonLabel}</span>
              </Button>
              {allowDelete && (
                <Button
                  className="flex flex-1 flex-row gap-1"
                  type="button"
                  variant={'destructive'}
                  disabled={
                    isCreateLoading || isUpdateLoading || isDeleteLoading
                  }
                  onClick={() => onDelete(form.getValues())}
                >
                  <Trash2 className="size-4 flex-shrink-0" />
                  <span>{deleteButtonLabel}</span>
                </Button>
              )}
              <Button
                type="submit"
                className="flex flex-1 flex-row gap-1"
                disabled={
                  isCreateLoading ||
                  isUpdateLoading ||
                  (!form.formState.isDirty && isEdit && !alwaysSaveEdit)
                }
                onClick={form.handleSubmit(onSubmit as any)}
              >
                <Save className="size-4 flex-shrink-0" />
                <span>{saveButtonLabel}</span>
              </Button>
            </Footer>
          </form>
        </Form>
      </Content>

      <ConfirmationAlertDialog
        title={'Сохранить изменения?'}
        description={'Имеются несохраненные изменения'}
        confirmText={'Сохранить'}
        cancelText={'Сбросить'}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        onCancel={closeAndReset}
        // onConfirm={() => form.handleSubmit(onEdit as any)()}
        onConfirm={form.handleSubmit(onEdit as any)}
      />
    </Wrapper>
  );
};

export { FormDialog };
