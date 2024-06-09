import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LatLngBounds, LatLngTuple, polyline } from 'leaflet';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AntPath } from 'leaflet-ant-path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import arc from 'arc';
// const start = { y: 55.755824, x: 37.531088 };
// const end = { y: 55.750535, x: 37.536535 };
const start = { x: 55.74938, y: 37.534092 };
const end = { x: 55.754892, y: 37.530067 };
const generator = new arc.GreatCircle(start, end, { name: 'shiet' });
const line = generator.Arc(100, { offset: 10 });

// const generator

export const FitBounds: React.FC = memo(() => {
  const map = useMap();

  useEffect(() => {
    console.log(line);
    const bounds = new LatLngBounds(
      [55.755824, 37.531088] as LatLngTuple,
      [55.750535, 37.536535] as LatLngTuple,
    );
    map.fitBounds(bounds);

    const antPolyline = new AntPath(
      // line.geometries[0].coords,
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
