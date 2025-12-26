import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Form,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import {
  AddDefectDataDto,
  addDefectDataSchema,
  addNotificationsDataSchema,
  AddNotoficationsDataDto,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePostApartmentDefects,
  usePostNotifications,
} from '@urgp/client/entities';
import { ExcelFileInput } from '@urgp/client/features';
import { LoaderCircle, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type RenovationNotificationsFileUploadFormProps = {
  className?: string;
};

const RenovationNotificationsFileUploadForm = ({
  className,
}: RenovationNotificationsFileUploadFormProps): JSX.Element | null => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postNotifications, { isLoading }] = usePostNotifications();

  const isMobile = useIsMobile();

  async function onReset() {
    if (fileInputRef?.current) fileInputRef.current.value = '';
  }

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    await postNotifications(file)
      .unwrap()
      .then(() => {
        toast.success('Данные по уведомлениям переданы!');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось передать уведомления', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    onReset();
  };

  return (
    <Card>
      <CardHeader className="bg-muted-foreground/5 mb-4 pb-4">
        <CardTitle className="relative flex flex-row items-center justify-between">
          <span>Загрузить информацию об уведомлениях</span>
        </CardTitle>
        <CardDescription>
          Файл Excel с отчетом по прогремме Реновации
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn('relative flex flex-col gap-4', className)}>
          <div>
            <label
              className={cn(
                'flex justify-between truncate text-left',
                'mb-2 text-sm font-medium leading-none',
              )}
            >
              <span>Выбрать файл</span>
            </label>
            <div
              className={cn(
                'group relative',
                'ring-offset-background first-focus-visible:ring-ring first-focus-visible:outline-none first-focus-visible:ring-2 first-focus-visible:ring-offset-2 first-disabled:cursor-not-allowed first-disabled:opacity-50',
                'border-input bg-muted-foreground/5 flex items-center justify-center rounded-md border border-dashed px-3 py-2',
                className,
              )}
            >
              <input
                id={'file'}
                ref={fileInputRef}
                type={'file'}
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className={cn(
                  'cursor-pointer" absolute inset-0 h-full w-full opacity-0',
                )}
              />

              <div className="pointer-events-none flex flex-col items-center justify-center gap-2 p-4">
                <div className="bg-muted-foreground/10 flex flex-row items-center gap-2 rounded-full p-3 transition-transform group-hover:scale-105">
                  <Upload className="size-8 flex-shrink-0" />
                </div>

                <div className="text-center">
                  <p className="font-medium">
                    {'Кликните или перетащите файл'}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {'Файл Excel с отчетом по прогремме Реновации'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RenovationNotificationsFileUploadForm };
