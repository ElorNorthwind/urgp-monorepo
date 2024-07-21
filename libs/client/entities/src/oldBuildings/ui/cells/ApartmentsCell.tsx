import { CellContext } from '@tanstack/react-table';

import { OldBuilding } from '@urgp/shared/entities';

function ApartmentsCell(props: CellContext<OldBuilding, string>): JSX.Element {
  return (
    <div className="m-auto flex h-full items-center ">
      {props.row.original.apartments.total > 0 ? (
        <p className=" text-center text-lg font-bold">
          {props.row.original.apartments.total}
        </p>
      ) : (
        <p className="text-muted-foreground text-center text-lg font-bold">-</p>
      )}
    </div>
  );
}

export { ApartmentsCell };
