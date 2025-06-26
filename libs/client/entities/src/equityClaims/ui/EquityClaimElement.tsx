import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import {
  EquityClaim,
  EquityClaimStatuses,
  equityClaimStatusesValues,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { CircleCheck } from 'lucide-react';
import { equityClaimItemTypeStyles } from '../../equityClassificators';

type EquityClaimElementProps = {
  claim?: EquityClaim;
  className?: string;
};

const EquityClaimElement = (
  props: EquityClaimElementProps,
): JSX.Element | null => {
  const { claim, className } = props;

  const { icon: TypeIcon, iconStyle } =
    equityClaimItemTypeStyles?.[claim?.claimItemType?.id || 0] ||
    Object.values(equityClaimItemTypeStyles)[0];

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col gap-2 border-b p-4 last:border-b-0',
        !claim?.isRelevant && 'opacity-50',
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-muted-foreground/10 relative -mx-4 -mt-4 flex w-[calc(100%+2rem)] flex-row items-center truncate px-4 py-2 ">
            <p
              className={cn(
                'w-24 flex-grow truncate text-lg font-bold',
                claim?.claimStatus !== EquityClaimStatuses?.active &&
                  'line-through',
              )}
            >
              {claim?.creditorName}
            </p>
            <p className="text-thin ml-2 flex-shrink-0">
              {claim?.claimSourceType?.name}
            </p>
            {/* <CircleCheck className="absolute right-1 top-1/2 size-10 -translate-y-1/2 text-teal-500/50" /> */}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom">
            <TooltipArrow />
            <div className="flex max-w-[450px] flex-col gap-0">
              <div className="pb-2 font-bold">{claim?.creditorName}</div>
              {claim?.source && (
                <div className="flex items-start justify-between">
                  <span>Источник данных:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.source}
                  </span>
                </div>
              )}
              {claim?.claimRegistryNum && (
                <div className="flex items-start justify-between">
                  <span>№ требования в РТУС:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.claimRegistryNum}
                  </span>
                </div>
              )}
              {claim?.creditorRegistryNum && (
                <div className="flex items-start justify-between">
                  <span>№ кредитора в РТУС:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.creditorRegistryNum}
                  </span>
                </div>
              )}
              {claim?.creditorDocuments && (
                <div className="flex items-start justify-between">
                  <span>Документы:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.creditorDocuments}
                  </span>
                </div>
              )}
              {claim?.creditorAddress && (
                <div className="flex items-start justify-between">
                  <span>Адрес:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.creditorAddress}
                  </span>
                </div>
              )}
              {claim?.creditorContacts && (
                <div className="flex items-start justify-between">
                  <span>Контакты:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {claim?.creditorContacts}
                  </span>
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex w-full flex-row flex-nowrap justify-start gap-2 truncate',
              '[&>*]:truncate [&>*]:border-l [&>*]:pl-2 [&>*]:font-thin',
              'first:[&>*]:border-l-0 first:[&>*]:pl-0 first:[&>*]:font-semibold',
            )}
          >
            <div className="flex flex-row gap-1">
              {TypeIcon && (
                <TypeIcon className={cn('size-5 flex-shrink-0', iconStyle)} />
              )}

              <span className={iconStyle}>{claim?.claimItemType?.name}</span>
            </div>
            {claim?.numProject && (
              <span>{'№ проектн.: ' + claim?.numProject}</span>
            )}
            {claim?.sectionOrder && (
              <span>{'№ в секц.: ' + claim?.sectionOrder}</span>
            )}
            {claim?.floor && <span>{'этаж: ' + claim?.floor}</span>}
            {claim?.unit && <span>{'блок: ' + claim?.unit}</span>}
            {claim?.section && <span>{'секция: ' + claim?.floor}</span>}
            {claim?.roomCount && <span>{'комнат: ' + claim?.roomCount}</span>}
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

      <Separator className="" />

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex w-full flex-row items-center justify-start gap-2 truncate',
              '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
              'first:[&>*]:border-l-0 first:[&>*]:pl-0',
            )}
          >
            <div className="w-24 flex-shrink-0 font-semibold">Включение:</div>
            <div className="flex-shrink-0">
              {claim?.claimRegistryDate
                ? format(claim?.claimRegistryDate, 'dd.MM.yyyy')
                : 'без даты'}
            </div>
            {claim?.legalAct && (
              <div className="w-0 flex-grow font-thin">{claim?.legalAct}</div>
            )}
            {claim?.basis && (
              <div className="w-0 flex-grow font-thin">{claim?.basis}</div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom">
            <TooltipArrow />
            <div className="flex max-w-[300px] flex-col gap-0">
              {claim?.claimRegistryDate && (
                <div className="flex items-start justify-between">
                  <span>Требование внесено в реестр:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {format(claim?.claimRegistryDate, 'dd.MM.yyyy')}
                  </span>
                </div>
              )}
              {claim?.basis && (
                <div className="flex flex-col items-start justify-between">
                  <span>Основание:</span>
                  <span className="text-muted-foreground font-normal">
                    {claim?.basis}
                  </span>
                </div>
              )}
              {claim?.legalAct && (
                <div className="flex flex-col items-start justify-between">
                  <span>Решение суда:</span>
                  <span className="text-muted-foreground font-normal">
                    {claim?.legalAct}
                  </span>
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>

      {claim?.changeBasis && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex w-full flex-row items-center justify-start gap-2 truncate',
                '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
                'first:[&>*]:border-l-0 first:[&>*]:pl-0',
              )}
            >
              <div className="w-24 flex-shrink-0 font-semibold">Изменение:</div>
              <div className="w-0 flex-grow font-thin">
                {claim?.changeBasis}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[400px] flex-col gap-0">
                <div className="flex flex-col items-start justify-between">
                  <span>Основание изменения:</span>
                  <span className="text-muted-foreground font-normal">
                    {claim?.changeBasis}
                  </span>
                </div>
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {(claim?.claimExclusionReason || claim?.claimExclusionDate) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex w-full flex-row items-center justify-start gap-2 truncate',
                '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
                'first:[&>*]:border-l-0 first:[&>*]:pl-0',
              )}
            >
              <div className="w-24 flex-shrink-0 font-semibold">
                Исключение:
              </div>
              <div className="flex-shrink-0">
                {claim?.claimExclusionDate
                  ? format(claim?.claimExclusionDate, 'dd.MM.yyyy')
                  : 'без даты'}
              </div>
              <div className="w-0 flex-grow font-thin">
                {claim?.claimExclusionReason}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[400px] flex-col gap-0">
                {claim?.claimExclusionDate && (
                  <div className="flex items-start justify-between">
                    <span>Запись об исключении требования:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {format(claim?.claimExclusionDate, 'dd.MM.yyyy')}
                    </span>
                  </div>
                )}
                {claim?.claimExclusionReason && (
                  <div className="flex flex-col items-start justify-between">
                    <span>Причины исключения:</span>
                    <span className="text-muted-foreground font-normal">
                      {claim?.claimExclusionReason}
                    </span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {(claim?.claimSettlementReason || claim?.claimSettlementDate) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex w-full flex-row items-center justify-start gap-2 truncate',
                '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
                'first:[&>*]:border-l-0 first:[&>*]:pl-0',
              )}
            >
              <div className="w-24 flex-shrink-0 font-semibold">Погашение:</div>
              <div className="flex-shrink-0">
                {claim?.claimSettlementDate
                  ? format(claim?.claimSettlementDate, 'dd.MM.yyyy')
                  : 'без даты'}
              </div>
              <div className="w-0 flex-grow font-thin">
                {claim?.claimSettlementReason}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[400px] flex-col gap-0">
                {claim?.claimSettlementDate && (
                  <div className="flex items-start justify-between">
                    <span>Запись о погашении требования:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {format(claim?.claimSettlementDate, 'dd.MM.yyyy')}
                    </span>
                  </div>
                )}
                {claim?.claimSettlementReason && (
                  <div className="flex flex-col items-start justify-between">
                    <span>Причины погашения:</span>
                    <span className="text-muted-foreground font-normal">
                      {claim?.claimSettlementReason}
                    </span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {/* 
      <div> {claim?.changeBasis}</div>

      <div>
        {claim?.claimRegistryDate
          ? format(claim?.claimRegistryDate, 'dd.MM.yyyy')
          : '-'}
      </div>
      <div> Погашение</div>
      <div> {claim?.claimSettlementReason}</div>
      <div>
        {claim?.claimSettlementDate
          ? format(claim?.claimSettlementDate, 'dd.MM.yyyy')
          : '-'}
      </div>
      <div> Исключение</div>
      <div> {claim?.claimExclusionReason}</div>
      <div>
        {claim?.claimExclusionDate
          ? format(claim?.claimExclusionDate, 'dd.MM.yyyy')
          : '-'}
      </div>
      <div> {claim?.creditorName}</div>
      <div> {claim?.identificationNotes}</div>
      <div> {claim?.notes}</div>
      <div> {claim?.subject}</div> */}
    </div>
  );
};

export { EquityClaimElement };
