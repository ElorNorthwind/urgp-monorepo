import {
  Button,
  cn,
  Label,
  ScrollArea,
  Tooltip,
  TooltipContent,
} from '@urgp/client/shared';

import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { DateFormField, InputFormField } from '@urgp/client/widgets';
import { ExternalCaseTypeSelector } from '../../../classificators';
import { FilePlus, Trash2 } from 'lucide-react';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Fragment } from 'react/jsx-runtime';

type ExternalCaseFieldArrayProps = {
  fieldArrayName?: string;
  form: UseFormReturn<any, any>;
  className?: string;
};

const ExternalCaseFieldArray = ({
  form,
  fieldArrayName = 'externalCases',
  className,
}: ExternalCaseFieldArrayProps): JSX.Element | null => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });

  return (
    <ScrollArea
      className={cn(
        'overflow-autopx-6 bg-sidebar relative -mx-6 max-h-52 border-y py-2',
        className,
      )}
    >
      <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-2">
        {fields.length > 0 && (
          <>
            <Label className="bg-sidebar sticky top-0 ml-6 truncate text-nowrap pb-1"></Label>
            <Label className="bg-sidebar sticky top-0 truncate text-nowrap pb-1">
              Источник
            </Label>
            <Label className="bg-sidebar sticky top-0 truncate text-nowrap pb-1">
              Номер
            </Label>
            <Label className="bg-sidebar sticky top-0 col-span-2 mr-6 truncate text-nowrap pb-1">
              Дата
            </Label>
          </>
        )}
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <div className="ml-6 truncate text-nowrap">{index + 1 + '.'}</div>
            <ExternalCaseTypeSelector
              form={form}
              fieldName={`${fieldArrayName}.${index}.system`}
              label={null}
              placeholder="Источник заявки"
            />
            <InputFormField
              form={form}
              fieldName={`${fieldArrayName}.${index}.num`}
              label={null}
              placeholder="Номер заявки"
            />
            <DateFormField
              form={form}
              fieldName={`${fieldArrayName}.${index}.date`}
              label={null}
              placeholder="Дата документа"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type={'button'}
                  variant={'outline'}
                  onClick={() => remove(index)}
                  className="mr-2 size-10 p-0"
                >
                  <Trash2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить номер</TooltipContent>
            </Tooltip>
          </Fragment>
        ))}
        <Button
          className="bg-sidebar sticky bottom-0 col-span-2 col-start-4 mr-6"
          variant={'ghost'}
          type={'button'}
          onClick={() => append({ system: 'NONE', num: '', date: new Date() })}
        >
          <FilePlus className="mr-2 size-5" />
          <p>Добавить источник</p>
        </Button>
      </div>
    </ScrollArea>
  );
};

export { ExternalCaseFieldArray };
