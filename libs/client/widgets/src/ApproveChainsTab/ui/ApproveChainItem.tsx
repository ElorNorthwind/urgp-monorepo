import { directionCategoryStyles } from '@urgp/client/entities';
import { Badge, cn, useAuth } from '@urgp/client/shared';
import { ApprovePathNode } from '@urgp/shared/entities';

type ApproveChainItemProps = {
  item?: ApprovePathNode;
  className?: string;
};
const ApproveChainItem = (props: ApproveChainItemProps): JSX.Element | null => {
  const { item, className } = props;
  const user = useAuth();

  return (
    <Badge
      variant={'outline'}
      className={cn(
        'flex flex-row gap-2 px-1',
        user?.id === item?.id &&
          'border-muted-foreground bg-muted-foreground/5',
        className,
      )}
    >
      <div
        className={cn(
          'size-3 rounded-full',
          directionCategoryStyles?.[item?.department || '']?.iconStyle ||
            'bg-slate-500',
        )}
      />
      <span
        className={cn(
          'truncate',
          // user?.id === item?.id && 'text-foreground',
        )}
      >
        {item?.fio}
      </span>
    </Badge>
  );
};

export { ApproveChainItem };
