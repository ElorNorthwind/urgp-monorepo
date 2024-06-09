import { cn } from '@urgp/shared/util';
import React, { memo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Card } from '@urgp/shared/ui';
import { BasemapSelector } from './BasemapSelector';

type MapProps = {
  className?: string;
};

export const basemapDict = {
  carto: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

export const Map: React.FC<MapProps> = memo(({ className }: MapProps) => {
  const [basemap, setBasemap] = useState<keyof typeof basemapDict>('carto');

  return (
    <MapContainer
      center={[55.74938, 37.534092]}
      zoom={13}
      scrollWheelZoom={false}
      attributionControl={false}
      className={cn(className)}
    >
      <TileLayer url={basemapDict[basemap]} className="z-0" />
      <Marker position={[55.74938, 37.534092]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Card className="absolute right-2 bottom-2 z-[1000] select-none p-2">
        huh
      </Card>
      <BasemapSelector
        basemap={basemap}
        onBasemapChange={(e) => setBasemap(e)}
        className="absolute right-2 top-2 z-[1000] w-[120px]"
      />
    </MapContainer>
  );
});
