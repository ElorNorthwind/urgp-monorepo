import { cn } from '@urgp/shared/util';
import React, { memo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

type MapProps = {
  className?: string;
};

export const Map: React.FC<MapProps> = memo(({ className }: MapProps) => {
  return (
    <MapContainer
      center={[55.74938, 37.534092]}
      zoom={13}
      scrollWheelZoom={false}
      attributionControl={false}
      className={cn(className)}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        className="z-0"
      />
      <Marker position={[55.74938, 37.534092]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
});
