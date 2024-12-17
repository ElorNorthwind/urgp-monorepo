import { cn, FormLabel, Skeleton } from '@urgp/client/shared';

type FormInputSkeletonProps = {
  className?: string;
};

const FormInputSkeleton = (props: FormInputSkeletonProps): JSX.Element => {
  const { className } = props;

  return <Skeleton className={cn('h-8 w-full', className)} />;
};

export { FormInputSkeleton };
