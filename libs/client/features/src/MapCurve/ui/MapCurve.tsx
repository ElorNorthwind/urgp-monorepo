import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';
import classes from './MapCurve.module.css';
import { cn, createCurve } from '@urgp/client/shared';
import { Weight } from 'lucide-react';

type MapCurveProps = {
  start: LatLngTuple;
  finish: LatLngTuple;
  className?: string;
  variant?: 'red' | 'green';
  pane?: string;
};

export const MapCurve: React.FC<MapCurveProps> = memo(
  ({ start, finish, className, pane, variant = 'red' }) => {
    const map = useMap();

    useEffect(() => {
      const curve = createCurve(start, finish, {
        className: cn(
          classes['path'],
          'opacity-50 ',
          variant === 'red' ? 'stroke-red-500' : 'stroke-emerald-500',
          className,
        ),
        pane: pane,
      });

      curve.addTo(map);
      return () => {
        map.removeLayer(curve);
      };
    }, [map, start, finish, className, pane]);
    return null;
  },
);
