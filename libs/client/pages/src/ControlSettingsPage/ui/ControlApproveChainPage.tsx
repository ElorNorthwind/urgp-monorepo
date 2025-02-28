import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@urgp/client/shared';
import { ApproveChainsTab } from '@urgp/client/widgets';

const ControlApproveChainPage = (): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои сценарии согласования</CardTitle>
        <CardDescription>
          Варианты согласования дел с мои участием
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ApproveChainsTab label={null} />
      </CardContent>
    </Card>
  );
};

export { ControlApproveChainPage };
