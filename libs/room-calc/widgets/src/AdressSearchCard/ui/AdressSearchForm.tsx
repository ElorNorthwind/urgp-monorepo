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

const items = [
  { value: '1', label: 'ул. Ленина' },
  { value: '2', label: 'ул. Центральная' },
  { value: '3', label: 'ул. Самая Старая и Длинная Неглинка' },
  { value: '4', label: 'просп. Вернадского' },
  { value: '5', label: 'ул. Маршала Жукова' },
];

const formSchema = z.object({
  //   streetId: z.number({ invalid_type_error: 'Необходимо выбрать улицу' }), // улица
  streetId: z.string({ required_error: 'Нужно выбрать улицу' }).min(1), // улица
  buiuldingNum: z.string().optional(), // дом
  housingNum: z.string().optional(), // корпус
  structureNum: z.string().optional(), // строение
});

export const AdressSearchForm: React.FC = memo(() => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buiuldingNum: '',
      housingNum: '',
      structureNum: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast('Ушли такие вот данные:', {
      description: JSON.stringify(data, null, 2),
      action: <Button onClick={() => console.log(data.streetId)}>Окай</Button>,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <HStack className="w-full items-end">
          <FormField
            control={form.control}
            name="streetId"
            render={({ field }) => (
              <FormItem className="flex w-[350px] flex-col">
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
                      form.clearErrors();
                      form.setValue('streetId', newValue);
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
              <FormItem className="max-w-[80px]">
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
              <FormItem className="max-w-[80px]">
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
              <FormItem className="max-w-[80px]">
                <FormLabel>Строение</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            variant="secondary"
            type="reset"
            className="flex-shrink place-self-end"
            onClick={() => form.reset()}
          >
            <X />
          </Button>
          <Button type="submit" className="flex-grow place-self-end">
            Поиск
          </Button>

          <FormMessage />
        </HStack>
      </form>
    </Form>
  );
});
