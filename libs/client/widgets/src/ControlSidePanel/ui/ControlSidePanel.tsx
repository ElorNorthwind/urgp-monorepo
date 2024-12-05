import { Button, cn, useIsMobile } from '@urgp/client/shared';
import { X } from 'lucide-react';

type ControlSidePanelProps = {
  onClose: () => void;
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
        'bg-sidebar text-sidebar-foreground relative h-svh transform overflow-hidden border-l p-4 duration-200 ease-linear',
        isOpen ? (isMobile ? 'w-full' : ' w-[--sidebar-width]') : 'm-0 w-0 p-0',
        className,
      )}
    >
      {isOpen && children}
      <Button
        variant="ghost"
        className={cn(isOpen ? '' : 'hidden', 'absolute right-2 top-2')}
        onClick={onClose}
      >
        <X />
      </Button>
    </div>
  );
};

export { ControlSidePanel };
