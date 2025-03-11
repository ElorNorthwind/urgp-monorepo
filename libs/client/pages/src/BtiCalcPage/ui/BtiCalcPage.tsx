import { VStack } from '@urgp/client/shared';
import { AdressSearchCard, FileInputCard } from '@urgp/client/widgets';

const BtiCalcPage = (): JSX.Element => {
  return (
    <VStack>
      <FileInputCard />
      <AdressSearchCard />
    </VStack>
  );
};

export default BtiCalcPage;
