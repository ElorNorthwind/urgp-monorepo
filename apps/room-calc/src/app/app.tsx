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
    <Card className={'m-9 max-w-md self-center'}>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
        <CardDescription>Is it me you're lookin for?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Separator />
        <p>Тут гуляют ваших мамок</p>
        <p>Если вдруг это не было сразу понятно...</p>
        <Label htmlFor="ouch" className="text-right">
          Чтож это делается?
        </Label>
        <Input placeholder="Безобразие!" id="ouch" />
      </CardContent>
      <CardFooter>
        <Button
          variant={'outline'}
          className={'flex w-full justify-around gap-2'}
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
