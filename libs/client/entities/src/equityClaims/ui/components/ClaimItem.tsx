import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';
import { equityClaimItemTypeStyles } from '../../../equityClassificators';

type ClaimItemProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimItem = (props: ClaimItemProps): JSX.Element | null => {
  const { claim, className } = props;
  const { icon: TypeIcon, iconStyle } =
    equityClaimItemTypeStyles?.[claim?.claimItemType?.id || 0] ||
    Object.values(equityClaimItemTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex w-full flex-row flex-nowrap justify-start gap-2 overflow-hidden truncate',
            '[&>*]:truncate [&>*]:border-l [&>*]:pl-2 [&>*]:font-light',
            'first:[&>*]:flex-shrink-0 first:[&>*]:border-l-0 first:[&>*]:pl-0 first:[&>*]:font-semibold',
            className,
          )}
        >
          <div className="flex flex-row gap-1">
            {TypeIcon && (
              <TypeIcon className={cn('size-5 flex-shrink-0', iconStyle)} />
            )}

            <span className={iconStyle}>{claim?.claimItemType?.name}</span>
          </div>
          {claim?.numProject && <span>{'№ пр.: ' + claim?.numProject}</span>}
          {/* {claim?.sectionOrder && (
              <span>{'№ в секц.: ' + claim?.sectionOrder}</span>
            )} */}
          {claim?.unit && <span>{'блок: ' + claim?.unit}</span>}
          {claim?.section && <span>{'сек.: ' + claim?.floor}</span>}
          {claim?.floor && <span>{'этаж: ' + claim?.floor}</span>}
          {claim?.roomCount && <span>{'комн.: ' + claim?.roomCount}</span>}
          {claim?.s && <span>{claim?.s + ' м²'}</span>}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[450px] flex-col gap-0">
            {claim?.subject}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ClaimItem };
