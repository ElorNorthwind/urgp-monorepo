import {
  useApproveCase,
  useApproveOperation,
  useCurrentUserApprovers,
} from '@urgp/client/entities';
import {
  Button,
  cn,
  guestUser,
  selectCurrentUser,
  setApproveFormEntityId,
  setApproveFormState,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import {
  Case,
  ControlOperation,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '@urgp/shared/entities';
import { Scale, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type ApproveButtonProps = {
  entity: Case | ControlOperation;
  approveLabel?: string;
  rejectLabel?: string;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  variant?: 'mini' | 'default' | 'outline' | 'separated';
};

const ApproveButton = (props: ApproveButtonProps): JSX.Element | null => {
  const {
    entity,
    className,
    buttonClassName,
    iconClassName,
    approveLabel = props.variant === 'separated'
      ? 'Одобрить'
      : 'Вынести решение',
    rejectLabel = 'Отклонить',
    variant = 'default',
  } = props;
  // not great...
  const cl = entity?.class || '';
  const entityType = ['control-incident'].includes(cl)
    ? 'case'
    : ['stage'].includes(cl)
      ? 'operation'
      : 'unknown';

  const [approveCase, { isLoading: isApproveCaseLoading }] = useApproveCase();
  const [approveOperation, { isLoading: isApproveOperationLoading }] =
    useApproveOperation();
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();
  const isLoading =
    isApproveCaseLoading || isApproveOperationLoading || isApproversLoading;
  const approveEntity = entityType === 'case' ? approveCase : approveOperation;

  const i = useUserAbility();
  const dispatch = useDispatch();

  if (entityType === 'unknown') return null;
  const onClick = () => {
    if (!entity?.id) return;
    dispatch(setApproveFormState(entityType));
    dispatch(setApproveFormEntityId(entity.id));
  };
  const user = useSelector(selectCurrentUser) || guestUser;

  async function onDeside(approve: boolean) {
    approveEntity({
      id: entity?.id,
      nextApproverId:
        // TODO: Refactor approvers!
        approvers?.[entityType === 'case' ? 'cases' : 'operations']?.some(
          (ap) => ap.value === user.id,
        )
          ? user.id
          : approvers?.[entityType === 'case' ? 'cases' : 'operations']?.[0]
              .value || null,
      dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
      approveStatus: approve ? 'approved' : 'rejected',
    })
      .unwrap()
      .then(() => {
        toast.success('Решение внесено');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось внести решение', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  if (i.cannot('approve', entity)) return null;

  if (variant === 'mini') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            role="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
              'size-6 flex-shrink-0 rounded-full p-0',
              className,
              buttonClassName,
            )}
          >
            <Scale className={cn('size-4', iconClassName)} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{approveLabel}</TooltipContent>
      </Tooltip>
    );
  }
  if (variant === 'separated' && !isLoading) {
    return (
      <div className={cn('flex flex-row gap-2', className)}>
        <Button
          role="button"
          variant="destructive"
          className={cn('flex flex-grow flex-row gap-2', buttonClassName)}
          onClick={() => onDeside(false)}
        >
          <ThumbsDown className={cn('size-5 flex-shrink-0', iconClassName)} />
          <span className="flex-shrink truncate">{rejectLabel}</span>
        </Button>
        <Button
          role="button"
          variant="default"
          className={cn('flex flex-grow flex-row gap-2', buttonClassName)}
          onClick={() => onDeside(true)}
        >
          <ThumbsUp className={cn('size-5 flex-shrink-0', iconClassName)} />
          <span className="flex-shrink truncate">{approveLabel}</span>
        </Button>
      </div>
    );
  }
  if (variant === 'default' || variant === 'outline') {
    return (
      <Button
        role="button"
        variant={variant}
        onClick={onClick}
        className={cn(
          'flex flex-grow flex-row gap-2',
          className,
          buttonClassName,
        )}
      >
        <Scale className={cn('size-5 flex-shrink-0', iconClassName)} />
        <span className="flex-shrink truncate">{approveLabel}</span>
      </Button>
    );
  }
  return null;
};

export { ApproveButton };
