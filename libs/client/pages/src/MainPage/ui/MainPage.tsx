import { VStack } from '@urgp/shared/ui';
import { AdressSearchCard, FileInputCard } from '@urgp/client/widgets';

const MainPage = (): JSX.Element => {
  return (
    <VStack>
      <FileInputCard />
      <AdressSearchCard />
    </VStack>
  );
};

export { MainPage };
