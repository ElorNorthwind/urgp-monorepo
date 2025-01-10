import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  selectCurrentUser,
  setEditCase,
  Tooltip,
  TooltipContent,
  useUserAbility,
} from '@urgp/client/shared';
import { ApproveDialog, ConfirmationButton } from '@urgp/client/widgets';
import { Case } from '@urgp/shared/entities';
import { ChevronDown, Edit, ThumbsUp, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react/jsx-runtime';
import { CaseCardHeader } from './CaseCardHeader';
import { useDeleteCase } from '../../api/casesApi';
import { toast } from 'sonner';

type CaseCardFooterProps = {
  className?: string;
  controlCase: Case;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element => {
  const { className, controlCase } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCase, { isLoading: isDeleteLoading }] = useDeleteCase();

  const i = useUserAbility();

  if (
    !controlCase ||
    (i.cannot('delete', controlCase) &&
      i.cannot('update', controlCase) &&
      i.cannot('approve', controlCase))
  ) {
    return <Fragment />;
  }

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 mt-auto flex w-full flex-shrink-0 justify-stretch gap-4 truncate p-4',
        className,
      )}
    >
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                disabled={isDeleteLoading || i.cannot('delete', controlCase)}
                variant="outline"
                role="button"
                className="flex size-10 flex-shrink-0 flex-row gap-2 p-0"
              >
                <Trash2 className="size-5" />
                {/* <span>Удалить</span> */}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Удалить заявку</TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <p>Вы точно хотите удалить заявку?</p>
          </DialogHeader>
          <DialogDescription>
            <CaseCardHeader controlCase={controlCase} />
          </DialogDescription>
          <div className="flex flex-row items-center justify-stretch gap-2">
            <Button
              disabled={i.cannot('update', controlCase)}
              variant="default"
              onClick={() => setDeleteOpen(false)}
              className="flex-grow"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              className="flex-grow"
              onClick={() =>
                deleteCase({ id: controlCase.id })
                  .unwrap()
                  .then(() => {
                    setDeleteOpen(false);
                    toast.success('Заявка удалена');
                    dispatch(setEditCase(null));
                  })
                  .catch((rejected: any) =>
                    toast.error('Не удалось удалить заявку', {
                      description:
                        rejected.data?.message || 'Неизвестная ошибка',
                    }),
                  )
              }
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        role="button"
        className="flex flex-grow flex-row gap-2"
        onClick={() => dispatch(setEditCase(controlCase))}
      >
        <Edit className="size-5" />
        <span>Редактировать</span>
      </Button>
      {i.can('approve', controlCase) && (
        <ApproveDialog
          entityId={controlCase.id}
          entityType="case"
          displayedElement={
            <div>
              <CaseCardHeader controlCase={controlCase} className="rounded-t" />
              <div className="bg-sidebar/80 max-h-50 overflow-hidden rounded-b border-t p-4">
                {controlCase?.payload?.description}
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export { CaseCardFooter };
