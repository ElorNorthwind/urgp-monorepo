import { Card, HStack, MainLayout, VStack } from '@urgp/shared/ui';
import { Link } from '@tanstack/react-router';
import { Calculator, Map } from 'lucide-react';

const MainPage = (): JSX.Element => {
  return (
    <MainLayout
      content={
        <VStack>
          <h1>Чем богаты</h1>
          <Card className="w-full p-2">
            <Link to="/map">
              <HStack>
                <Map />
                <p className="h-full text-center">Карта</p>
              </HStack>
            </Link>
          </Card>
          <Card className="w-full p-2">
            <Link to="/bticalc">
              <HStack>
                <Calculator />
                <p className="h-full text-center">Калькулятор БТИ</p>
              </HStack>
            </Link>
          </Card>
        </VStack>
      }
    />
  );
};

export { MainPage };
