import {
  Button,
  buttonVariants,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  guestUser,
  selectApproveFormState,
  selectApproveFormValues,
  selectCaseFormValues,
  selectCurrentUser,
  selectProblemFormValues,
  setApproveFormState,
  setApproveFormValuesEmpty,
  setCaseFormValuesFromCase,
  setProblemFormValuesFromProblem,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useAuth,
  useIsMobile,
  useUserAbility,
} from '@urgp/client/shared';
import {
  GET_DEFAULT_CONTROL_DUE_DATE,
  approveControlEntityFormSchema,
  ApproveControlEntityFormDto,
  CaseFull,
  CaseClasses,
  CaseFormDto,
  updateCaseSchema,
  caseFormSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  DirectionTypeSelector,
  useApproveCase,
  useApproveOperation,
  useCaseByOperationId,
  useCurrentUserApproveTo,
  useCurrentUserSettings,
  useUpdateCase,
} from '@urgp/client/entities';
import {
  ControlFormDisplayElement,
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { PencilRuler, Save, SquareX, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { VariantProps } from 'class-variance-authority';

type DirectionsChangeMenuProps = {
  controlCase: CaseFull;
  className?: string;
  label?: string;
} & VariantProps<typeof buttonVariants>;

const DirectionsChangeMenu = ({
  controlCase,
  className,
  size,
  variant,
  label = 'Направления',
}: DirectionsChangeMenuProps): JSX.Element | null => {
  const {
    data: userSettings,
    isLoading,
    isFetching,
  } = useCurrentUserSettings();
  const [updateCase, { isLoading: isUpdateLoading }] = useUpdateCase();
  const [open, setOpen] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      id: controlCase?.id,
      typeId: controlCase?.type?.id || 0,
      class: controlCase?.class || CaseClasses.incident,
      title: controlCase?.title || '',
      notes: controlCase?.notes || '',
      dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
      approveToId: controlCase?.approveTo?.id || null,
      directionIds: controlCase?.directions?.map((d) => d?.id) || [],
    };
  }, [controlCase]);

  const form = useForm<CaseFormDto>({
    resolver: zodResolver(caseFormSchema),
    defaultValues,
  });

  function onSubmit(data: CaseFormDto) {
    updateCase(data)
      .unwrap()
      .then(() => {
        toast.success('Изменения внесены');
        setOpen(false);
      })
      .catch((rejected: any) =>
        toast.error('Не удалось внести изменения', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(
            'flex flex-row items-center justify-start gap-1',
            className,
          )}
          role="button"
          onClick={() => {
            form.reset(defaultValues);
          }}
        >
          {<PencilRuler className="size-4 flex-shrink-0" />}
          <span className="truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[30rem]" side="top">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit as any)}
            className={cn('relative flex flex-col gap-2')}
          >
            <DropdownMenuLabel className="flex flex-row gap-2 p-2">
              <Button
                type="button"
                // variant="outline"
                className="flex w-full flex-row items-center gap-2"
                disabled={isUpdateLoading || form.formState.isDirty !== true}
                onClick={form.handleSubmit(onSubmit)}
              >
                <Save className="size-4 flex-shrink-0" />
                <span>Сохранить изменения</span>
              </Button>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuGroup className="p-2">
              <DirectionTypeSelector
                popoverMinWidth="29rem"
                form={form}
                label="Направления"
                placeholder="Направления работы"
                fieldName="directionIds"
                dirtyIndicator={true}
                disabled={isLoading || isFetching}
                lockOption={(option) =>
                  userSettings?.department !== option?.category
                }
              />
            </DropdownMenuGroup>
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DirectionsChangeMenu };
