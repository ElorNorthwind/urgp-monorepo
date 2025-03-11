import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  LatestDoneSessions,
  SessionCard,
  SessionQueue,
  useGetSessionById,
  useGetSessionsQueue,
  useGetUserSessions,
} from '@urgp/client/entities';
import {
  BarRow,
  DailyRatesUsageBar,
  ExcelFileInput,
} from '@urgp/client/features';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Separator,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { CreateAddressSessionForm } from '@urgp/client/widgets';
import { AddressUploadPageSearchDto } from '@urgp/shared/entities';
import { isMonday } from 'date-fns';
import { Loader, SquareArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';

const AddressUploadPage = (): JSX.Element => {
  const [addressCount, setAddressCount] = useState(0);
  const [isParsing, setIsParsing] = useState(false);

  const isMobile = useIsMobile();

  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });
  const { sessionId } = getRouteApi(
    pathname,
  ).useSearch() as AddressUploadPageSearchDto;

  const { data: session, isLoading: isSessionLoading } = useGetSessionById(
    sessionId ?? 0,
    {
      pollingInterval: 5000,
      skip: !sessionId || sessionId === 0,
    },
  );

  return (
    <div className="block space-y-6 p-10 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex w-full flex-row justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {sessionId ? 'Статус запроса' : 'Сформировать запрос'}
            </h2>
            <p className="text-muted-foreground">
              {sessionId
                ? 'Ранее сформированный запрос'
                : 'Новый запрос на обработку адресов'}
            </p>
          </div>
          {sessionId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  role="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-12 p-2"
                  onClick={() =>
                    navigate({ to: pathname, search: { sessionId: undefined } })
                  }
                >
                  <SquareArrowLeft className="text-sidebar-foreground size-10 opacity-30" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={4}>
                Назад
              </TooltipContent>
            </Tooltip>
          )}
          <DailyRatesUsageBar
            className={cn('justify-center', isMobile ? 'hidden' : 'w-1/3')}
          />
        </div>
        <Separator className="my-6" />

        <div className="flex flex-col gap-4">
          {!sessionId && (
            <Card>
              <CardHeader className="bg-muted-foreground/5 mb-4 pb-4">
                <CardTitle className="relative flex flex-row items-center justify-between">
                  <div>Файл в формате Excel</div>
                  {isMobile === false &&
                    (isParsing ? (
                      <Skeleton className="absolute right-2 top-1 h-7 w-60" />
                    ) : (
                      addressCount > 0 && (
                        <div className="text-muted-foreground/50 absolute right-2 top-1 text-2xl font-semibold">{`${addressCount.toLocaleString('ru-RU')} адресов`}</div>
                      )
                    ))}
                </CardTitle>
                <CardDescription>
                  Должен содержать столбец "Адрес"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateAddressSessionForm
                  isParsing={isParsing}
                  setIsParsing={setIsParsing}
                  addressCount={addressCount}
                  setAddressCount={setAddressCount}
                  setSessionId={(id: number) => {
                    navigate({
                      to: pathname,
                      search: { sessionId: id },
                    });
                  }}
                />
              </CardContent>
            </Card>
          )}
          {sessionId && session && (
            <SessionCard session={session} className="w-full" />
          )}
          <SessionQueue selectedSessionId={sessionId} className="w-full" />
          <LatestDoneSessions
            selectedSessionId={sessionId}
            className="w-full"
            sessionLimit={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressUploadPage;
