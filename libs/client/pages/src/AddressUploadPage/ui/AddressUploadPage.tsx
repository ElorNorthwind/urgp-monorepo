import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  LatestDoneSessions,
  SessionCard,
  SessionQueue,
  useGetSessionById,
} from '@urgp/client/entities';
import { DailyRatesUsageBar } from '@urgp/client/features';
import {
  Button,
  cn,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { CreateAddressSessionForm } from '@urgp/client/widgets';
import { AddressUploadPageSearchDto } from '@urgp/shared/entities';
import { SquareArrowLeft } from 'lucide-react';

const AddressUploadPage = (): JSX.Element => {
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
          {!sessionId && <CreateAddressSessionForm />}
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
