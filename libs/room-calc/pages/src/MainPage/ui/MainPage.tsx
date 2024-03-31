import { VStack } from '@urgp/shared/ui';
import { AdressSearchCard, FileInputCard } from '@urgp/room-calc/widgets';

const MainPage = (): JSX.Element => {
  return (
    <VStack>
      <FileInputCard />
      <AdressSearchCard />
    </VStack>
  );
};

export { MainPage };
