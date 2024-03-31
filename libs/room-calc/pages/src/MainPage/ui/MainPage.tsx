import { VStack } from '@urgp/shared/ui';
import { AdressSearchForm, FileInputCard } from '@urgp/room-calc/widgets';

const MainPage = (): JSX.Element => {
  return (
    <VStack>
      <FileInputCard />
      <AdressSearchForm />
    </VStack>
  );
};

export { MainPage };
