import { Separator } from '@radix-ui/react-separator';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  Button,
  cn,
  selectCurrentUser,
  setEditCase,
  Tooltip,
  TooltipContent,
} from '@urgp/client/shared';
import { ConfirmationButton } from '@urgp/client/widgets';
import { Case } from '@urgp/shared/entities';
import { ChevronDown, Edit, ThumbsUp, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react/jsx-runtime';

type CaseCardFooterProps = {
  className?: string;
  controlCase: Case;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element => {
  const { className, controlCase } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  if (
    !user ||
    !controlCase ||
    (controlCase?.author.id !== user.id &&
      controlCase?.payload?.approver?.id !== user.id)
  )
    return <Fragment />;

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 mt-auto flex w-full flex-shrink-0 justify-stretch gap-4 truncate p-4',
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            role="button"
            className="flex size-10 flex-shrink-0 flex-row gap-2 p-0"
          >
            <Trash2 className="size-5" />
            {/* <span>Удалить</span> */}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Удалить заявку</TooltipContent>
      </Tooltip>

      <Button
        variant="outline"
        role="button"
        className="flex flex-grow flex-row gap-2"
        onClick={() => dispatch(setEditCase(controlCase))}
      >
        <Edit className="size-5" />
        <span>Редактировать</span>
      </Button>
      {controlCase?.payload?.approver?.id === user.id &&
        controlCase?.payload?.approveStatus === 'pending' && (
          <Button
            variant="default"
            role="button"
            className="flex flex-grow flex-row gap-2"
          >
            <ThumbsUp className="size-5" />
            <span>Согласовать</span>
          </Button>
        )}
    </div>
  );
};

export { CaseCardFooter };
