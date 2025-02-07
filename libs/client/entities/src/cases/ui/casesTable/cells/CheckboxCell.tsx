import { getRouteApi, useLocation } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { CaseRoutes, Checkbox } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { ChevronLeft } from 'lucide-react';

function CheckboxCell(props: CellContext<any, unknown>): JSX.Element {
  const pathname = useLocation().pathname as CaseRoutes;
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  return (
    <div
      className="flex h-14 items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        className="size-5"
        checked={props.row.getIsSelected()}
        disabled={!props.row.getCanSelect()}
        onClick={props.row.getToggleSelectedHandler()}
      />
      {search?.selectedCase === props.row.original?.id && (
        <>
          <ChevronLeft className="text-muted-foreground absolute right-0 size-8" />
          <div className="border-muted-foreground pointer-events-none absolute inset-0 border" />
        </>
      )}
    </div>
  );
}

export { CheckboxCell };
