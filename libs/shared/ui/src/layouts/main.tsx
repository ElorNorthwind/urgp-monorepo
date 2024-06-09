import { cn } from '@urgp/shared/util';
import React, { ReactElement } from 'react';
import { Toaster } from '../components/sonner';

import Logo from '../assets/fancy_logo.svg?react';

interface MainLayoutProps {
  className?: string;
  header?: ReactElement;
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
    {header && (
      <div className="bg-background border-foreground/20 absolute top-0 h-16 w-full border-b shadow-sm">
        {header}
      </div>
    )}
    <div className="background flex min-h-full flex-grow justify-center pt-16">
      <div className="min-h-full w-full items-stretch p-6 lg:w-[1024px]">
        {content}
        <Logo className="fixed right-[-10%] bottom-[-20%] z-[-10] w-[700px]" />
      </div>
    </div>
    <Toaster />
  </div>
));

export { MainLayout };
