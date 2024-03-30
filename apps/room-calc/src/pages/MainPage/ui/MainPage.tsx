import { HStack, VStack } from '@urgp/ui';
import { MainPageTestCard } from './MainPageCard';
import { FileInputCard } from '@urgp/room-calc/widgets/FileInputCard';

const MainPage = (): JSX.Element => {
  return (
    <VStack>
      <FileInputCard />
    </VStack>
  );
};

export { MainPage };
