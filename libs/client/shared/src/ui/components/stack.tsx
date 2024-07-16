import { cn } from '../../lib/cn';
import { VariantProps, cva } from 'class-variance-authority';
import React, { HTMLAttributes } from 'react';

export interface FlexProps
  extends Omit<
      React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'ref'
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
  (
    { className, noWrap = false, justify, align, gap, direction, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        flexVariants({ justify, align, gap, direction, className }),
        noWrap ? 'flex-nowrap' : 'flex-wrap',
      )}
      {...props}
    />
  ),
);

const HStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ className, justify, align, gap, ...props }, ref) => (
    <Flex
      ref={ref}
      className={cn(
        flexVariants({ direction: 'row', justify, align, gap, className }),
      )}
      {...props}
    />
  ),
);

const VStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ className, justify, align, gap, ...props }, ref) => (
    <Flex
      ref={ref}
      className={cn(
        flexVariants({ direction: 'column', justify, align, gap, className }),
      )}
      {...props}
    />
  ),
);

export { HStack, VStack };
