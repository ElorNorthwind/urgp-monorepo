import { cn } from '@urgp/client/shared';
import { ControllerFieldState } from 'react-hook-form';

export const formItemClassName = cn('grid');

export const formFieldStatusClassName = ({
  dirtyIndicator,
  fieldState,
}: {
  dirtyIndicator: boolean;
  fieldState: ControllerFieldState;
}) => {
  return cn(
    fieldState.error || fieldState.invalid
      ? 'border-red-500'
      : dirtyIndicator && fieldState.isDirty
        ? 'border-sky-500'
        : '',
  );
};
