import { CellContext } from '@tanstack/react-table';
import { EquityObject } from '@urgp/shared/entities';
import { EquityObjectProblemList } from '../../EquityObjectProblemList';

function EquityObjectProblemCell(
  props: CellContext<EquityObject, string>,
): JSX.Element {
  const rowData = props.row?.original;

  return (
    <div className="w-full flex-wrap overflow-hidden">
      <EquityObjectProblemList problems={rowData.problems} variant="compact" />
    </div>
  );
}

export { EquityObjectProblemCell };
