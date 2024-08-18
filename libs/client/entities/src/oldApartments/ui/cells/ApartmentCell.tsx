import { CellContext } from '@tanstack/react-table';
import { OldAppartment } from '@urgp/shared/entities';

function ApartmentCell(props: CellContext<OldAppartment, string>): JSX.Element {
  const apartment = props.row.original;

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="truncate">{`${apartment.apartmentNum}`}</div>
        <div className="text-muted-foreground truncate text-xs">
          {`${apartment?.roomCount || 0} ${apartment.apartmentType.toLowerCase()}`}
        </div>
      </div>
    </div>
  );
}

export { ApartmentCell };
