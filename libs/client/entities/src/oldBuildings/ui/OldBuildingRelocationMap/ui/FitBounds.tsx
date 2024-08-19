import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngBounds, LatLngExpression, LatLngTuple } from 'leaflet';

type FitBoundsProps = {
  box: LatLngExpression[];
};

export const FitBounds: React.FC<FitBoundsProps> = memo(
  ({ box }: FitBoundsProps) => {
    const map = useMap();

    useEffect(() => {
      //   if (!map || !box || box.length < 4) return;
      const bounds = new LatLngBounds(
        box?.[0] as LatLngTuple,
        box?.[3] as LatLngTuple,
      );
      map.fitBounds(bounds);
    }, [map, box]);
    return null;
  },
);
