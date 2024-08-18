import { CellContext } from '@tanstack/react-table';
import { OldAppartment } from '@urgp/shared/entities';

function AdressCell(props: CellContext<OldAppartment, string>): JSX.Element {
  const apartment = props.row.original;

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="line-clamp-2">{apartment.adress}</div>
        <div className="line-clamp-1 text-muted-foreground text-xs">
          {apartment.okrug + ', ' + apartment.district}
        </div>
      </div>
    </div>
  );
}

export { AdressCell };
