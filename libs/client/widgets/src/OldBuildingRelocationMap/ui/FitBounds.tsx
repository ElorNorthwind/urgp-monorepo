import React, { memo, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngBounds, LatLngExpression, LatLngTuple } from 'leaflet';

type FitBoundsProps = {
  box: LatLngExpression[];
};

export const FitBounds: React.FC<FitBoundsProps> = memo(
  ({ box }: FitBoundsProps) => {
    const map = useMap();

    useEffect(() => {
      const bounds = new LatLngBounds(
        box?.[0] as LatLngTuple,
        box?.[3] as LatLngTuple,
      );
      map.fitBounds(bounds, { padding: [10, 10] });
    }, [map, box]);
    return null;
  },
);
