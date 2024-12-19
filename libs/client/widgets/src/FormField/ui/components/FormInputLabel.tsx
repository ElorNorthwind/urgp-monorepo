import { FormLabel } from '@urgp/client/shared';
import { ControllerFieldState, UseFormReturn } from 'react-hook-form';

type FormInputLabelProps = {
  fieldState: ControllerFieldState;
  label?: string;
};

const FormInputLabel = (props: FormInputLabelProps): JSX.Element => {
  const { label, fieldState } = props;

  return (
    <FormLabel>
      <p className="flex justify-between truncate text-left">
        <span>{label || ''}</span>
        <span className="flex-grow truncate text-right text-xs font-light text-rose-500">
          {fieldState?.error && fieldState.error.message?.toString()}
        </span>
      </p>
    </FormLabel>
  );
};

export { FormInputLabel };
