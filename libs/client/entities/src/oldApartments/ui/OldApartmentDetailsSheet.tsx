import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  HStack,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useState } from 'react';
import {
  useOldApartmentDetails,
  useOldApartmentTimeline,
} from '../api/oldApartmentsApi';

type OldApartmentDetailsSheetProps = {
  apartmentId: number | null;
  setApartmentId: (value: number | null) => void;
  className?: string;
};
const OldApartmentDetailsSheet = ({
  apartmentId,
  setApartmentId,
  className,
}: OldApartmentDetailsSheetProps): JSX.Element => {
  const {
    data: apartmentTimeline,
    isLoading: timelineIsLoading,
    isFetching: timelineIsFetching,
  } = useOldApartmentTimeline(apartmentId || 0, { skip: !apartmentId });
  const {
    data: apartmentDetails,
    isLoading: detailsIsLoading,
    isFetching: tdetailsIsFetching,
  } = useOldApartmentDetails(apartmentId || 0, { skip: !apartmentId });

  return (
    <Sheet open={!!apartmentId} onOpenChange={() => setApartmentId(null)}>
      <SheetContent side={'right'} className={className}>
        <SheetHeader>
          <SheetTitle>{apartmentDetails?.fio}</SheetTitle>
          <SheetDescription>
            {apartmentDetails &&
              apartmentDetails?.adress +
                ' кв. ' +
                apartmentDetails?.num +
                ` (${apartmentDetails?.type})`}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {apartmentTimeline && apartmentTimeline.length}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { OldApartmentDetailsSheet };
