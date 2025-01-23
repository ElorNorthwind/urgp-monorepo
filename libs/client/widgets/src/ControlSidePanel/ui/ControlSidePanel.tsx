import { Button, cn, SIDEBAR_WIDTH, useIsMobile } from '@urgp/client/shared';
import { X } from 'lucide-react';

type ControlSidePanelProps = {
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const ControlSidePanel = (props: ControlSidePanelProps): JSX.Element => {
  const { isOpen = false, onClose, children, className } = props;
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'transform[width] duration-200 ease-linear',
        'bg-sidebar text-sidebar-foreground relative h-screen overflow-hidden border-l p-0',
        // isOpen ? (isMobile ? 'w-full' : `w-[${SIDEBAR_WIDTH}]`) : 'w-0',
        className,
      )}
      style={{
        width: isOpen ? (isMobile ? '100%' : SIDEBAR_WIDTH) : '0',
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

export { ControlSidePanel };
