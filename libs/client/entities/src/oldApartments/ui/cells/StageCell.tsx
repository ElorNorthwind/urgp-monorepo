import { CellContext } from '@tanstack/react-table';
import { OldAppartment } from '@urgp/shared/entities';
import { format } from 'date-fns';

function StageCell(props: CellContext<OldAppartment, string>): JSX.Element {
  const apartment = props.row.original;

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="flex items-center gap-1 truncate">
          {apartment.classificator.action}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 truncate text-xs">
          {`${apartment.classificator.stage} `}
          {apartment.classificator.stageDate && (
            <p className="opacity-60">
              {`(${format(
                new Date(apartment.classificator.stageDate),
                'dd.MM.yyyy',
              )})`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { StageCell };
