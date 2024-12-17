import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { useEffect, useState } from 'react';
import { SquarePlus } from 'lucide-react';
import { CreateStageForm } from './CreateStageForm';

type CreateStageDialogProps = {
  caseId: number;
  className?: string;
  editStage?: ControlStage | null;
  setEditStage?: React.Dispatch<React.SetStateAction<ControlStage | null>>;
};

const CreateStageDialog = ({
  caseId,
  className,
  editStage,
  setEditStage,
}: CreateStageDialogProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editStage) {
      setIsOpen(true);
    }
  }, [editStage]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        open === false && setEditStage && setEditStage(null);
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="h-8 p-1 pr-2"
          onClick={() => setIsOpen(true)}
        >
          <SquarePlus className="mr-1 size-4 flex-shrink-0" />
          <span>Новый этап</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editStage ? 'Изменить этап' : 'Добавить этап'}
          </DialogTitle>
          <DialogDescription>
            {editStage
              ? 'Внесите нужные правки по этапу'
              : 'Внесите данные для создания этапа'}
          </DialogDescription>
        </DialogHeader>
        <CreateStageForm
          caseId={caseId}
          className={className}
          widthClassName={'w-[calc(425px-3rem)]'}
          onClose={() => setIsOpen(false)}
          editStage={editStage}
          setEditStage={setEditStage}
        />
      </DialogContent>
    </Dialog>
  );
};

export { CreateStageDialog };
