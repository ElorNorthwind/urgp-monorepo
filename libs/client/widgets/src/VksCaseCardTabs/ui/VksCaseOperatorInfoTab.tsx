import {
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksCaseDetails } from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import {
  Mail,
  MailCheck,
  MailX,
  Snail,
  SquareCheck,
  SquareX,
  Star,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  UserX,
} from 'lucide-react';
import { ZodNullable } from 'zod';
import { gradeSourceStyles } from '@urgp/client/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';

type VksCaseOperatorInfoTabProps = {
  entity?: VksCaseDetails;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const VksCaseOperatorInfoTab = (
  props: VksCaseOperatorInfoTabProps,
): JSX.Element | null => {
  const {
    entity,
    className,
    label = 'Информация от оператора',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

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
          {entity?.operatorFio && (
            <>
              <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
                Оператор:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-b p-1',
                )}
              >
                <p className="my-auto w-full font-light">
                  {entity?.operatorFio}
                </p>
              </div>
            </>
          )}
          {entity?.operatorSurveyConsultationType && (
            <>
              <div className="bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold">
                Тип консультации:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate p-1',
                  entity?.operatorSurveyDepartment ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.operatorSurveyConsultationType}
                </p>
              </div>
            </>
          )}
          {entity?.operatorSurveyDepartment && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold',
                  entity?.operatorSurveyConsultationType ? 'border-l' : '',
                )}
              >
                Подразделение:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate p-1',
                  entity?.operatorSurveyConsultationType ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.operatorSurveyDepartment}
                </p>
              </div>
            </>
          )}

          {entity?.operatorSurveyMood && (
            <>
              <div className="bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold">
                Настрой:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate border-t p-1',
                  entity?.operatorSurveyInfoSource ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.operatorSurveyMood}
                </p>
              </div>
            </>
          )}

          {entity?.operatorSurveyInfoSource && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                  entity?.operatorSurveyMood ? 'border-l' : '',
                )}
              >
                Откуда узнал:
              </div>
              <div
                className={cn(
                  'flex items-start justify-start gap-2 truncate border-t p-1',
                  entity?.operatorSurveyMood ? '' : 'col-span-3',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.operatorSurveyInfoSource}
                </p>
              </div>
            </>
          )}

          {entity?.operatorSurveyProblems && (
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
                  'col-span-3 flex items-start justify-start gap-2 truncate border-t p-1',
                )}
              >
                <p className="my-auto w-full truncate font-light">
                  {entity?.operatorSurveyProblems?.join('; ') || '-'}
                </p>
              </div>
            </>
          )}
          {(entity?.operatorSurveyIsClient !== null ||
            entity?.operatorSurveyIsHousing !== null ||
            entity?.operatorSurveyNeedsAnswer !== null) && (
            <>
              <div
                className={cn(
                  'bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold',
                )}
              >
                Флаги:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 truncate border-t p-1',
                )}
              >
                {entity?.operatorSurveyIsClient === true ? (
                  <>
                    <UserCheck className="-mr-1 size-4 flex-shrink-0 text-emerald-700" />
                    <p className="my-auto border-r pr-2 text-emerald-700">
                      Клиент ДГИ
                    </p>
                  </>
                ) : entity?.operatorSurveyIsClient === false ? (
                  <>
                    <UserX className="-mr-1 size-4 flex-shrink-0 text-red-700" />
                    <p className="my-auto border-r pr-2 text-red-700">
                      Не клиент
                    </p>
                  </>
                ) : null}
                {entity?.operatorSurveyIsHousing === true ? (
                  <>
                    <SquareCheck className="-mr-1 size-4 flex-shrink-0 text-sky-700" />
                    <p className="my-auto border-r pr-2 text-sky-700">
                      Жил. вопрос
                    </p>
                  </>
                ) : entity?.operatorSurveyIsHousing === false ? (
                  <>
                    <SquareX className="-mr-1 size-4 flex-shrink-0 text-amber-700" />
                    <p className="my-auto border-r pr-2 text-amber-700">
                      Не жил. вопрос
                    </p>
                  </>
                ) : null}
                {entity?.operatorSurveyNeedsAnswer === true ? (
                  <>
                    <MailCheck className="-mr-1 size-4 flex-shrink-0 text-violet-700" />
                    <p className="my-auto border-r pr-2 text-violet-700">
                      Нужен ответ
                    </p>
                  </>
                ) : entity?.operatorSurveyNeedsAnswer === false ? (
                  <>
                    <MailX className="-mr-1 size-4 flex-shrink-0 text-stone-700" />
                    <p className="my-auto border-r pr-2 text-stone-700">
                      Ответ не требуется
                    </p>
                  </>
                ) : null}
              </div>
            </>
          )}

          {(entity?.operatorSurveyDocType ||
            entity?.operatorSurveyDocNum ||
            entity?.operatorSurveyDocDate) && (
            <>
              <div className="bg-muted-foreground/5 border-r border-t px-2 py-1 text-right font-bold">
                Документ:
              </div>
              <div
                className={cn(
                  'col-span-3 flex items-start justify-start gap-2 border-t p-1',
                )}
              >
                {entity?.operatorSurveyDocType && (
                  <p className="my-auto truncate font-light">
                    {entity?.operatorSurveyDocType}
                  </p>
                )}

                {entity?.operatorSurveyDocNum && (
                  <p className="font my-auto truncate border-l pl-2">
                    {entity?.operatorSurveyDocNum}
                  </p>
                )}
                {entity?.operatorSurveyDocDate && (
                  <p className="my-auto truncate border-l pl-2 font-light">
                    {'от ' + entity?.operatorSurveyDocDate}
                  </p>
                )}
              </div>
            </>
          )}

          {entity?.operatorSurveySummary && (
            <div className="text-muted-foreground col-span-4 flex items-start justify-start gap-2 border-t px-2 font-light">
              <span className="ml-1">
                {entity?.operatorSurveySummary || '-'}
              </span>
            </div>
          )}
        </div>
      )}
    </CardTab>
  );
};

export { VksCaseOperatorInfoTab };
