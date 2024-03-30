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
} from '@urgp/ui';
import { Cat } from 'lucide-react';

const MainPageTestCard = (): JSX.Element => {
  return (
    <Card className="w-28">
      <CardHeader>
        <CardTitle>Hello</CardTitle>
        <CardDescription>Is it me you're lookin' for?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-right">Ваших мамок тут гуляли</p>
        <Label htmlFor="ouch">Возмущение</Label>
        <Input id="ouch" placeholder="Безобразие!" />
      </CardContent>
      <CardFooter>
        <Button variant={'secondary'}>
          <HStack justify={'around'}>
            <Cat />
            <p>Тут так же есть котики</p>
            <Cat />
          </HStack>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { MainPageTestCard };
