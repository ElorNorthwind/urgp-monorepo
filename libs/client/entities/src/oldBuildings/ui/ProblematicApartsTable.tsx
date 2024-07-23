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
    <VStack gap="s" className={cn('max-h-[calc(100%-8rem)] w-full', className)}>
      {caption && (
        <h3 className=" text text-primary/40 m-0 w-full p-0 text-left">
          {caption}
        </h3>
      )}
      <ScrollArea className="relative w-full flex-1 rounded border">
        {/* h-[calc(100vh-380px)] */}
        <Table className={'w-full'}>
          <TableHeader>
            <TableRow className="sticky top-0 bg-slate-50 text-center text-xs hover:bg-slate-50">
              {/* <TableHead compact className="w-[20px] text-center"></TableHead> */}
              <TableHead compact className="max-w-[160px]">
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
                <TableCell compact className="truncate">
                  <HStack gap="s">
                    {apart.deviation === 'Риск' ? (
                      <CircleX className="text-red-500" />
                    ) : (
                      <CircleAlert className="text-yellow-500" />
                    )}
                    <VStack gap="none" align={'start'}>
                      <div className="flex-1 truncate">{apart.fio}</div>
                      <div className="text-muted-foreground flex-1 truncate">
                        {'кв.' + apart.apartNum}
                      </div>
                    </VStack>
                  </HStack>
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
      {/* </div> */}
    </VStack>
  );
};

export { ProblematicApartsTable };
