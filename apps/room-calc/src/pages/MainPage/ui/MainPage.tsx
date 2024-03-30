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
  VStack,
} from '@urgp/ui';
import { Cat } from 'lucide-react';
import { MainPageTestCard } from './MainPageCard';

const MainPage = (): JSX.Element => {
  return (
    <VStack>
      <HStack className="p-4">
        <MainPageTestCard />
        <MainPageTestCard />
        <MainPageTestCard />
      </HStack>
    </VStack>
  );
};

export { MainPage };
