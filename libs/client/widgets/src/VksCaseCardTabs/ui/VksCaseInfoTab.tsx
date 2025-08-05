import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { VksCaseDetails } from '@urgp/shared/entities';

import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CardTab } from '@urgp/client/features';
import {
  bookingSourceStyles,
  clientTypeStyles,
  vksDepartmentStyles,
  gradeSourceStyles,
  propertyTypeStyles,
  vksCaseStatusStyles,
} from '@urgp/client/entities';
import { ExternalLink, Star } from 'lucide-react';
// import {
//   bookingSourceStyles,
//   clientTypeStyles,
//   departmentStyles,
//   gradeSourceStyles,
//   propertyTypeStyles,
//   vksCaseStatusStyles,
// } from 'libs/client/entities/src/vks/config/vksStyles';

type VksCaseInfoTabProps = {
  entity?: VksCaseDetails;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const VksCaseInfoTab = (props: VksCaseInfoTabProps): JSX.Element | null => {
  const {
    entity,
    className,
    label = null,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;
  const i = useUserAbility();

  if (!entity) return null;

  const { icon: DepartmentIcon, iconStyle: departmentIconStyle } =
    vksDepartmentStyles?.[
      (entity?.departmentId || 0) as keyof typeof vksDepartmentStyles
    ] || Object.values(vksDepartmentStyles)[0];

  const { icon: ClientIcon, iconStyle: clientIconStyle } =
    clientTypeStyles?.[
      (entity?.clientType || 'Физическое лицо') as keyof typeof clientTypeStyles
    ] || Object.values(clientTypeStyles)[0];

  const { icon: PropertyTypeIcon, iconStyle: propertyTypeIconStyle } =
    propertyTypeStyles?.[
      (entity?.propertyType ||
        'Жилищные вопросы') as keyof typeof propertyTypeStyles
    ] || Object.values(propertyTypeStyles)[0];

  const { icon: CaseStatusIcon, iconStyle: caseStatusIconStyle } =
    vksCaseStatusStyles?.[
      (entity?.status || 'обслужен') as keyof typeof vksCaseStatusStyles
    ] || Object.values(vksCaseStatusStyles)[0];

  const { icon: BookingSourceIcon, iconStyle: bookingSourceIconStyle } =
    bookingSourceStyles?.[
      (entity?.bookingSource || 'Онлайн') as keyof typeof bookingSourceStyles
    ] || Object.values(bookingSourceStyles)[0];

  // const {
  //   icon: GradeSourceIcon,
  //   iconStyle: gradeSourceIconStyle,
  //   label: gradeSourceLabel,
  // } = gradeSourceStyles?.[
  //   (entity?.gradeSource || 'none') as keyof typeof gradeSourceStyles
  // ] || Object.values(gradeSourceStyles)[0];

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'grid grid-cols-[auto_1fr_auto_1fr] [&>*]:px-3 [&>*]:py-1 p-0',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Статус:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b p-1 ">
        {CaseStatusIcon && (
          <CaseStatusIcon
            className={cn(
              'my-auto -mr-1 size-5 shrink-0 ',
              caseStatusIconStyle,
            )}
          />
        )}
        <p className="my-auto w-full truncate font-light">
          {entity?.status || '-'}
        </p>
      </div>

      <div className="bg-muted-foreground/5 border-b border-l px-2 py-1 text-right font-bold">
        Сервис:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b border-l p-1 font-light">
        {BookingSourceIcon && (
          <BookingSourceIcon
            className={cn('my-auto size-5 shrink-0 ', bookingSourceIconStyle)}
          />
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <p className="my-auto w-full truncate">
              <span>{entity?.serviceName || '-'}</span>
            </p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />

              <div className="flex max-w-[500px] flex-col gap-2">
                {entity?.bookingSource && (
                  <p>
                    <span>Источник записи:</span>
                    <span className="text-muted-foreground ml-2 text-right font-normal">
                      {entity?.bookingSource}
                    </span>
                  </p>
                )}
                {entity?.bookingResource && (
                  <p>
                    <span>Ресурс:</span>
                    <span className="text-muted-foreground ml-2 text-right font-normal">
                      {entity?.bookingResource}
                    </span>
                  </p>
                )}
                {entity?.serviceFullName && (
                  <p>
                    <span>Сервис:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {entity?.serviceFullName}
                    </span>
                  </p>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </div>

      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Ссылки:
      </div>
      <div className="group col-span-3 flex items-start justify-start gap-2 truncate border-b p-1">
        {entity?.operatorLink && (
          <>
            <a
              className="peer/consult my-auto font-light hover:underline"
              href={entity?.operatorLink}
              target="_blank"
            >
              <span>Консультация</span>
            </a>
            <ExternalLink className="-ml-1 mt-1 size-4 shrink-0 flex-grow-0 opacity-0 peer-hover/consult:opacity-100" />
          </>
        )}
        {entity?.operatorSurveyExtralinkUrl && (
          <>
            <a
              className="peer/operator my-auto border-l pl-4 font-light hover:underline"
              href={entity?.operatorSurveyExtralinkUrl}
              target="_blank"
            >
              <span>Опрос оператора</span>
            </a>
            <ExternalLink className="-ml-1 mt-1 size-4 shrink-0 flex-grow-0 opacity-0 peer-hover/operator:opacity-100" />
          </>
        )}
        {entity?.clientSurveyExtralinkUrl && (
          <>
            <a
              className="peer/client my-auto border-l pl-4 font-light hover:underline"
              href={entity?.clientSurveyExtralinkUrl}
              target="_blank"
            >
              <span>Опрос клиента</span>
            </a>
            <ExternalLink className="-ml-1 mt-1 size-4 shrink-0 flex-grow-0 opacity-0 peer-hover/client:opacity-100" />
          </>
        )}
      </div>

      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Клиент:
      </div>
      <div className="text-muted-foreground col-span-3 flex items-start justify-start gap-2 truncate border-b font-light">
        {ClientIcon && (
          <ClientIcon
            className={cn('my-auto size-5 shrink-0 ', clientIconStyle)}
          />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="my-auto w-full truncate">
              {entity?.clientFio || '-'}
            </p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[500px] flex-col gap-0">
                {entity?.clientType && (
                  <p>
                    <span>Тип:</span>
                    <span className="text-muted-foreground ml-2 text-right font-normal">
                      {entity?.clientType}
                    </span>
                  </p>
                )}

                {entity?.deputyFio && (
                  <p>
                    <span>Представитель:</span>
                    <span className="text-muted-foreground ml-2 text-right font-normal">
                      {entity?.deputyFio}
                    </span>
                  </p>
                )}
                {entity?.participantFio && (
                  <p>
                    <span>Участник:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {entity?.participantFio}
                    </span>
                  </p>
                )}
                {entity?.orgName && (
                  <p>
                    <span>Организация:</span>
                    <span className="text-muted-foreground ml-2 text-right font-normal">
                      {entity?.orgName}
                    </span>
                  </p>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </div>

      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Упр.:
      </div>
      <div className="text-muted-foreground col-span-3 flex items-start justify-start gap-2 truncate border-b font-light">
        {DepartmentIcon && (
          <DepartmentIcon
            className={cn('mx-1 my-auto size-3 shrink-0 ', departmentIconStyle)}
          />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="my-auto w-full truncate">
              {entity?.departmentName || '-'}
            </p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="max-w-80">{entity?.departmentFullName}</div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </div>

      <div className="bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold">
        Тип:
      </div>
      <div className="text-muted-foreground col-span-3 flex items-start justify-start gap-2 px-2 font-light">
        {PropertyTypeIcon && (
          <PropertyTypeIcon
            className={cn('my-auto size-5 shrink-0 ', propertyTypeIconStyle)}
          />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="">{entity?.propertyType || '-'}</p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="max-w-80">{entity?.bookingResource}</div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </div>
      {/* 
      {entity?.grade && (
        <>
          <div className="bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold">
            Оценка:
          </div>
          <div className="text-muted-foreground col-span-3 flex items-start justify-start gap-2 border-t px-2 font-light">
            {GradeSourceIcon && (
              <GradeSourceIcon
                className={cn(
                  'my-auto size-5 shrink-0 opacity-30',
                  gradeSourceIconStyle,
                )}
              />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex flex-row items-center justify-start gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      id={'star_' + i}
                      className={cn(
                        'size-5',
                        i > (entity?.grade || 0) - 1
                          ? 'text-gray-300'
                          : 'fill-amber-500 text-amber-500',
                      )}
                    />
                  ))}
                  <span className="ml-1">{entity?.grade || '-'}</span>
                </p>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent side="bottom">
                  <TooltipArrow />
                  <div className="flex max-w-[500px] flex-col gap-2">
                    {entity?.grade && (
                      <p>
                        <span>Оценка:</span>
                        <span className="text-muted-foreground ml-2 text-right font-normal">
                          {entity?.grade}
                        </span>
                      </p>
                    )}
                    {entity?.gradeSource && (
                      <p>
                        <span>Источник оценки:</span>
                        <span className="text-muted-foreground ml-2 text-right font-normal">
                          {gradeSourceLabel}
                        </span>
                      </p>
                    )}

                    {entity?.gradeComment && (
                      <p>
                        <span>Комментарий:</span>
                        <span className="text-muted-foreground ml-2 font-normal">
                          {entity?.gradeComment}
                        </span>
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </div>
        </>
      )}
      {entity?.grade && entity?.gradeComment && (
        <div className="text-muted-foreground col-span-4 flex items-start justify-start gap-2 border-t px-2 font-light">
          <span className="ml-1">{entity?.gradeComment || '-'}</span>
        </div>
      )} */}
    </CardTab>
  );
};

export { VksCaseInfoTab };
