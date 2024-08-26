import { Map } from '@urgp/client/widgets';

const MapPage = (): JSX.Element => {
  return (
    <div className="relative h-screen w-full bg-slate-400">
      <Map className="z-10 h-full w-full" />
      {/* <Card className="absolute right-2 top-2 z-20 p-2">bla bla bla</Card> */}
    </div>
  );
};

export { MapPage };
