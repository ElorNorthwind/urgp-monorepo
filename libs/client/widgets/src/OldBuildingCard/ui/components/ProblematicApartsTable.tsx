import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
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
  Button,
  Switch,
  Label,
} from '@urgp/client/shared';
import { ExtendedMessage, OldBuilding } from '@urgp/shared/entities';
import {
  Cat,
  CircleAlert,
  CircleDollarSign,
  CircleX,
  ExternalLink,
} from 'lucide-react';
import { getReferenceTerms } from '../../lib/getReferenceTerms';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

type ProblematicApartsTableProps = {
  problematicAparts: OldBuilding['problematicAparts'] | null;
  totalApartments: number;
  buildingId: number;
  messages?: ExtendedMessage[] | null;
  className?: string;
  caption?: string;
  setSelectedAppartmentId?: (value: number | null) => void;
};

const problemBadgeStyles = {
  МФР: cn('bg-violet-100 border-violet-200'),
  Отказ: cn('bg-amber-100 border-amber-200'),
  Суды: cn('bg-rose-100 border-rose-200'),
  Проблемная: cn('bg-slate-100 border-slate-200'),
};
const ProblematicApartsTable = ({
  problematicAparts,
  totalApartments,
  buildingId,
  messages,
  className,
  setSelectedAppartmentId,
}: ProblematicApartsTableProps): JSX.Element => {
  const [showMFR, setShowMFR] = useState<boolean>(true);
  const navigate = useNavigate({ from: '/renovation/oldbuildings' });

  if (!problematicAparts || problematicAparts.length === 0) {
    return (
      <div className="relative flex flex-col place-items-center py-4">
        <Cat className="stroke-muted-foreground h-12 w-12 stroke-1" />
        <div className="text-muted-foreground">Нет проблемных квартир</div>
        {totalApartments && totalApartments > 0 && (
          <Button
            variant="ghost"
            className="absolute top-2 right-2 space-x-2 px-2"
            onClick={() =>
              navigate({
                to: '/renovation/oldapartments',
                search: { buildingIds: [buildingId] },
              })
            }
          >
            <p>Все кв.</p>
            <ExternalLink className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  }
  return (
    <>
      <HStack className="p-2">
        {problematicAparts && problematicAparts?.length > 0 && (
          <>
            <h3>Проблемные квартиры</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-mfr"
                defaultChecked
                checked={showMFR}
                onCheckedChange={(e) => {
                  setShowMFR(e);
                }}
              />
              <Label
                htmlFor="show-mfr"
                className={cn(
                  'transition-opacity',
                  !showMFR ? 'line-through opacity-30' : '',
                )}
              >
                МФР
              </Label>
            </div>
          </>
        )}
        {totalApartments > 0 && (
          <Button
            variant="ghost"
            className="ml-auto space-x-2 px-2"
            onClick={() =>
              navigate({
                to: '/renovation/oldapartments',
                search: { buildingIds: [buildingId] },
              })
            }
          >
            <p>Все кв.</p>
            <ExternalLink className="h-5 w-5" />
          </Button>
        )}
      </HStack>

      <ScrollArea className={cn('rounded border', className)}>
        <Accordion type="single" collapsible className="absolute inset-0">
          {problematicAparts
            .filter((apart) => showMFR || apart.stageId !== 12)
            .map((apart) => {
              const referenceTerms = getReferenceTerms(apart);

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
                          <TooltipTrigger asChild>
                            <div
                              // variant="outline"
                              className="hover:bg-muted-foreground/10 relative rounded border bg-white p-2"
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
                            </div>
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent side="left">
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
                                {problem === 'Проблемная'
                                  ? apart.apartStatus ===
                                    'федеральная собственность'
                                    ? 'Федеральная'
                                    : apart.apartStatus
                                        .slice(0, 1)
                                        .toLocaleUpperCase() +
                                      apart.apartStatus.slice(1)
                                  : problem}
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
                      <Badge className="border-background pointer-events-none absolute top-1 left-2 flex h-5 w-5 select-none place-content-center truncate px-1 text-xs font-light">
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
    </>
  );
};

export { ProblematicApartsTable };
