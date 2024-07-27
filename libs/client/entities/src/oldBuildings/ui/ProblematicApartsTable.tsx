import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  formatDate,
  HStack,
  ScrollArea,
  Table,
  TableBody,
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
        <Accordion type="single" collapsible>
          {building?.problematicAparts.map((apart) => {
            const referenceTerms = [
              {
                label: 'Направлен смотровой',
                date: apart.dates.inspection,
                term: apart.terms.inspection,
              },
              {
                label: 'Получен отказ',
                date: apart.dates.reject,
                term: apart.terms.reject,
              },
              {
                label: 'Переподбор',
                date: apart.dates.reinspection,
                term: apart.terms.reinspection,
              },
              {
                label: 'Согласие',
                date: apart.dates.accept,
                term: apart.terms.accept,
              },
              {
                label: 'Суд. иск',
                date: apart.dates.litigationClaim,
                term: apart.terms.litigationClaim,
              },
              {
                label: 'Суд. решение',
                date: apart.dates.litigationDecision,
                term: apart.terms.litigationDecision,
              },
              {
                label: 'Издано РД',
                date: apart.dates.rd,
                term: apart.terms.rd,
              },
              {
                label: 'Проект договора',
                date: apart.dates.contractProject,
                term: apart.terms.contractProject,
              },
              {
                label: 'Уведомление',
                date: apart.dates.contractNotification,
                term: apart.terms.contractNotification,
              },
              {
                label: 'Подписание',
                date: apart.dates.contractPrelimenatySigning,
                term: apart.terms.contractPrelimenatySigning,
              },
              {
                label: 'Договор',
                date: apart.dates.contract,
                term: apart.terms.contract,
              },
            ];

            return (
              <AccordionItem
                value={apart.id.toString()}
                key={apart.id}
                className="group "
              >
                <AccordionTrigger
                  className="data-[state=open]:bg-muted group-hover:bg-muted/50 py-2 px-4 text-left text-xs group-hover:no-underline"
                  key={apart.id}
                >
                  <HStack gap="s" className="w-[200px] truncate">
                    {apart.deviation === 'Риск' ? (
                      <CircleX className="text-red-500" />
                    ) : (
                      <CircleAlert className="text-yellow-500" />
                    )}
                    <VStack
                      gap="none"
                      align={'start'}
                      className="w-[160px] truncate"
                    >
                      <div className="flex-1 truncate">{apart.fio}</div>
                      <div className="text-muted-foreground flex-1 truncate">
                        {'кв.' + apart.apartNum}
                      </div>
                    </VStack>
                  </HStack>
                  <VStack
                    gap="none"
                    align={'start'}
                    className="flex-1 truncate"
                  >
                    <div>{apart.status}</div>
                    <div className="text-muted-foreground">
                      {apart.difficulty}
                    </div>
                  </VStack>
                </AccordionTrigger>
                <AccordionContent className="flex place-content-center border-t p-0">
                  {referenceTerms.filter((term) => term.date).length > 0 ? (
                    <Table className="w-full">
                      <TableHeader className="border-muted-foreground/25 border-t-2">
                        <TableRow className=" bg-amber-50 text-center text-xs hover:bg-amber-50">
                          <TableHead
                            compact
                            className="text-primary flex-1 text-left"
                          >
                            Этап
                          </TableHead>
                          <TableHead
                            compact
                            className="text-primary flex-1 text-center"
                          >
                            Дата
                          </TableHead>
                          <TableHead
                            compact
                            className="text-primary flex-1 text-center"
                          >
                            Дней от старта
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="border-muted-foreground/25 border-b-2 bg-amber-50/25">
                        {referenceTerms
                          .filter((term) => term.date)
                          .map((term) => {
                            return (
                              <TableRow
                                className="hover:bg-amber-50/25"
                                key={term.label}
                              >
                                <TableCell
                                  compact
                                  className="py-2 text-left text-xs"
                                >
                                  {term.label}
                                </TableCell>
                                <TableCell
                                  compact
                                  className="py-2 text-center text-xs"
                                >
                                  {formatDate(term.date)}
                                </TableCell>
                                <TableCell
                                  compact
                                  className="py-2 text-center text-xs"
                                >
                                  {term.term}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="border-muted-foreground/25 flex h-9 w-full items-center justify-center border-y-2 bg-amber-50">
                      Работа не проводилась
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
      {/* </div> */}
    </VStack>
  );
};

export { ProblematicApartsTable };
