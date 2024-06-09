import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngBounds, LatLngTuple, polyline } from 'leaflet';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AntPath } from 'leaflet-ant-path';

export const FitBounds: React.FC = memo(() => {
  const map = useMap();

  useEffect(() => {
    const bounds = new LatLngBounds(
      [55.755824, 37.531088] as LatLngTuple,
      [55.750535, 37.536535] as LatLngTuple,
    );
    map.fitBounds(bounds);

    const antPolyline = new AntPath(
      [
        // [55.74938, 37.534092],
        // [55.754892, 37.530067],
        [55.750088, 37.533698],
        [55.753994, 37.531336],
      ],
      {
        use: polyline,
        color: 'orange',
        delay: 2000,
        dashArray: [5, 10],
        className: 'stroke-[8px]',
      },
    );

    antPolyline.addTo(map);
  }, [map]);

  //  // Using the constructor...
  //  let antPolyline = new L.Polyline.AntPath(latlngs, options);

  //  // ... or use the factory
  //  antPolyline = L.polyline.antPath(latlngs, options);

  //  antPolyline.addTo(map);

  return null;
});
