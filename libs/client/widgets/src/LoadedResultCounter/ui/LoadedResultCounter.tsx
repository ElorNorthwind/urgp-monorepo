import { HStack } from '@urgp/client/shared';
import { LoaderCircle } from 'lucide-react';

type LoadedResultCounterProps = {
  currentCount?: number;
  totalCount?: number;
  isFetching?: boolean;
  className?: string;
};

const LoadedResultCounter = ({
  totalCount,
  isFetching,
  className,
}: LoadedResultCounterProps): JSX.Element => {
  return (
    <HStack gap="s" className={className}>
      {isFetching && (
        <LoaderCircle className="stroke-muted-foreground animate-spin" />
      )}
      <div className="text-muted-foreground">
        {totalCount || (isFetching ? '' : 0)}
      </div>
    </HStack>
  );
};

export { LoadedResultCounter };
