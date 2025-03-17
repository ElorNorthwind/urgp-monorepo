import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@urgp/client/shared';
import { CreateXMLForm } from '@urgp/client/widgets';

const XMLGeneratorPage = (): JSX.Element => {
  return (
    <div className="block space-y-6 p-10 pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex w-full flex-row justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Формирование XML файлов
            </h2>
            <p className="text-muted-foreground">
              Для распоряжений о переводе помещений и зданий
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="bg-muted-foreground/5 mb-4 pb-4">
              <CardTitle className="relative flex flex-row items-center justify-between">
                <div>Данные для передачи</div>
              </CardTitle>
              <CardDescription>Внесите сведения о распоряжении</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateXMLForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default XMLGeneratorPage;
