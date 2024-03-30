import { cn } from '@urgp/util';
import React, { ReactElement } from 'react';

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
    className={cn(
      'bg-secondary flex !min-h-[calc(100dvh)] min-h-screen flex-col',
      className,
    )}
  >
    <div className="bg-background border-accent absolute top-0 h-10 w-full border-b shadow-md">
      {header}
    </div>
    <div className="flex min-h-full flex-grow justify-center ">
      <div className="bg-background min-h-full w-full items-stretch pt-10 shadow-2xl lg:w-[1024px]">
        {content}
      </div>
    </div>
  </div>
));

export { MainLayout };
