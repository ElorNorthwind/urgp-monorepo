import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { HStack, VirtualDataTable, VStack } from '@urgp/client/shared';
import { OldBuildingsFilter } from '@urgp/client/widgets';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { GetOldBuldingsDto } from '@urgp/shared/entities';

type LoadedResultCounterProps = {
  currentCount?: number;
  totalCount?: number;
  isFetching?: boolean;
  className?: string;
};

const LoadedResultCounter = ({
  currentCount,
  totalCount,
  isFetching,
  className,
}: LoadedResultCounterProps): JSX.Element => {
  if (!currentCount || !totalCount || currentCount === 0) return <></>;

  return (
    <HStack gap="s" className={className}>
      {isFetching && (
        <LoaderCircle className="stroke-muted-foreground animate-spin" />
      )}
      <div className="text-muted-foreground">
        {currentCount} из {totalCount || 0}
      </div>
    </HStack>
  );
};

export { LoadedResultCounter };
