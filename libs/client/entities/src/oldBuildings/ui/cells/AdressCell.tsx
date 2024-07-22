import { CellContext } from '@tanstack/react-table';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HStack,
  ScrollArea,
  ScrollBar,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';

function AdressCell(props: CellContext<OldBuilding, string>): JSX.Element {
  const aparts = props.row.original.problematicAparts || [];

  return (
    <Sheet>
      <SheetTrigger className="h-full">
        {props.row.original.adress}
      </SheetTrigger>
      <SheetContent className="w-[600px]">
        <SheetHeader>
          <SheetTitle>{props.row.original.adress}</SheetTitle>
          <SheetDescription>Список проблемных квартир адреса</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full w-full overflow-clip">
          {aparts.map((apart) => (
            <HStack>
              <div>{apart.apartNum}</div>
              <div>{apart.fio}</div>
              <div>{apart.status}</div>
              <div>{apart.difficulty}</div>
            </HStack>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <Dialog>
      <DialogTrigger className="h-full ">
        {props.row.original.adress}
      </DialogTrigger>
      <DialogContent className="w-[800px]">
        <DialogHeader>
          <DialogTitle>{props.row.original.adress}</DialogTitle>
          <DialogDescription>
            Список проблемных квартир адреса
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] w-full">
          {aparts.map((apart) => (
            <HStack>
              <div>{apart.apartNum}</div>
              <div>{apart.fio}</div>
              <div>{apart.status}</div>
              <div>{apart.difficulty}</div>
            </HStack>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { AdressCell };
