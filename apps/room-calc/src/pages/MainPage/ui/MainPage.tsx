import { HStack, VStack } from '@urgp/ui';
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
