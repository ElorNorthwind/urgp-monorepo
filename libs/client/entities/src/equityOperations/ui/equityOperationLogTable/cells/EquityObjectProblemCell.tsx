import { CellContext } from '@tanstack/react-table';
import { EquityObject, EquityOperationLogItem } from '@urgp/shared/entities';
// import { EquityObjectProblemList } from 'libs/client/entities/src/equityObjects';
import { EquityObjectProblemList } from '../../../../equityObjects';

function EquityObjectProblemCell(
  props: CellContext<EquityOperationLogItem, string>,
): JSX.Element {
  const rowData = props.row?.original;

  return (
    <div className="w-full flex-wrap overflow-hidden">
      <EquityObjectProblemList problems={rowData.problems} variant="compact" />
    </div>
  );
}

export { EquityObjectProblemCell };
