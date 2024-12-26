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
import { useRef } from 'react';

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

  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollArea
        ref={viewportRef}
        className={cn(
          'overflow-autopx-6 bg-sidebar relative -mx-6 max-h-52 scroll-smooth border-y py-2',
          className,
        )}
      >
        <div className="mx-6 mb-2 grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-2">
          {fields.length > 0 ? (
            <>
              <Label className="bg-sidebar sticky top-0 truncate text-nowrap pb-1"></Label>
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
          ) : (
            <div className="bg-red col-span-5 -mb-2 text-center italic">
              Источники заявки не указаны
            </div>
          )}
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="truncate text-nowrap">{index + 1 + '.'}</div>
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
                    className="size-10 p-0"
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Удалить номер</TooltipContent>
              </Tooltip>
            </Fragment>
          ))}
        </div>
      </ScrollArea>
      <Button
        className="bg-sidebar -mt-2 ml-auto"
        variant={'ghost'}
        type={'button'}
        onClick={() => {
          viewportRef?.current &&
            viewportRef.current.scrollTo(10, viewportRef.current.scrollHeight);
          append({ system: 'NONE', num: '', date: new Date() });
        }}
      >
        <FilePlus className="mr-2 size-5" />
        <p>Добавить источник</p>
      </Button>
    </>
  );
};

export { ExternalCaseFieldArray };
