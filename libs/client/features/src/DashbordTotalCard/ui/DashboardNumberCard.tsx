import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { se } from 'date-fns/locale';

type DashboardNumberCardProps = {
  label: string;
  value: number;
  description?: string;
  Icon?: React.ElementType;
  isLoading?: boolean;
  className?: string;
  accentClassName?: string;
  onClick?: () => void;
  secondaryDescription?: string;
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
  secondaryDescription,
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
        {isLoading ? (
          <Skeleton className="h-[0.875rem] w-36" />
        ) : (
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {label}
          </CardTitle>
        )}

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
        {description &&
          (isLoading ? (
            <Skeleton className="mt-2 h-2 w-12" />
          ) : (
            <p className="text-muted-foreground text-xs">{description}</p>
          ))}
        {secondaryDescription && secondaryDescription !== '' && (
          <div className=" bg-muted-foreground/5 -mx-6 -mb-6 mt-2 p-2 px-4 text-center text-xs leading-tight ">
            {secondaryDescription}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { DashboardNumberCard };
