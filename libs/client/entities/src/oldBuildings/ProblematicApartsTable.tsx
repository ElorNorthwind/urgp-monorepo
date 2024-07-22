import {
  cn,
  HStack,
  ScrollArea,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { Cat, CircleAlert, CircleX } from 'lucide-react';

type ProblematicApartsTableProps = {
  building: OldBuilding | null;
  className?: string;
  caption?: string;
};
const ProblematicApartsTable = ({
  building,
  className,
  caption,
}: ProblematicApartsTableProps): JSX.Element => {
  if (
    !building?.problematicAparts ||
    building?.problematicAparts?.length === 0
  ) {
    return (
      <VStack gap="none">
        <Cat className="stroke-muted-foreground h-12 w-12 stroke-1" />{' '}
        <div className="text-muted-foreground">Нет проблемных квартир</div>
      </VStack>
    );
  }
  return (
    <>
      {caption && (
        <TableCaption className="text-primary text w-full py-2 pl-1 pb-0 text-left">
          {caption}
        </TableCaption>
      )}

      <ScrollArea className="relative h-[calc(100vh-380px)] w-full">
        <Table className={cn(className)}>
          <TableHeader>
            <TableRow className="sticky top-0 bg-slate-50 text-center text-xs">
              <TableHead compact className="w-[20px] text-center"></TableHead>
              <TableHead compact className="max-w-[150px]">
                Житель
              </TableHead>
              <TableHead compact className="">
                Статус
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {building?.problematicAparts.map((apart) => (
              <TableRow className="text-left text-xs" key={apart.id}>
                <TableCell compact className="flex justify-center align-middle">
                  {apart.deviation === 'Риск' ? (
                    <CircleX className="text-red-500" />
                  ) : (
                    <CircleAlert className="text-yellow-500" />
                  )}
                </TableCell>
                <TableCell compact className="truncate">
                  <div className="w-[150px] truncate">
                    {'кв.' + apart.apartNum}
                  </div>
                  <div className="text-muted-foreground w-[150px] truncate">
                    {apart.fio}
                  </div>
                </TableCell>
                <TableCell compact className="truncate">
                  <div>{apart.status}</div>
                  <div className="text-muted-foreground">
                    {apart.difficulty}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export { ProblematicApartsTable };
