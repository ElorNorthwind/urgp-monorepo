import { cn } from '@urgp/client/shared';
import {
  FieldsArrayProps,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { VksDgiSurveyConfig } from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';

const EquityOperationFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
  config,
}: FieldsArrayProps<any> & {
  config: VksDgiSurveyConfig;
}): JSX.Element | null => {
  //   const user = useAuth();

  return (
    <Fragment>
      {config.elements.map((field) => {
        switch (field.type) {
          case 'boolean':
            return (
              <SelectFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                options={[
                  { label: 'Да', value: 'true' },
                  { label: 'Нет', value: 'false' },
                ]}
                label={field.label}
                placeholder={'Выберите значение'}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                popoverMinWidth={popoverMinWidth}
                dirtyIndicator={isEdit}
                valueType="string"
              />
            );
          case 'text':
            return (
              <InputFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                label={field.label}
                placeholder={field.placeholder}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                dirtyIndicator={isEdit}
              />
            );
          case 'textArea':
            return (
              <TextAreaFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                label={field.label}
                placeholder={field.placeholder}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                dirtyIndicator={isEdit}
              />
            );
          case 'singleSelectNumber':
            return (
              <SelectFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                options={field.options}
                label={field.label}
                placeholder={'Выберите значение'}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                popoverMinWidth={popoverMinWidth}
                dirtyIndicator={isEdit}
                valueType="number"
              />
            );
          case 'singleSelectString':
            return (
              <SelectFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                options={field.options}
                label={field.label}
                placeholder={'Выберите значение'}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                popoverMinWidth={popoverMinWidth}
                dirtyIndicator={isEdit}
                valueType="string"
              />
            );
          case 'multiSelectNumber':
            return (
              <SelectFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                options={field.options}
                label={field.label}
                placeholder={'Выберите значение'}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                popoverMinWidth={popoverMinWidth}
                dirtyIndicator={isEdit}
                valueType="number"
              />
            );
          case 'multiSelectString':
            return (
              <SelectFormField
                form={form}
                key={field.key}
                fieldName={field.key}
                options={field.options}
                label={field.label}
                placeholder={'Выберите значение'}
                className={cn(field?.width === 'half' ? 'w-1/2' : 'w-full')}
                popoverMinWidth={popoverMinWidth}
                dirtyIndicator={isEdit}
                valueType="string"
              />
            );
          case 'docList':
            return <div>TBD: DocList</div>;
          default:
            return null;
        }
      })}
    </Fragment>
  );
};

export { EquityOperationFieldArray };
