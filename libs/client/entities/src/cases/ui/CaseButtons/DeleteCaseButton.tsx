import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  setCaseFormState,
  setCaseFormValuesEmpty,
  setProblemFormState,
  setProblemFormValuesEmpty,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { SquareX, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CaseClasses, CaseFull, DialogFormState } from '@urgp/shared/entities';
import { toast } from 'sonner';
import { useDeleteCase } from '../../api/casesApi';
import { CaseCardHeader } from '../CaseCard/CaseCardHeader';

type DeleteCaseButtonProps = {
  controlCase: CaseFull;
  className?: string;
};

const DeleteCaseButton = ({
  controlCase,
  className,
}: DeleteCaseButtonProps): JSX.Element | null => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCase, { isLoading: isDeleteLoading }] = useDeleteCase();
  const dispatch = useDispatch();

  const i = useUserAbility();

  if (i.cannot('delete', controlCase)) return null;

  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              disabled={isDeleteLoading || i.cannot('delete', controlCase)}
              variant="outline"
              role="button"
              className={cn(
                'flex size-10 flex-shrink-0 flex-row gap-2 p-0',
                className,
              )}
            >
              <Trash2 className="size-5 flex-shrink-0" />
              {/* <span>Удалить</span> */}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {controlCase.class === CaseClasses?.problem
            ? 'Удалить системную проблему'
            : 'Удалить заявку'}
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          {controlCase.class === CaseClasses?.problem ? (
            <p>Вы точно хотите удалить системную проблему?</p>
          ) : (
            <p>Вы точно хотите удалить заявку?</p>
          )}
        </DialogHeader>
        <DialogDescription>
          <CaseCardHeader controlCase={controlCase} />
        </DialogDescription>
        <p className="flex flex-row items-center justify-stretch gap-2">
          <Button
            disabled={i.cannot('update', controlCase)}
            variant="default"
            onClick={() => setDeleteOpen(false)}
            className="flex-grow"
          >
            <SquareX className="size-4 flex-shrink-0" />
            <span>Отмена</span>
          </Button>
          <Button
            variant="destructive"
            className="flex-grow"
            onClick={() =>
              deleteCase({ id: controlCase.id })
                .unwrap()
                .then(() => {
                  setDeleteOpen(false);
                  if (controlCase.class === CaseClasses.problem) {
                    dispatch(setProblemFormValuesEmpty());
                    dispatch(setProblemFormState(DialogFormState.close));
                  } else if (controlCase.class === CaseClasses.incident) {
                    dispatch(setCaseFormValuesEmpty());
                    dispatch(setCaseFormState(DialogFormState.close));
                  }
                  toast.success('Заявка удалена');
                })
                .catch((rejected: any) =>
                  toast.error('Не удалось удалить заявку', {
                    description: rejected.data?.message || 'Неизвестная ошибка',
                  }),
                )
            }
          >
            <Trash2 className="size-4 flex-shrink-0" />
            <span>Удалить</span>
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteCaseButton };
