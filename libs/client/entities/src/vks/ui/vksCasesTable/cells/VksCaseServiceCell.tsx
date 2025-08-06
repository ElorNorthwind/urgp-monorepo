import { CellContext } from '@tanstack/react-table';
import { cn } from '@urgp/client/shared';
import { VksCase } from '@urgp/shared/entities';
import { propertyTypeStyles } from '../../../config/vksStyles';

function VksCaseServiceCell(props: CellContext<VksCase, string>): JSX.Element {
  const rowData = props.row?.original;

  const { icon: PropertyTypeIcon, iconStyle: propertyTypeIconStyle } =
    propertyTypeStyles?.[
      (rowData?.propertyType ||
        'Жилищные вопросы') as keyof typeof propertyTypeStyles
    ] || Object.values(propertyTypeStyles)[0];

  return (
    <div className="flex w-full flex-row items-center gap-2">
      {PropertyTypeIcon && (
        <PropertyTypeIcon
          className={cn('size-8 flex-shrink-0', propertyTypeIconStyle)}
        />
      )}
      <div className="line-clamp-2 font-light leading-tight">
        {props.getValue()}
      </div>
    </div>
  );
}

export { VksCaseServiceCell };
