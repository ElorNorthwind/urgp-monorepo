import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';

type DashboardNumberCardProps = {
  label: string;
  value: number;
  description?: string;
  Icon?: React.ElementType;
  className?: string;
  accentClassName?: string;
  onClick?: () => void;
};

const DashboardNumberCard = ({
  label,
  value,
  description,
  Icon,
  onClick,
  className,
  accentClassName,
}: DashboardNumberCardProps): JSX.Element => {
  return (
    <Card
      className={cn(onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {Icon && (
          <Icon
            className={cn('text-muted-foreground h-8 w-8', accentClassName)}
          />
        )}
        {/* <DollarSign className="text-muted-foreground h-4 w-4" /> */}
      </CardHeader>
      <CardContent>
        <div className={cn('text-4xl font-bold', accentClassName)}>{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export { DashboardNumberCard };
