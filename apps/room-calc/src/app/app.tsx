import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@urgp/ui';

import { Cat } from 'lucide-react';

export function App() {
  return (
    <Card className={'max-w-md self-center m-9'}>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
        <CardDescription>Is it me you're lookin for?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p>Тут гуляют ваших мамок</p>
        <p>Если вдруг это не было сразу понятно...</p>
        <Separator />
        <Label htmlFor="ouch">Чтож это делается?</Label>
        <Input placeholder="Безобразие!" id="ouch" />
      </CardContent>
      <CardFooter>
        <Button
          variant={'outline'}
          className={'w-full flex justify-around gap-2'}
        >
          <Cat />
          <p>Тут обидают котики</p>
          <Cat />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default App;
