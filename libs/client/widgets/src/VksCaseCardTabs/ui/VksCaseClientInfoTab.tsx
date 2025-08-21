import {
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksCaseDetails } from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { Snail, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { ZodNullable } from 'zod';
import { gradeSourceStyles } from '@urgp/client/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

type VksCaseClientInfoTabProps = {
  entity?: VksCaseDetails;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const VksCaseClientInfoTab = (
  props: VksCaseClientInfoTabProps,
): JSX.Element | null => {
  const {
    entity,
    className,
    label = 'Информация от заявителя',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const {
    icon: GradeSourceIcon,
    iconStyle: gradeSourceIconStyle,
    label: gradeSourceLabel,
  } = gradeSourceStyles?.[
    (entity?.gradeSource || 'none') as keyof typeof gradeSourceStyles
  ] || Object.values(gradeSourceStyles)[0];

  const problems = [
    entity?.problemAudio === '1' ? 'Аудио' : null,
    entity?.problemVideo === '1' ? 'Видео' : null,
    entity?.problemConnection === '1' ? 'Соединение' : null,
    entity?.problemTech === '1' ? 'Техническая' : null,
  ]
    .filter(Boolean)
    .join('; ');

  const vksSearchSpeed = parseInt(entity?.vksSearchSpeed || '0') || 0;
  // vksSearchSpeed

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName="p-0"
      // contentClassName={cn(
      //   'grid grid-cols-[auto_auto_auto_1fr] [&>*]:px-3 [&>*]:py-1 p-0',
      //   contentClassName,
      // )}
      accordionItemName={accordionItemName}
    >
      {!entity ? (
        <Skeleton className={cn('h-8', className)} />
      ) : (
        <div
          className={cn(
            'grid grid-cols-[auto_1fr_auto_1fr] p-0 [&>*]:px-3 [&>*]:py-1',
            contentClassName,
          )}
        >
          {entity?.phone && (
            <>
              <div className="bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold">
                Телефон:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate p-1',
                  entity?.email ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.phone}
                </p>
              </div>
            </>
          )}
          {entity?.email && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold',
                  entity?.phone ? 'border-l' : '',
                )}
              >
                Email:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate p-1',
                  entity?.phone ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.email}
                </p>
              </div>
            </>
          )}

          {problems && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Проблемы:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">{problems}</p>
              </div>
            </>
          )}
          {entity?.problemSummary && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Суть:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">
                  {entity?.problemSummary}
                </p>
              </div>
            </>
          )}
          {entity?.privatizationAddress && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Адрес:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">
                  {entity?.privatizationAddress}
                </p>
              </div>
            </>
          )}
          {entity?.contractNumber && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Дог-р.:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">
                  {entity?.contractNumber}
                </p>
              </div>
            </>
          )}
          {entity?.letterNumber && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Письмо:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">
                  {entity?.letterNumber}
                </p>
              </div>
            </>
          )}
          {entity?.flsNumber && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                ФЛС:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                <p className="my-auto w-full font-light">{entity?.flsNumber}</p>
              </div>
            </>
          )}
          {(entity?.clientSurveyJoined !== null ||
            entity?.clientSurveyConsultationReceived !== null) && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Опросник:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                {entity?.clientSurveyJoined === true ? (
                  <>
                    <ThumbsUp className="-mr-1 size-4 flex-shrink-0 text-emerald-700" />
                    <p className="my-auto border-r pr-2 text-emerald-700">
                      Оператор присоединился
                    </p>
                  </>
                ) : entity?.clientSurveyJoined === false ? (
                  <>
                    <ThumbsDown className="-mr-1 size-4 flex-shrink-0 text-red-700" />
                    <p className="my-auto border-r pr-2 text-red-700">
                      Оператор не присоединился
                    </p>
                  </>
                ) : null}
                {entity?.clientSurveyConsultationReceived === true ? (
                  <>
                    <ThumbsUp className="-mr-1 size-4 flex-shrink-0 text-emerald-700" />
                    <p className="my-auto border-r pr-2 text-emerald-700">
                      Консультация предоставлена
                    </p>
                  </>
                ) : entity?.clientSurveyConsultationReceived === false ? (
                  <>
                    <ThumbsDown className="-mr-1 size-4 flex-shrink-0 text-red-700" />
                    <p className="my-auto border-r pr-2 text-red-700">
                      Консультация не предоставлена
                    </p>
                  </>
                ) : null}
              </div>
            </>
          )}

          {(entity?.grade || entity?.gradeComment) && (
            <>
              <div className="bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold">
                Оценка:
              </div>
              <div
                className={cn(
                  'text-muted-foreground flex items-start justify-start gap-2 border-t px-2 font-light',
                  vksSearchSpeed > 0 ? 'col-span-1' : 'col-span-3',
                )}
              >
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
                          key={'star_' + i}
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

          {vksSearchSpeed > 0 && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                  entity?.grade || entity?.gradeComment ? 'border-l' : '',
                )}
              >
                Скор. поиска:
              </div>
              <div
                className={cn(
                  'text-muted-foreground flex items-start justify-start gap-2 border-t px-2 font-light',
                  entity?.grade || entity?.gradeComment
                    ? 'col-span-1'
                    : 'col-span-3',
                )}
              >
                <p className="flex flex-row items-center justify-start gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Snail
                      key={'speed_' + i}
                      className={cn(
                        'size-5',
                        i > vksSearchSpeed - 1
                          ? 'text-gray-300'
                          : 'fill-blue-300 text-blue-500',
                      )}
                    />
                  ))}
                  <span className="ml-1">{vksSearchSpeed}</span>
                </p>
              </div>
            </>
          )}

          {entity?.grade && entity?.gradeComment && (
            <div className="text-muted-foreground col-span-4 flex items-start justify-start gap-2 border-t px-2 font-light">
              <span className="ml-1">{entity?.gradeComment || '-'}</span>
            </div>
          )}
        </div>
      )}
    </CardTab>
  );
};

export { VksCaseClientInfoTab };
