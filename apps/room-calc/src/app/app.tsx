import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  Input,
  Label,
  Separator,
  VStack,
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
        <VStack
          gap={'none'}
          align={'end'}
          justify={'between'}
          className="w-full"
        >
          <div className="bg-red-500">x</div>
          <p className="py-3">
            Тут гуляют ваших мамок, <br />
            Если вдруг это не было сразу понятно...
          </p>
          <Label htmlFor="ouch" className="text-right">
            Чтож это делается?
          </Label>
          <Input placeholder="Безобразие!" id="ouch" />
        </VStack>
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
