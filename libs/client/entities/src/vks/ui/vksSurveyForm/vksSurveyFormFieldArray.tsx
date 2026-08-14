import { ScrollArea, cn } from '@urgp/client/shared';
import {
  ClassificatorFormField,
  FieldsArrayProps,
  InputFormField,
  MultiSelectFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import {
  UpdateDgiVksSurveyHousingForm,
  VksDgiSurveyConfig,
} from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';
import { useVksUsersClassificator } from '../../api/vksApi';

const VksSurveyFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
  config,
}: FieldsArrayProps<UpdateDgiVksSurveyHousingForm> & {
  config: VksDgiSurveyConfig;
}): JSX.Element | null => {
  const { data: operators } = useVksUsersClassificator();

  return (
    <ScrollArea className="h-[calc(100vh-15rem)]">
      <div className="m-4 grid h-full grid-cols-2 gap-4">
        {config.elements.map((field) => {
          if (field.isHidden) return null;

          switch (field.type) {
            case 'boolean':
              return (
                <SelectFormField
                  form={form}
                  key={field.key}
                  fieldName={field.key}
                  options={[
                    { label: field.trueLabel, value: 'true' },
                    { label: field.falseLabel, value: 'false' },
                  ]}
                  label={field.label}
                  placeholder={'Выберите значение'}
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
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
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
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
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
                  dirtyIndicator={isEdit}
                />
              );
            case 'singleSelectNumber':
              return (
                <ClassificatorFormField
                  form={form}
                  key={field.key}
                  fieldName={field.key}
                  classificator={
                    field.serverOptionsQueryKey === 'vksOperators'
                      ? operators
                      : field.options
                  }
                  label={field.label}
                  placeholder={'Выберите значение'}
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
                  popoverMinWidth={popoverMinWidth}
                  dirtyIndicator={isEdit}
                />
              );
            case 'singleSelectString':
              return (
                <SelectFormField
                  form={form}
                  key={field.key}
                  fieldName={field.key}
                  options={field.options?.flatMap((group) =>
                    group.items.map((item) => ({
                      label: item.label,
                      value: item.value,
                    })),
                  )}
                  label={field.label}
                  placeholder={'Выберите значение'}
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
                  popoverMinWidth={popoverMinWidth}
                  dirtyIndicator={isEdit}
                  valueType="string"
                />
              );
            case 'multiSelectString':
              return (
                <MultiSelectFormField
                  form={form}
                  key={field.key}
                  fieldName={field.key}
                  options={field.options as any}
                  label={field.label}
                  placeholder={'Выберите значения'}
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
                  popoverMinWidth={popoverMinWidth}
                  dirtyIndicator={isEdit}
                />
              );
            case 'multiSelectNumber':
              return (
                <MultiSelectFormField
                  form={form}
                  key={field.key}
                  fieldName={field.key}
                  options={field.options}
                  label={field.label}
                  placeholder={'Выберите значения'}
                  className={cn(
                    field?.width === 'half' ? 'col-span-1' : 'col-span-2',
                  )}
                  popoverMinWidth={popoverMinWidth}
                  dirtyIndicator={isEdit}
                />
              );
            case 'docList':
              return (
                <div className="bg-muted-foreground/5 col-span-2 w-full p-4 text-center">
                  TODO: DocList multifield array
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </ScrollArea>
  );
};

export { VksSurveyFormFieldArray };
