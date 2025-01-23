import { CellContext } from '@tanstack/react-table';
import { CaseOrPending, CaseWithPendingInfo } from '@urgp/shared/entities';
import { SmartApproveButton } from '../../CaseButtons/SmartApproveButton';

function SmartApproveCell(
  props: CellContext<CaseOrPending, unknown>,
): JSX.Element {
  const controlCase = props.row.original as CaseWithPendingInfo;

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-full">
      <SmartApproveButton
        variant="outline"
        controlCase={controlCase}
        className="w-full flex-shrink overflow-hidden truncate"
      />
    </div>
  );
}

export { SmartApproveCell };
