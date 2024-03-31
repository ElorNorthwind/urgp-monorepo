import { cn } from '@urgp/shared/util';
import React, { ReactElement } from 'react';
import { Toaster } from '../components/sonner';

interface MainLayoutProps {
  className?: string;
  header: ReactElement;
  content: ReactElement;
}

const MainLayout = React.forwardRef<
  HTMLDivElement,
  MainLayoutProps
  //   React.HTMLAttributes<HTMLDivElement>
>(({ className, header, content }, ref) => (
  <div
    ref={ref}
    className={cn('bg-muted/40 flex min-h-screen flex-col', className)}
  >
    <div className="bg-background border-foreground/20 absolute top-0 h-16 w-full border-b shadow-sm">
      {header}
    </div>
    <div className="flex min-h-full flex-grow justify-center pt-16">
      <div className="min-h-full w-full items-stretch  p-6 lg:w-[1024px]">
        {content}
      </div>
    </div>
    <Toaster />
  </div>
));

export { MainLayout };
