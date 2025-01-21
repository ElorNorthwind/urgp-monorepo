import { zodResolver } from '@hookform/resolvers/zod';
import { Button, cn, Form } from '@urgp/client/shared';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  DirectionTypeSelector,
  useCurrentUserSettings,
  useSetCurrentUserDirections,
} from '@urgp/client/entities';
import { InputSkeleton } from '@urgp/client/features';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';

const dto = z.object({ directions: z.array(z.number()) });

type ChangeDirectionsFormProps = {
  className?: string;
  popoverMinWidth?: string;
};

const ChangeDirectionsForm = ({
  className,
  popoverMinWidth,
}: ChangeDirectionsFormProps): JSX.Element | null => {
  const { data: settings, isLoading: isSettingsLoading } =
    useCurrentUserSettings();

  const defaultValues = useMemo(() => {
    return {
      directions: settings?.directions || [],
    };
  }, [settings, isSettingsLoading]);

  const form = useForm<z.infer<typeof dto>>({
    resolver: zodResolver(dto),
    defaultValues,
  });

  const [setDirections, { isLoading: isSetLoading }] =
    useSetCurrentUserDirections();

  async function onSubmit(data: z.infer<typeof dto>) {
    setDirections(data.directions)
      .unwrap()
      .then(() => {
        toast.success('Настройки сохранены');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось сохранить настройки', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    form.reset(defaultValues);
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isSettingsLoading ? (
          <InputSkeleton />
        ) : (
          <DirectionTypeSelector
            form={form}
            fieldName="directions"
            label={null}
            // label="Подписаться на заявки по направлениям"
            popoverMinWidth={popoverMinWidth}
          />
        )}
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-grow"
            disabled={isSetLoading || form.formState.isDirty === false}
            onClick={() => {
              form.reset(defaultValues);
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSetLoading || form.formState.isDirty === false}
            className="flex flex-grow flex-row gap-2"
          >
            <span>Сохранить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ChangeDirectionsForm };
