import { TooltipPortal } from '@radix-ui/react-tooltip';
import { useNavigate } from '@tanstack/react-router';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { Settings } from 'lucide-react';

const OptionsNavbar = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="flex p-2"
          variant="ghost"
          disabled
          onClick={() => navigate({ to: '#' })}
        >
          <Settings className="stroke-muted-foreground/40 h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="right" className="">
          TBD
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { OptionsNavbar };
