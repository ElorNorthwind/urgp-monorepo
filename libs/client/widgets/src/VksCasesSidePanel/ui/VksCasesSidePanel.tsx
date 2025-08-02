import {
  Button,
  cn,
  EQUITY_SIDEBAR_WIDTH,
  useIsMobile,
  VKS_SIDEBAR_WIDTH,
} from '@urgp/client/shared';
import { X } from 'lucide-react';

type VksCasesSidePanelProps = {
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const VksCasesSidePanel = (props: VksCasesSidePanelProps): JSX.Element => {
  const { isOpen = false, onClose, children, className } = props;
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'transform[width] duration-200 ease-linear',
        'bg-sidebar text-sidebar-foreground relative h-screen overflow-hidden border-l p-0',
        className,
      )}
      style={{
        width: isOpen ? (isMobile ? '100%' : VKS_SIDEBAR_WIDTH) : '0',
      }}
    >
      <div
        className={cn('flex h-full w-full flex-col', isOpen ? '' : 'hidden')}
      >
        {children}
      </div>
      {onClose && (
        <Button
          variant="ghost"
          className={cn(
            isOpen ? '' : 'hidden',
            'absolute right-2 top-2 size-10 p-0',
          )}
          onClick={onClose}
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export { VksCasesSidePanel };
