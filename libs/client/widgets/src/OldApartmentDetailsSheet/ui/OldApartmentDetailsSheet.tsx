import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { ChevronRight, FileText } from 'lucide-react';

import { MessageTab, useOldApartmentDetails } from '@urgp/client/entities';
import {
  ApartmentCapstonesTab,
  ApartmentTimelineTab,
} from '@urgp/client/features';

type OldApartmentDetailsSheetProps = {
  apartmentId?: number;
  setApartmentId: (value: number | null) => void;
  refetch?: () => void;
  className?: string;
};
const OldApartmentDetailsSheet = ({
  apartmentId,
  setApartmentId,
  refetch,
  className,
}: OldApartmentDetailsSheetProps): JSX.Element => {
  const {
    data: apartmentDetails,
    isLoading: detailsIsLoading,
    isFetching: detailsIsFetching,
  } = useOldApartmentDetails(apartmentId || 0, {
    skip: !apartmentId || apartmentId === -1,
  });

  return (
    <Tabs defaultValue="capstones" className={cn('h-full', className)} asChild>
      <Card
        className={cn(
          'w-detailsbar absolute bottom-0 top-0',
          'transition-all ease-in-out',
          apartmentId && apartmentId !== -1 ? 'w-detailsbar' : 'hidden w-0',
          className,
        )}
      >
        <Button
          variant="link"
          className="group absolute right-2 top-2 rounded-full p-2"
          onClick={() => setApartmentId(null)}
        >
          <ChevronRight className="stroke-muted-foreground opacity-50 group-hover:opacity-100" />
        </Button>

        <CardHeader className="rounded-t-lg bg-slate-100 p-4">
          <CardTitle className="flex items-center justify-start gap-2">
            {detailsIsLoading || detailsIsFetching ? (
              <Skeleton className="h-6 w-44" />
            ) : (
              <>
                <p className="max-w-[calc(var(--detailsbar-width)-6rem)] truncate">
                  {apartmentDetails?.fio}
                </p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    'http://webrsm.mlc.gov:5222/ObjectCard?ObjId=' +
                    apartmentId +
                    '&RegisterViewId=KursKpu&isVertical=true&useMasterPage=true'
                  }
                >
                  <FileText />
                </a>
              </>
            )}
          </CardTitle>
          {detailsIsLoading || detailsIsFetching ? (
            <Skeleton className="h-4 w-60" />
          ) : (
            <CardDescription className="text-left">
              {apartmentDetails &&
                apartmentDetails?.adress +
                  ' кв. ' +
                  apartmentDetails?.num +
                  ` (${apartmentDetails?.type})`}
            </CardDescription>
          )}
          <p className="bg-muted-foreground/10 truncate rounded px-2 text-center leading-snug">
            {apartmentDetails?.status}
          </p>
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="all">Вся работа</TabsTrigger>
            <TabsTrigger value="capstones">Плановые вехи</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent
          value="all"
          className={cn(
            // 'flex h-[calc(100%-10.5rem)] w-full flex-col gap-1 border-none p-0',
            'h-[calc(100%-10.5rem)]',
            className,
          )}
        >
          <ApartmentTimelineTab apartmentId={apartmentId || 0} />
        </TabsContent>
        <TabsContent
          value="capstones"
          className={cn(
            // 'flex h-[calc(100%-10.5rem)] w-full flex-col gap-1 border-none p-0',
            'h-[calc(100%-10.5rem)]',
            className,
          )}
        >
          <ApartmentCapstonesTab apartmentId={apartmentId || 0} />
        </TabsContent>
        <MessageTab
          apartmentId={apartmentId || 0}
          refetchAll={refetch}
          className="w-messagebar absolute bottom-0 right-[calc(var(--detailsbar-width)+0.5rem)] top-0 max-w-[calc(100vw-var(--detailsbar-width)-var(--messagebar-width)-4rem)]"
        />
      </Card>
    </Tabs>
  );
};

export { OldApartmentDetailsSheet };
