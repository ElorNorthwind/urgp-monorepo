import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { SquarePlus } from 'lucide-react';
import { CreateStageForm } from './CreateStageForm';

type CreateStageDialogProps = {
  caseId: number;
  editStage: 'new' | ControlStage | null;
  setEditStage: React.Dispatch<
    React.SetStateAction<'new' | ControlStage | null>
  >;
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateStageDialog = ({
  caseId,
  className,
  editStage,
  setEditStage,
}: CreateStageDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Sheet
        open={!!editStage}
        onOpenChange={(open) => {
          open === false && setEditStage(null);
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant={'outline'}
            className="h-8 p-1 pr-2"
            onClick={() => setEditStage('new')}
          >
            <SquarePlus className="mr-1 size-4 flex-shrink-0" />
            <span>Новый этап</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          style={
            {
              '--dialog-width': DIALOG_WIDTH,
            } as React.CSSProperties
          }
          className={cn(
            `w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]`,
          )}
        >
          <SheetHeader>
            <SheetTitle className="text-left">
              {editStage ? 'Изменить этап' : 'Добавить этап'}
            </SheetTitle>
            <SheetDescription className="text-left">
              {editStage
                ? 'Внесите нужные правки по этапу'
                : 'Внесите данные для создания этапа'}
            </SheetDescription>
          </SheetHeader>
          <CreateStageForm
            caseId={caseId}
            className={className}
            widthClassName={cn(
              `max-w-[calc(100vw-3rem)] min-w-[calc(${DIALOG_WIDTH}-3rem)]`,
            )}
            editStage={editStage}
            setEditStage={setEditStage}
          />
        </SheetContent>
      </Sheet>
    );

  return (
    <Dialog
      open={!!editStage}
      onOpenChange={(open) => {
        open === false && setEditStage(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="h-8 p-1 pr-2"
          onClick={() => setEditStage('new')}
        >
          <SquarePlus className="mr-1 size-4 flex-shrink-0" />
          <span>Новый этап</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        style={
          {
            '--dialog-width': DIALOG_WIDTH,
          } as React.CSSProperties
        }
        className={cn(`w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`)}
      >
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
          widthClassName={cn(
            `w-[calc(${DIALOG_WIDTH}-3rem)]  max-w-[calc(100vw-3rem)]`,
          )}
          editStage={editStage}
          setEditStage={setEditStage}
        />
      </DialogContent>
    </Dialog>
  );
};

export { CreateStageDialog };
