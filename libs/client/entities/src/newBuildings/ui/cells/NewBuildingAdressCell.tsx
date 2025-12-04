import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { RenovationNewBuilding } from '@urgp/shared/entities';

function NewBuildingAdressCell(
  props: CellContext<RenovationNewBuilding, string>,
): JSX.Element {
  const rowData = props.row?.original;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row gap-2 truncate">
          {/* {BuildingIcon && (
            <BuildingIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )} */}
          <div className="flex w-full flex-1 flex-col items-start justify-start truncate">
            <div className="w-full truncate">
              <span className="w-full truncate">{rowData?.adress}</span>
            </div>
            <div
              className={cn(
                'text-muted-foreground w-full truncate text-xs',
                'first:[&>*]:mr-1 first:[&>*]:border-r first:[&>*]:pr-1',
              )}
            >
              <span className="w-full truncate font-light">
                {rowData?.okrug || '-'}
              </span>
              <span className="w-full truncate font-thin">
                {rowData?.district || '-'}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          <p>
            <b>Округ:</b> {rowData.okrug}
          </p>
          <p>
            <b>Район:</b> {rowData.district}
          </p>
          <p>
            <b>Адрес:</b> {rowData.adress}
          </p>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { NewBuildingAdressCell };
