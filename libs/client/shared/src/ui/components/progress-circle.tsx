import { cn } from '../../lib/cn';

type ProgressCircleProps = {
  value?: number;
  variant?: 'ring' | 'gauge';
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
  units?: string;
};

function ProgressCircle({
  value = 0,
  variant = 'ring',
  className,
  indicatorClassName,
  labelClassName,
  units,
}: ProgressCircleProps) {
  return (
    <div className={cn('relative size-10 text-sm', className)}>
      {variant === 'gauge' ? (
        <svg
          className="size-full rotate-[135deg]"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="text-foreground/10 stroke-current"
            strokeWidth="2"
            strokeDasharray="75 100"
            strokeLinecap="round"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={cn('stroke-current', indicatorClassName)}
            strokeWidth="3"
            strokeDasharray={value * 0.75 + ' 100'}
            strokeLinecap="round"
          ></circle>
        </svg>
      ) : (
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="text-foreground/10 stroke-current"
            strokeWidth="2"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={cn('stroke-current', indicatorClassName)}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - value}
            strokeLinecap="round"
          ></circle>
        </svg>
      )}
      <div
        className={cn(
          'text-primary absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center',
          variant === 'gauge'
            ? units && 'pt-[0.4rem] leading-none '
            : units && 'pt-1 leading-none',
          labelClassName,
        )}
      >
        <span className="scale-90 font-bold">{value}</span>
        {units && <span className="-mt-[0.2rem] block scale-75">{units}</span>}
      </div>
    </div>
  );
}

export { ProgressCircle };
