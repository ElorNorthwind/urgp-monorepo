import {
  Button,
  useAvaliableCaseActions,
  useUserAbility,
} from '@urgp/client/shared';
import { ApproveButton } from '@urgp/client/widgets';
import { OperationClasses } from '@urgp/shared/entities';
import { useOperations } from '../../../operations';
import { useCaseById } from '../../api/casesApi';
import { DeleteCaseButton } from './DeleteCaseButton';
import { EditCaseButton } from './EditCaseButton';

type CaseSmartActionsProps = {
  caseId: number;
  // controlCase?: CaseWithPendingInfo;
  // variant?: 'mini' | 'default' | 'outline' | 'separated';

  className?: string;
  // buttonClassName?: string;
  // iconClassName?: string;
  // approveCaseLabel?: string;
  // approveOperationLabel?: string;
  // rejectLabel?: string;
};

const CaseSmartActions = ({
  caseId,
  // controlCase,
  // variant = 'default',
  // approveCaseLabel = 'Рассмотреть дело',
  // approveOperationLabel = 'Рассмотреть этап',
  // rejectLabel = 'Отклонить',
  className,
  // buttonClassName,
  // iconClassName,
}: CaseSmartActionsProps): JSX.Element | null => {
  const i = useUserAbility();
  const {
    data: incident,
    isLoading: isPendingLoading,
    isFetching: isPendingFetching,
  } = useCaseById(caseId, { skip: !caseId });

  const {
    data: dispatches,
    isLoading: isDispatchesLoading,
    isFetching: isDispatchesFetching,
  } = useOperations(
    { class: OperationClasses.dispatch, case: caseId },
    { skip: !caseId || caseId === 0 },
  );

  const avaliableActions = useAvaliableCaseActions(incident);

  // const {
  //   data: stages,
  //   isLoading: isStagesLoading,
  //   isFetching: isStagesFetching,
  // } = useStages(caseId, { skip: !caseId });

  if (
    isPendingLoading ||
    isPendingFetching ||
    isDispatchesLoading ||
    isDispatchesFetching ||
    !incident
  ) {
    return null;
  }

  return (
    <>
      {avaliableActions.map((action) => {
        if (action === 'delete')
          return <DeleteCaseButton key={action} controlCase={incident} />;

        if (action === 'edit-rejected')
          return (
            <EditCaseButton
              key={action}
              controlCase={incident}
              label={'Исправить'}
            />
          );

        if (action === 'edit')
          return (
            <EditCaseButton
              key={action}
              controlCase={incident}
              label={'Редактировать'}
            />
          );

        if (action === 'case-reapprove')
          return (
            <ApproveButton
              variant={'default'}
              entity={incident}
              approveLabel="Пересмотреть дело"
            />
          );

        if (action === 'case-approve')
          return (
            <ApproveButton
              variant={'default'}
              entity={incident}
              approveLabel="Рассмотреть дело"
            />
          );

        if (action === 'operation-approve' && incident?.myPendingStage)
          return (
            <ApproveButton
              variant={'default'}
              entity={incident?.myPendingStage}
              approveLabel="Утвердить решение"
            />
          );

        if (action === 'reminder-done')
          return (
            <Button role={'button'} variant={'default'} disabled>
              Оценить решение
            </Button>
          );

        if (action === 'reminder-overdue')
          return (
            <Button role={'button'} variant={'default'} disabled>
              Рассмотреть просрочку
            </Button>
          );

        return null;
        //   return (
        //     <ApproveButton
        //       variant={variant}
        //       entity={controlCase}
        //       approveLabel={approveCaseLabel}
        //       rejectLabel={rejectLabel}
        //       className={className}
        //       buttonClassName={buttonClassName}
        //       iconClassName={iconClassName}
        //     />
      })}
    </>
  );

  // i.can('approve', pendingCase)
  //   ? pendingCase?.payload?.approveStatus === 'rejected'
  //     ? 'case-reapprove'
  //     : 'case-approve'
  //   : undefined,
  // pendingCase?.pendingStage && i.can('approve', pendingCase.pendingStage)
  //   ? 'operation-approve'
  //   : undefined,
  // pendingCase?.action === 'reminder-done' ? 'reminder-done' : undefined,
  // pendingCase?.action === 'reminder-overdue' ? 'reminder-overdue' : undefined,

  // <DeleteCaseButton controlCase={controlCase} />
  // <EditCaseButton controlCase={controlCase} />

  // if (controlCase.action === 'case-approve' && i.can('approve', controlCase)) {
  //   return (
  //     <ApproveButton
  //       variant={variant}
  //       entity={controlCase}
  //       approveLabel={approveCaseLabel}
  //       rejectLabel={rejectLabel}
  //       className={className}
  //       buttonClassName={buttonClassName}
  //       iconClassName={iconClassName}
  //     />
  //   );
  // } else if (controlCase.action === 'operation-approve' && i.can('approve', myPendingStage)) {
  //   return (
  //     <ApproveButton
  //       variant={variant}
  //       entity={myPendingStage}
  //       approveLabel={approveOperationLabel}
  //       rejectLabel={rejectLabel}
  //       className={className}
  //       buttonClassName={buttonClassName}
  //       iconClassName={iconClassName}
  //     />
  //   );
  // }
  // return null;

  // unknown: { icon: Clipboard },
  // 'case-approve': { icon: ClipboardPen },
  // 'both-approve': { icon: ClipboardPen },
  // 'operation-approve': { icon: ClipboardPenLine },
  // 'case-rejected': { icon: ClipboardMinus },
  // 'reminder-done': { icon: ClipboardCheck },
  // 'reminder-overdue': { icon: ClipboardX },

  // WHEN c.payload->-1->>'approveStatus' = 'pending' AND ps.id IS NOT NULL THEN 'both-approve'
  // WHEN c.payload->-1->>'approveStatus' = 'pending' THEN 'case-approve'
  // WHEN c.payload->-1->>'approveStatus' = 'rejected' THEN 'case-rejected'
  // WHEN ps.id IS NOT NULL THEN 'operation-approve'
  // WHEN s.category = 'рассмотрено' AND (rem.seen IS NOT NULL OR rem.done IS NULL) THEN 'reminder-done'
  // WHEN (s.category <> 'рассмотрено' AND rem.due < current_date) THEN 'reminder-overdue'
  // ELSE 'unknown'

  // const i = useUserAbility();

  // if (isLoading) return null;
};
export { CaseSmartActions };
