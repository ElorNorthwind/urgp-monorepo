import { cn, Skeleton } from '@urgp/client/shared';

type InputSkeletonProps = {
  className?: string;
};

const InputSkeleton = (props: InputSkeletonProps): JSX.Element => {
  const { className } = props;

  return <Skeleton className={cn('h-10 w-full', className)} />;
};

export { InputSkeleton };
