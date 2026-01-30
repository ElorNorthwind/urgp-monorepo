import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksCase } from '@urgp/shared/entities';
import {
  gradeSourceStyles,
  vksDepartmentStyles,
} from '../../../config/vksStyles';
import { Star } from 'lucide-react';

function VksCaseGradeCell(props: CellContext<VksCase, number>): JSX.Element {
  const rowData = props.row?.original;
  const isTransitional = [
    'отменено ОИВ',
    'отменено пользователем',
    'талон не был взят',
  ].includes(rowData?.status || '');

  const { label: gradeSourceLabel } =
    gradeSourceStyles?.[
      (rowData?.gradeSource || 'none') as keyof typeof gradeSourceStyles
    ] || Object.values(gradeSourceStyles)[0];

  if (props.getValue() === 0)
    return (
      <div
        className={cn(
          'text-muted-foreground flex w-full flex-col truncate font-thin',
          isTransitional && 'opacity-50',
        )}
      >
        <span>Оценка не оставлена</span>
        {rowData?.gradeComment && (
          <span className="text-xs font-thin opacity-60">
            {rowData?.gradeComment}
          </span>
        )}
      </div>
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex flex-1 flex-shrink flex-col items-start justify-start truncate',
            isTransitional && 'opacity-50',
          )}
        >
          {rowData?.isTechnical ? (
            <div className="text-muted-foreground text-nowrap text-lg font-bold">
              не учитывается
            </div>
          ) : (
            <>
              <div
                className={cn(
                  'flex flex-row items-center justify-start gap-1 truncate',
                )}
              >
                <span className="mr-1 text-lg">{rowData?.grade || '-'}</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={'star_' + i}
                    className={cn(
                      'size-5 flex-shrink-0',
                      i > (props.getValue() || 0) - 1
                        ? 'text-gray-300'
                        : 'fill-amber-500 text-amber-500',
                    )}
                  />
                ))}
              </div>
              <div
                className={cn(
                  'text-muted-foreground -my-1 w-full truncate text-xs font-thin',
                  !rowData?.gradeComment && 'opacity-50',
                )}
              >
                {rowData?.gradeComment || 'Комментарий не оставлен'}
              </div>
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[400px] flex-col gap-0">
            <div className="font-bold">Оценка</div>
            <div className="flex items-start justify-between">
              <span>Баллы:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.grade || 'нет оценки'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Источник оценки:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {gradeSourceLabel || 'оценка не проставлена'}
              </span>
            </div>
            {rowData?.gradeComment && (
              <>
                <Separator className="my-1" />
                <p className="">
                  <span>Комментарий:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {rowData?.gradeComment}
                  </span>
                </p>
              </>
            )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksCaseGradeCell };
