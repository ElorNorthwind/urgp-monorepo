import {
  Button,
  cn,
  setStageFormState,
  useUserAbility,
  Tooltip,
  setStageFormValuesFromStage,
  TooltipTrigger,
  TooltipContent,
  setDispatchFormValuesFromDispatch,
  setDispatchFormState,
} from '@urgp/client/shared';
import { ControlDispatch, ControlStage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { CalendarCog, Pencil, Repeat, Replace } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EditDispatchButtonProps = {
  controlDispatch: ControlDispatch;
  className?: string;
};

const EditDispatchButton = ({
  controlDispatch,
  className,
}: EditDispatchButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('update', controlDispatch))
    return (
      <div
        className={cn('flex h-5 flex-row items-center gap-2 p-0', className)}
      >
        <span>
          {controlDispatch.payload?.dueDate
            ? format(controlDispatch.payload?.dueDate, 'dd.MM.yyyy')
            : '-'}
        </span>
        {controlDispatch.payload.dueDateChanged && (
          <Repeat className="size-3" />
        )}
      </div>
    );

  return (
    // <Tooltip>
    //   <TooltipTrigger asChild>
    <Button
      variant="link"
      className={cn('flex h-5 flex-row items-center gap-2 p-0', className)}
      onClick={() => {
        dispatch(setDispatchFormValuesFromDispatch(controlDispatch));
        dispatch(setDispatchFormState('edit'));
      }}
    >
      <span>
        {controlDispatch.payload?.dueDate
          ? format(controlDispatch.payload?.dueDate, 'dd.MM.yyyy')
          : '-'}
      </span>
      {controlDispatch.payload.dueDateChanged && (
        <Repeat className="size-4 opacity-50" />
      )}
      <CalendarCog className={cn('hidden size-4 group-hover:block')} />
    </Button>
    //   </TooltipTrigger>
    //   <TooltipContent>Редактировать поручение</TooltipContent>
    // </Tooltip>

    // {i.can('update', d) ? (
    // <Button
    //   variant="link"
    //   className="flex h-5 flex-row gap-2 p-0"
    //   onClick={() => dispatch(setEditDispatch(d))}
    // >
    //   <span>
    //     {d.payload?.dueDate
    //       ? format(d.payload?.dueDate, 'dd.MM.yyyy')
    //       : '-'}
    //   </span>
    //   {d.payload.dueDateChanged && (
    //     <Repeat className="size-4 opacity-50" />
    //   )}
    //   <CalendarCog
    //     className={cn('hidden size-4 group-hover:block')}
    //   />
    // </Button>
    // ) : (
    //   <>
    //     <span>
    //       {d.payload?.dueDate
    //         ? format(d.payload?.dueDate, 'dd.MM.yyyy')
    //         : '-'}
    //     </span>
    //     {d.payload.dueDateChanged && (
    //       <Replace className="size-3" />
    //     )}
    //   </>
    // )}
  );
};

export { EditDispatchButton };
