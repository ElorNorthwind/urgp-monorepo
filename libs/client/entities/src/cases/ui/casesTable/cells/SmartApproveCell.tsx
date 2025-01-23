import { CellContext } from '@tanstack/react-table';
import { CaseOrPending, CaseWithPendingInfo } from '@urgp/shared/entities';
import { CaseSmartApproveButton } from '../../CaseButtons/CaseSmartApproveButton';

function SmartApproveCell(
  props: CellContext<CaseOrPending, unknown>,
): JSX.Element {
  const controlCase = props.row.original as CaseWithPendingInfo;

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-full">
      <CaseSmartApproveButton
        variant="outline"
        controlCase={controlCase}
        className="w-full overflow-hidden truncate"
        approveCaseLabel="Дело"
        approveOperationLabel="Этап"
        rejectLabel=""
        buttonClassName="px-2"
      />
    </div>
  );
}

export { SmartApproveCell };
