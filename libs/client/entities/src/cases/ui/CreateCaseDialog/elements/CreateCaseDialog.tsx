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
import { caseFormValuesDto, CaseFormValuesDto } from '@urgp/shared/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { use } from 'passport';
import { useEffect } from 'react';

type CreateCaseDialogProps = {
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateCaseDialog = ({
  className,
}: CreateCaseDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApprovers();

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

  const title = isEdit ? 'Добавить заявку' : 'Изменить заявку';
  const subTitle = isEdit
    ? 'Внесите данные для создания дела'
    : 'Внесите нужные правки по делу';
  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;
  const onOpenChange = (open: boolean) => {
    //TODO : Логика сохранения полузаполненной формы
    if (open === false) {
      formState === 'create' && form.formState.isDirty
        ? dispatch(
            setCaseFormValuesFromDto({ ...form.getValues(), saved: true }),
          )
        : dispatch(setCaseFormValuesEmpty());

      dispatch(setCaseFormState('close'));
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
    </Wrapper>
  );
};

export { CreateCaseDialog };
