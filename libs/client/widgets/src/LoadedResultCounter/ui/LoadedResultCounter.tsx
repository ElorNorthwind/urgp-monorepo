import { HStack } from '@urgp/client/shared';
import { LoaderCircle } from 'lucide-react';

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
        {/* {currentCount} из {totalCount || 0} */}
        {totalCount || 0}
      </div>
    </HStack>
  );
};

export { LoadedResultCounter };
