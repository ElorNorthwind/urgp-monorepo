import { CellContext } from '@tanstack/react-table';
import { CaseActions, CaseFull } from '@urgp/shared/entities';
import { CaseSmartApproveButton } from '../../CaseButtons/CaseSmartApproveButton';
// import { ManageReminderButton } from 'libs/client/entities/src/operations';
import { Button } from '@urgp/client/shared';
import { EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useMarkReminders } from '../../../../operations';
import { CaseSmartActionsMenu } from '../../CaseButtons/CaseSmartActionsMenu';
// import { useMarkCaseRemindersAsDone } from '../../../../operations';

function SmartApproveCell(props: CellContext<CaseFull, unknown>): JSX.Element {
  const controlCase = props.row.original;

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full">
      <CaseSmartActionsMenu
        controlCase={controlCase}
        variant="outline"
        size="sm"
        className="w-full justify-center overflow-hidden"
      />
    </div>
  );
}

export { SmartApproveCell };
