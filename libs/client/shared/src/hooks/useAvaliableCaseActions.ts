import { CaseWithPendingInfo } from '@urgp/shared/entities';
import { useUserAbility } from './useUserAbility';

export function useAvaliableCaseActions(
  pendingCase: CaseWithPendingInfo | undefined,
): string[] {
  const i = useUserAbility();
  if (!pendingCase) return [];
  return [
    i.can('delete', pendingCase) ? 'delete' : undefined,
    i.can('update', pendingCase)
      ? pendingCase?.action === 'case-rejected'
        ? 'edit-rejected'
        : 'edit'
      : undefined,
    i.can('approve', pendingCase)
      ? pendingCase?.payload?.approveStatus === 'rejected'
        ? 'case-reapprove'
        : 'case-approve'
      : undefined,
    pendingCase?.pendingStage && i.can('approve', pendingCase.pendingStage)
      ? 'operation-approve'
      : undefined,
    pendingCase?.action === 'reminder-done' ? 'reminder-done' : undefined,
    pendingCase?.action === 'reminder-overdue' ? 'reminder-overdue' : undefined,
  ].filter((a) => a);
}
