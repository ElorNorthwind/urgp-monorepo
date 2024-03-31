import { cn } from '@urgp/shared/util';
import { VariantProps, cva } from 'class-variance-authority';
import React, { HTMLAttributes, ReactNode } from 'react';

export interface FlexProps
  extends React.DetailedHTMLProps<
      HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof flexVariants> {
  noWrap?: boolean;
}

const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
    gap: {
      none: 'gap-0',
      s: 'gap-2',
      m: 'gap-4',
      l: 'gap-8',
      xl: 'gap-16',
    },
  },
  defaultVariants: {
    justify: 'start',
    align: 'center',
    gap: 'm',
  },
});

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(flexVariants({ className }))} {...props} />
  ),
);

const HStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(flexVariants({ direction: 'row', className }))}
      {...props}
    />
  ),
);

const VStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ className, noWrap = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        flexVariants({ direction: 'column', className }),
        noWrap ? 'flex-nowrap' : 'flex-wrap',
      )}
      {...props}
    />
  ),
);

export { HStack, VStack };
