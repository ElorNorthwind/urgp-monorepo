import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';
import classes from './MapCurve.module.css';
import { cn, createCurve } from '@urgp/client/shared';

type MapCurveProps = {
  start: LatLngTuple;
  finish: LatLngTuple;
  className?: string;
};

export const MapCurve: React.FC<MapCurveProps> = memo(
  ({ start, finish, className }) => {
    const map = useMap();

    useEffect(() => {
      const curve = createCurve(start, finish, {
        className: cn(classes['path'], 'opacity-50  stroke-red-500', className),
      });

      curve.addTo(map);
      return () => {
        map.removeLayer(curve);
      };
    }, [map, start, finish, className]);
    return null;
  },
);
