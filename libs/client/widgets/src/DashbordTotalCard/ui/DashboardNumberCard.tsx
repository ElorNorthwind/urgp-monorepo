import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
} from '@urgp/client/shared';

type DashboardNumberCardProps = {
  label: string;
  value: number;
  description?: string;
  Icon?: React.ElementType;
  isLoading?: boolean;
  className?: string;
  accentClassName?: string;
  onClick?: () => void;
};

const DashboardNumberCard = ({
  label,
  value,
  description,
  Icon,
  isLoading,
  className,
  accentClassName,
  onClick,
}: DashboardNumberCardProps): JSX.Element => {
  return (
    <Card
      className={cn(
        onClick &&
          'hover:from-muted hover:to-background/25 cursor-pointer hover:bg-gradient-to-tl',
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="line-clamp-2 text-sm font-medium">
          {isLoading ? <Skeleton className="h-[0.875rem] w-36" /> : label}
        </CardTitle>
        {Icon &&
          (isLoading ? (
            <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
          ) : (
            <Icon
              className={cn(
                'text-muted-foreground h-8 w-8 flex-shrink-0',
                accentClassName,
              )}
            />
          ))}
      </CardHeader>
      <CardContent>
        <div className={cn('text-4xl font-bold', accentClassName)}>
          {isLoading ? <Skeleton className="h-9 w-20" /> : value}
        </div>
        {description && (
          <p className="text-muted-foreground text-xs">
            {isLoading ? <Skeleton className="mt-2 h-2 w-12" /> : description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export { DashboardNumberCard };
