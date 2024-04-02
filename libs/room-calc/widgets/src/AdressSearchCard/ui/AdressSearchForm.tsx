import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  HStack,
  Input,
} from '@urgp/shared/ui';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { getDirtyValues } from '@urgp/shared/util';

const items = [
  { value: '1', label: 'ул. Ленина' },
  { value: '2', label: 'ул. Центральная' },
  { value: '3', label: 'ул. Самая Старая и Длинная Неглинка' },
  { value: '4', label: 'просп. Вернадского' },
  { value: '5', label: 'ул. Маршала Жукова' },
];

const formSchema = z.object({
  //   streetId: z.number({ invalid_type_error: 'Необходимо выбрать улицу' }), // улица
  streetId: z.string().min(1, { message: 'Нужно выбрать улицу' }), // улица
  buiuldingNum: z.string().optional(), // дом
  housingNum: z.string().optional(), // корпус
  structureNum: z.string().optional(), // строение
});

export const AdressSearchForm: React.FC = memo(() => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetId: '',
      buiuldingNum: '',
      housingNum: '',
      structureNum: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast('Ушли такие вот данные:', {
      description: JSON.stringify(
        getDirtyValues(form.formState.dirtyFields, data),
        null,
        2,
      ),
      action: <Button onClick={() => console.log(data.streetId)}>Окай</Button>,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full grid-cols-5 items-end gap-6 md:grid-cols-10">
          <FormField
            control={form.control}
            name="streetId"
            render={({ field }) => (
              <FormItem className="col-span-5 flex flex-col">
                {form.control.getFieldState('streetId').error ? (
                  <FormMessage />
                ) : (
                  <FormLabel>Улица</FormLabel>
                )}
                <FormControl>
                  <Combobox
                    items={items}
                    value={field.value}
                    onSelect={(newValue) => {
                      form.clearErrors('streetId');
                      form.setValue('streetId', newValue, {
                        shouldDirty: true,
                      });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buiuldingNum"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Дом</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="housingNum"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Корпус</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="structureNum"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Строение</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="col-span-2">
            Поиск
          </Button>

          <FormMessage />
          {form.formState.isDirty && (
            <Button
              variant="ghost"
              size="icon"
              type="reset"
              className="absolute top-6 right-6"
              onClick={() => {
                form.reset();
              }}
            >
              <X />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
});
