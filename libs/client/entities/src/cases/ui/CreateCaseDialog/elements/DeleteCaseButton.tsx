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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDeleteCase } from '../../../api/casesApi';
import { Case } from '@urgp/shared/entities';
import { CaseCardHeader } from '../../CaseCard/CaseCardHeader';
import { toast } from 'sonner';

type DeleteCaseButtonProps = {
  controlCase: Case;
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
                  dispatch(setCaseFormValuesEmpty());
                  dispatch(setCaseFormState('close'));
                  toast.success('Заявка удалена');
                })
                .catch((rejected: any) =>
                  toast.error('Не удалось удалить заявку', {
                    description: rejected.data?.message || 'Неизвестная ошибка',
                  }),
                )
            }
          >
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteCaseButton };
