import { FormLabel } from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';

type FormInputLabelProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string;
};

const FormInputLabel = (props: FormInputLabelProps): JSX.Element => {
  const { label, form, fieldName } = props;

  return (
    <FormLabel>
      <p className="flex justify-between truncate text-left">
        <span>{label || ''}</span>
        <span className="flex-grow truncate text-right text-xs font-light text-rose-500">
          {form.formState?.errors?.[fieldName] &&
            form.formState.errors[fieldName].message?.toString()}
        </span>
      </p>
    </FormLabel>
  );
};

export { FormInputLabel };
