import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectEditCase,
  setEditCase,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCaseForm } from './CreateCaseForm';

type CreateCaseDialogProps = {
  className?: string;
};

const DIALOG_WIDTH = '600px';

const CreateCaseDialog = ({
  className,
}: CreateCaseDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const editCase = useSelector(selectEditCase);
  const dispatch = useDispatch();

  const title = editCase === 'new' ? 'Добавить заявку' : 'Изменить заявку';
  const subTitle =
    editCase === 'new'
      ? 'Внесите данные для создания дела'
      : 'Внесите нужные правки по делу';
  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;
  const onOpenChange = (open: boolean) => {
    open === false && dispatch(setEditCase(null));
  };

  const Wrapper = isMobile ? Sheet : Dialog;
  const Trigger = isMobile ? SheetTrigger : DialogTrigger;
  const Content = isMobile ? SheetContent : DialogContent;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  return (
    <Wrapper open={!!editCase} onOpenChange={onOpenChange}>
      <Trigger asChild>
        <Button
          variant={'outline'}
          className="h-8 p-1"
          onClick={() => dispatch(setEditCase('new'))}
        >
          <SquarePlus className="mr-1 size-4" />
          <p>Добавить</p>
        </Button>
      </Trigger>
      <Content
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          isMobile
            ? 'w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]'
            : `w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`,
        )}
      >
        <Header className="mb-2 text-left">
          <Title>{title}</Title>
          <Description>{subTitle}</Description>
        </Header>
        <CreateCaseForm
          className={className}
          popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
        />
      </Content>
    </Wrapper>
  );

  // if (isMobile)
  //   return (
  //     <Sheet open={!!editCase} onOpenChange={onOpenChange}>
  //       <SheetTrigger asChild>
  //         <Button
  //           variant={'outline'}
  //           className="h-8 p-1"
  //           onClick={() => dispatch(setEditCase('new'))}
  //         >
  //           <SquarePlus className="mr-1 size-4" />
  //           <p>Добавить</p>
  //         </Button>
  //       </SheetTrigger>
  //       <SheetContent
  //         style={contentStyle}
  //         onEscapeKeyDown={(e) => e.preventDefault()}
  //         className={cn(
  //           `w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]`,
  //         )}
  //       >
  //         <SheetHeader className="mb-2 text-left">
  //           <SheetTitle>{title}</SheetTitle>
  //           <SheetDescription>{subTitle}</SheetDescription>
  //         </SheetHeader>
  //         <CreateCaseForm
  //           className={className}
  //           popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
  //         />
  //       </SheetContent>
  //     </Sheet>
  //   );

  // return (
  //   <Dialog open={!!editCase} onOpenChange={onOpenChange}>
  //     <DialogTrigger asChild>
  //       <Button
  //         variant={'outline'}
  //         className="h-8 p-1"
  //         onClick={() => dispatch(setEditCase('new'))}
  //       >
  //         <SquarePlus className="mr-1 size-4" />
  //         <p>Добавить</p>
  //       </Button>
  //     </DialogTrigger>
  //     <DialogContent
  //       style={contentStyle}
  //       onEscapeKeyDown={(e) => e.preventDefault()}
  //       className={cn(`w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`)}
  //     >
  //       <DialogHeader className="mb-2 text-left">
  //         <DialogTitle>{title}</DialogTitle>
  //         <DialogDescription>{subTitle}</DialogDescription>
  //       </DialogHeader>
  //       <CreateCaseForm
  //         className={className}
  //         popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
  //       />
  //     </DialogContent>
  //   </Dialog>
  // );
};

export { CreateCaseDialog };
