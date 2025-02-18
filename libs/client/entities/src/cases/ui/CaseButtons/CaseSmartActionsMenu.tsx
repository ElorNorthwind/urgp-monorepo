import {
  Button,
  buttonVariants,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  setApproveFormState,
  setApproveFormValuesFromEntity,
  setCaseFormState,
  setCaseFormValuesFromCase,
  setDispatchFormCaseId,
  setDispatchFormState,
  setEscalateFormCaseId,
  setEscalateFormState,
  setProblemFormState,
  setProblemFormValuesFromProblem,
  setReminderFormCaseId,
  setReminderFormState,
  setReminderFormValuesFromReminder,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';
import {
  ApproveFormState,
  CaseActions,
  CaseClasses,
  CaseFull,
  DialogFormState,
  emptyStage,
  EscalateFormState,
} from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import {
  AlarmClockCheck,
  Edit,
  HandHeart,
  LucideAlarmClock,
  Scale,
  ZoomIn,
} from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useCreateOperation, useMarkReminderAsDone } from '../../../operations';
import { pendingActionStyles } from '../../config/caseStyles';

type CaseSmartActionsMenuProps = {
  controlCase: CaseFull;
  className?: string;
} & VariantProps<typeof buttonVariants>;

// const submenuItems = {
//   [CaseActions.caseApprove]: {
//     separated: ['approve-case', 'reject-case'],
//     single: ['approve-case'],
//   },
//   [CaseActions.operationApprove]: {
//     separated: ['approve-operation', 'reject-operation'],
//     single: ['approve-operation'],
//   },
//   [CaseActions.caseRejected]: {
//     separated: ['edit', 'delete', 'approve-case'],
//     single: ['edit', 'delete', 'approve-case'],
//   },
//   [CaseActions.reminderDone]: {
//     separated: ['forget', 'escalate'],
//     single: ['forget', 'escalate'],
//   },
//   [CaseActions.reminderOverdue]: {
//     separated: ['forget', 'prolong', 'escalate'],
//     single: ['forget', 'prolong', 'escalate'],
//   },
//   [CaseActions.escalation]: {
//     separated: ['forget', 'dispatch'],
//     single: ['forget', 'dispatch'],
//   },
// };

const CaseSmartActionsMenu = ({
  controlCase,
  className,
  size,
  variant,
}: CaseSmartActionsMenuProps): JSX.Element | null => {
  const i = useUserAbility();
  const user = useAuth();
  const [markAsDone, { isLoading: isMarkLoading }] = useMarkReminderAsDone();
  const [createOp, { isLoading: isCreateLoading }] = useCreateOperation();

  const { icon: ActionIcon, label } =
    controlCase?.actions?.length === 1
      ? pendingActionStyles[controlCase.actions[0]]
      : pendingActionStyles.unknown;

  const dispatch = useDispatch();

  const submenuItems = useMemo(
    () =>
      ({
        [CaseActions.caseApprove]: {
          onClick: () => {
            if (!controlCase) return;
            dispatch(setApproveFormState(ApproveFormState.case));
            dispatch(setApproveFormValuesFromEntity(controlCase));
          },
          disabled: i.cannot('approve', controlCase),
          sub: [],
        },
        [CaseActions.operationApprove]: {
          onClick: () => {
            if (!controlCase?.myPendingStage) return;
            dispatch(setApproveFormState('operation'));
            dispatch(
              setApproveFormValuesFromEntity(controlCase.myPendingStage),
            );
          },
          disabled:
            !controlCase?.myPendingStage ||
            i.cannot('approve', controlCase?.myPendingStage),
          sub: [],
        },
        [CaseActions.caseRejected]: {
          onClick: null,
          sub: [
            {
              key: 'reject-edit',
              icon: Edit,
              label: 'Редактировать дело',
              disabled: i.cannot('update', controlCase),
              onClick: () => {
                if (!controlCase) return;
                if (controlCase.class === CaseClasses.problem) {
                  dispatch(setProblemFormValuesFromProblem(controlCase));
                  dispatch(setProblemFormState(DialogFormState.edit));
                } else if (controlCase.class === CaseClasses.incident) {
                  dispatch(setCaseFormValuesFromCase(controlCase));
                  dispatch(setCaseFormState(DialogFormState.edit));
                }
              },
            },
            {
              key: 'reject-distapch',
              icon: Scale,
              label: 'Направить/снять с согласования',
              disabled: i.cannot('approve', controlCase),
              onClick: () => {
                if (!controlCase) return;
                dispatch(setApproveFormState(ApproveFormState.case));
                dispatch(setApproveFormValuesFromEntity(controlCase));
              },
            },
          ],
        },
        [CaseActions.reminderDone]: {
          onClick: null,
          sub: [
            {
              key: 'done-forget',
              icon: AlarmClockCheck,
              label: 'Согласиться с решением (снять напоминание)',
              disabled:
                isMarkLoading ||
                !controlCase?.myReminder ||
                i.cannot('update', controlCase.myReminder),

              onClick: () => {
                if (!controlCase || !controlCase?.myReminder) return;

                if (
                  user?.controlData?.priority &&
                  user?.controlData?.priority >= controlCase?.controlLevel
                ) {
                  createOp({
                    ...emptyStage,
                    caseId: controlCase.id,
                    typeId: 6,
                    notes: user.fio + ' одобрил решение',
                  })
                    .unwrap()
                    .catch((rejected: any) =>
                      toast.error('Не удалось создать этап', {
                        description:
                          rejected.data?.message || 'Неизвестная ошибка',
                      }),
                    );
                }

                markAsDone(controlCase?.myReminder?.id)
                  .unwrap()
                  .then(() => {
                    toast.success('Напоминание снято');
                  })
                  .catch((rejected: any) =>
                    toast.error('Не удалось снять напоминание', {
                      description:
                        rejected.data?.message || 'Неизвестная ошибка',
                    }),
                  );
              },
            },
            {
              key: 'done-escalate',
              icon: HandHeart,
              label: 'Запросить заключение руководства',
              disabled: i.cannot('escalate', controlCase),
              onClick: () => {
                if (!controlCase) return;
                dispatch(setEscalateFormCaseId(controlCase?.id));
                dispatch(setEscalateFormState(EscalateFormState.open));
              },
            },
          ],
        },
        [CaseActions.reminderOverdue]: {
          onClick: null,
          sub: [
            {
              key: 'overdue-remind',
              icon: LucideAlarmClock,
              label: 'Передвинуть срок напоминания',
              disabled:
                !controlCase?.myReminder ||
                i.cannot('update', controlCase.myReminder),
              onClick: () => {
                if (!controlCase || !controlCase?.myReminder) return;
                dispatch(setReminderFormCaseId(controlCase.id));
                dispatch(
                  setReminderFormValuesFromReminder(controlCase?.myReminder),
                );
                dispatch(setReminderFormState(DialogFormState.edit));
              },
            },
            {
              key: 'overdue-escalate',
              icon: HandHeart,
              label: 'Запросить заключение руководства',
              disabled: i.cannot('escalate', controlCase),
              onClick: () => {
                if (!controlCase) return;
                dispatch(setEscalateFormCaseId(controlCase?.id));
                dispatch(setEscalateFormState(EscalateFormState.open));
              },
            },
          ],
        },
        [CaseActions.escalation]: {
          onClick: null,
          sub: [
            {
              key: 'escalation-agree',
              icon: AlarmClockCheck,
              label: 'Согласиться с решением (снять напоминание)',
              disabled:
                isMarkLoading ||
                isCreateLoading ||
                !controlCase?.myReminder ||
                i.cannot('update', controlCase.myReminder),
              onClick: () => {
                if (!controlCase || !controlCase?.myReminder) return;

                if (
                  user?.controlData?.priority &&
                  user?.controlData?.priority >= controlCase?.controlLevel
                ) {
                  createOp({
                    ...emptyStage,
                    caseId: controlCase.id,
                    typeId: 6,
                    notes: user.fio + ' оставил на контроле исполнителя',
                  })
                    .unwrap()
                    .catch((rejected: any) =>
                      toast.error('Не удалось создать этап', {
                        description:
                          rejected.data?.message || 'Неизвестная ошибка',
                      }),
                    );
                }
                markAsDone(controlCase?.myReminder?.id)
                  .unwrap()
                  .then(() => {
                    toast.success('Напоминание снято');
                  })
                  .catch((rejected: any) =>
                    toast.error('Не удалось снять напоминание', {
                      description:
                        rejected.data?.message || 'Неизвестная ошибка',
                    }),
                  );
              },
            },
            {
              key: 'escalation-control',
              icon: ZoomIn,
              label: 'Взять на контроль',
              disabled: i.cannot('create', 'Dispatch'),
              onClick: () => {
                if (!controlCase) return;
                dispatch(setDispatchFormCaseId(controlCase?.id));
                dispatch(setDispatchFormState(DialogFormState.create));
              },
            },
          ],
        },
      }) as Record<CaseActions, any>,
    [controlCase?.actions],
  );

  if (!controlCase || controlCase?.actions?.length === 0) return null;

  if (controlCase?.actions?.length === 1) {
    const item = submenuItems[controlCase?.actions?.[0]];

    if (item.sub?.length > 0) {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={size}
              variant={variant}
              disabled={item?.disabled}
              className={cn(
                'flex flex-row items-center justify-start gap-1',
                className,
              )}
              role="button"
              // onClick={item?.onClick}
            >
              {ActionIcon && <ActionIcon className="size-4 flex-shrink-0" />}
              <span className="truncate">{label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" side="top">
            <DropdownMenuLabel className="flex flex-row gap-2">
              {ActionIcon && <ActionIcon className="size-4 flex-shrink-0" />}
              <span>{label}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {item.sub.map((subAction: any) => {
                const {
                  icon: CurrentActionIcon,
                  label,
                  key,
                  disabled,
                  onClick,
                } = subAction;
                return (
                  <DropdownMenuItem
                    disabled={disabled}
                    key={key}
                    onClick={onClick}
                  >
                    {CurrentActionIcon && (
                      <CurrentActionIcon className="mr-2 size-4" />
                    )}
                    <span>{label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button
        size={size}
        variant={variant}
        disabled={item?.disabled}
        className={cn(
          'flex flex-row items-center justify-start gap-1',
          className,
        )}
        role="button"
        onClick={item?.onClick}
      >
        {ActionIcon && <ActionIcon className="size-4 flex-shrink-0" />}
        <span className="truncate">{label}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(
            'flex flex-row items-center justify-start gap-1',
            className,
          )}
          role="button"
        >
          {ActionIcon && <ActionIcon className="size-4 flex-shrink-0" />}
          <span className="truncate">
            {controlCase?.actions?.length > 1
              ? controlCase?.actions?.length + ' действия'
              : label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" side="top">
        <DropdownMenuLabel className="flex flex-row gap-2">
          {ActionIcon && <ActionIcon className="size-4 flex-shrink-0" />}
          <span>Доступные действия</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {controlCase?.actions.map((action) => {
            const { icon: CurrentActionIcon, label } =
              pendingActionStyles[action];

            if (submenuItems[action]?.sub?.length > 0) {
              return (
                <DropdownMenuSub key={action}>
                  <DropdownMenuSubTrigger>
                    {CurrentActionIcon && (
                      <CurrentActionIcon className="mr-2 size-4" />
                    )}
                    <span>{label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {submenuItems[action]?.sub?.map((subAction: any) => {
                        const {
                          icon: CurrentActionIcon,
                          label,
                          onClick,
                          key,
                          disabled,
                        } = subAction;
                        return (
                          <DropdownMenuItem
                            disabled={disabled}
                            key={key}
                            onClick={onClick}
                          >
                            {CurrentActionIcon && (
                              <CurrentActionIcon className="mr-2 size-4" />
                            )}
                            <span>{label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            }

            return (
              <DropdownMenuItem
                disabled={submenuItems[action]?.disabled}
                key={action}
                onClick={submenuItems[action]?.onClick}
              >
                {CurrentActionIcon && (
                  <CurrentActionIcon className="mr-2 size-4" />
                )}
                <span>{label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CaseSmartActionsMenu };
