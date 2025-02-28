import { directionCategoryStyles } from '@urgp/client/entities';
import { Badge, cn, Separator, useAuth } from '@urgp/client/shared';
import { ApprovePathNode } from '@urgp/shared/entities';
import { ApproveChainItem } from './ApproveChainItem';
import { Fragment } from 'react/jsx-runtime';
import { BadgeCheck, MoveRight, ShieldCheck } from 'lucide-react';

type ApproveChainPathProps = {
  path?: ApprovePathNode[];
  className?: string;
};
const ApproveChainPath = (props: ApproveChainPathProps): JSX.Element | null => {
  const { path, className } = props;
  if (!path?.length) return null;

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-start gap-1',
        className,
      )}
    >
      {path?.map((p, i) => (
        <Fragment key={p.id}>
          {/* {p.id !== (path?.[i - 1]?.id || 0) && <Separator />} */}
          <ApproveChainItem
            key={p.id + '_item'}
            item={p}
            // className={p.id !== (path?.[i - 1]?.id || 0) ? 'bg-red-500' : ''}
          />
          <MoveRight className="size-3 flex-shrink-0" />
          {i === path.length - 1 && (
            <ShieldCheck className="size-5 flex-shrink-0 text-emerald-500" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export { ApproveChainPath };
