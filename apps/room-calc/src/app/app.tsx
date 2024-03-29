import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@urgp/ui';

import { Cat } from 'lucide-react';

export function App() {
  return (
    <Card className={'max-w-md self-center m-9'}>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
        <CardDescription>Is it me you're lookin for?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Тут гуляют ваших мамок</p>
        <p>Если вдруг это не было сразу понятно...</p>
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
