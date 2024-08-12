import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
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
  TooltipContent,
  TooltipTrigger,
  Tooltip,
  VStack,
} from '@urgp/client/shared';
import { ExtendedMessage, OldBuilding } from '@urgp/shared/entities';
import {
  Cat,
  CircleAlert,
  CircleDollarSign,
  CircleX,
  MessageCircleDashed,
  MessageCircleMore,
  Newspaper,
} from 'lucide-react';

type ProblematicApartsTableProps = {
  building: OldBuilding | null;
  messages?: ExtendedMessage[] | null;
  className?: string;
  caption?: string;
  showMFR?: boolean;
  setSelectedAppartmentId?: (value: number | null) => void;
};

const problemBadgeStyles = {
  МФР: cn('bg-violet-100 border-violet-200'),
  Отказ: cn('bg-amber-100 border-amber-200'),
  Суды: cn('bg-rose-100 border-rose-200'),
  Проблемная: cn('bg-slate-100 border-slate-200'),
};
const ProblematicApartsTable = ({
  building,
  messages,
  className,
  showMFR = true,
  setSelectedAppartmentId,
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
    <ScrollArea
      className={cn(
        'relative overflow-y-auto overflow-x-clip rounded border',
        className,
      )}
    >
      <Accordion type="single" collapsible>
        {building?.problematicAparts
          .filter((apart) => showMFR || apart.stageId !== 12)
          .map((apart) => {
            const referenceTerms = [
              // {
              //   label: 'Создано КПУ',
              //   date: apart.stages.order.date,
              //   days: apart.stages.order.days,
              // },
              {
                label: 'На осмотре',
                date: apart.stages.inspection.date,
                days: apart.stages.inspection.days,
              },
              {
                label: 'Отказ',
                date: apart.stages.reject.date,
                days: apart.stages.reject.days,
              },
              {
                label: 'Переподбор',
                date: apart.stages.reinspection.date,
                days: apart.stages.reinspection.days,
              },
              {
                label: 'Согласие',
                date: apart.stages.accept.date,
                days: apart.stages.accept.days,
              },
              {
                label: 'РД',
                date: apart.stages.rd.date,
                days: apart.stages.rd.days,
              },
              {
                label: 'Проект договора',
                date: apart.stages.contractProject.date,
                days: apart.stages.contractProject.days,
              },
              {
                label: 'Уведомление',
                date: apart.stages.contractNotification.date,
                days: apart.stages.contractNotification.days,
              },
              {
                label: 'Назначено подписание',
                date: apart.stages.contractPrelimenarySigning.date,
                days: apart.stages.contractPrelimenarySigning.days,
              },
              {
                label: 'Готовится иск',
                date: apart.stages.claimStart.date,
                days: apart.stages.claimStart.days,
              },
              {
                label: 'Судебные разбирательства',
                date: apart.stages.claimSubmit.date,
                days: apart.stages.claimSubmit.days,
              },
              {
                label: 'Решение суда',
                date: apart.stages.claimWon.date,
                days: apart.stages.claimWon.days,
              },
              {
                label: 'Не предлагалось (проигранный суд)',
                date: apart.stages.claimLost.date,
                days: apart.stages.claimLost.days,
              },
              {
                label: 'На осмотре (проиграный суд)',
                date: apart.stages.lostInspection.date,
                days: apart.stages.lostInspection.days,
              },
              {
                label: 'Согласие (проиграный суд)',
                date: apart.stages.lostAccept.date,
                days: apart.stages.lostAccept.days,
              },
              {
                label: 'РД (проиграный суд)',
                date: apart.stages.lostRd.date,
                days: apart.stages.lostRd.days,
              },
              {
                label: 'Проект договора (проиграный суд)',
                date: apart.stages.lostContractProject.date,
                days: apart.stages.lostContractProject.days,
              },
              {
                label: 'Назначено подписание (проиграный суд)',
                date: apart.stages.lostContractPrelimenarySigning.date,
                days: apart.stages.lostContractPrelimenarySigning.days,
              },
              {
                label: 'Запрошен ИЛ',
                date: apart.stages.fsspList.date,
                days: apart.stages.fsspList.days,
              },
              {
                label: 'Возбуждено ИП',
                date: apart.stages.fsspInstitute.date,
                days: apart.stages.fsspInstitute.days,
              },
              {
                label: 'РД (выигранный суд)',
                date: apart.stages.wonRd.date,
                days: apart.stages.wonRd.days,
              },
              {
                label: 'Проект договора (выигранный суд)',
                date: apart.stages.wonContractProject.date,
                days: apart.stages.wonContractProject.days,
              },
              {
                label: 'Договор подписан',
                date: apart.stages.contract.date,
                days: apart.stages.contract.days,
              },
            ].sort((a, b) => (a.days || 0) - (b.days || 0));

            return (
              <AccordionItem
                value={apart.id.toString()}
                key={apart.id}
                className="group relative"
              >
                <AccordionTrigger
                  className="data-[state=open]:bg-muted group-hover:bg-muted/50 py-2 px-4 text-left text-xs group-hover:no-underline"
                  key={apart.id}
                >
                  <HStack gap="s" className="w-full truncate">
                    {setSelectedAppartmentId && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="outline"
                            className="relative p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppartmentId(apart.id);
                            }}
                          >
                            {apart.stageId === 12 ? (
                              <CircleDollarSign className="h-8 w-8 text-violet-500" />
                            ) : apart.deviation === 'Риск' ? (
                              <CircleX className="h-8 w-8 text-red-500" />
                            ) : (
                              <CircleAlert className="h-8 w-8 text-yellow-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>
                            <TooltipArrow />
                            <span>Подробнее</span>
                          </TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    )}
                    <VStack
                      gap="none"
                      align={'start'}
                      className="flex-1 truncate"
                    >
                      <div className="flex-1 truncate">
                        <span className="font-bold">
                          {'кв.' + apart.apartNum}
                        </span>
                        <span className="px-1">{apart.fio}</span>

                        {(JSON.parse(apart.problems) as string[]).map(
                          (problem) => (
                            <Badge
                              key={problem}
                              variant="outline"
                              className={cn(
                                'ml-1 h-4 px-1 text-xs',
                                problemBadgeStyles?.[
                                  problem as keyof typeof problemBadgeStyles
                                ],
                              )}
                            >
                              {problem}
                            </Badge>
                          ),
                        )}
                      </div>
                      <div className="text-muted-foreground flex-1 truncate">
                        {apart.action}
                      </div>
                    </VStack>
                  </HStack>
                </AccordionTrigger>
                {messages &&
                  messages?.filter(
                    (message) => message.apartmentId === apart.id,
                  ).length > 0 && (
                    <Badge className="border-background absolute top-1 left-2 flex h-5 w-5 place-content-center truncate px-1 text-xs font-light">
                      {/* <MessageCircleMore className="text-background mr-1 h-3 w-3" /> */}
                      {
                        messages.filter(
                          (message) => message.apartmentId === apart.id,
                        ).length
                      }
                    </Badge>
                  )}
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
                                  {term.days}
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
  );
};

export { ProblematicApartsTable };
