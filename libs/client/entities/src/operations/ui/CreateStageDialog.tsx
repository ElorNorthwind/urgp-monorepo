import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectEditStage,
  setEditStage,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { SquarePlus } from 'lucide-react';
import { CreateStageForm } from './CreateStageForm';
import { useDispatch, useSelector } from 'react-redux';

type CreateStageDialogProps = {
  caseId: number;
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateStageDialog = ({
  caseId,
  className,
}: CreateStageDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const editStage = useSelector(selectEditStage);
  const dispatch = useDispatch();

  if (isMobile)
    return (
      <Sheet
        open={!!editStage}
        onOpenChange={(open) => {
          open === false && dispatch(setEditStage(null));
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant={'outline'}
            className="h-8 p-1 pr-2"
            onClick={() => dispatch(setEditStage('new'))}
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
              {editStage === 'new' ? 'Добавить этап' : 'Изменить этап'}
            </SheetTitle>
            <SheetDescription className="text-left">
              {editStage === 'new'
                ? 'Внесите данные для создания этапа'
                : 'Внесите нужные правки по этапу'}
            </SheetDescription>
          </SheetHeader>
          <CreateStageForm
            caseId={caseId}
            className={className}
            popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
          />
        </SheetContent>
      </Sheet>
    );

  return (
    <Dialog
      open={!!editStage}
      onOpenChange={(open) => {
        open === false && dispatch(setEditStage(null));
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="h-8 p-1 pr-2"
          onClick={() => dispatch(setEditStage('new'))}
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
          popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
        />
      </DialogContent>
    </Dialog>
  );
};

export { CreateStageDialog };
