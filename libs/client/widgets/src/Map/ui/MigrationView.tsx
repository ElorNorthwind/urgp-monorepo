import React, { memo, useEffect } from 'react';
import { useMap } from 'react-leaflet';

// import 'leaflet/dist/leaflet.css';
// import { LatLngBounds, LatLngTuple, polyline } from 'leaflet';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { AntPath } from 'leaflet-ant-path';

// import * as L2 from 'leaflet';
import 'leaflet.migration';
const L = window['L'];

// import './leafletMigration.js';

// [55.755824, 37.531088] as LatLngTuple,
// [55.750535, 37.531088] as LatLngTuple,

const data = [
  {
    labels: ['ОКО', 'АйСити'],
    from: [37.534092, 55.74938],
    to: [37.530067, 55.754892],
    // from: [55.755824, 37.531088],
    // to: [55.753994, 37.531336],
    color: 'rgba(45, 61, 120, 0.6)',
    value: 1,
  },
];

// const data = [{ from: [55.755824, 37.531088], to: [55.753994, 37.531336] }];

const options = {
  marker: {
    // [min, max]
    radius: [10, 10],
    // show marker ring animation
    pulse: false,
    textVisible: false,
  },
  line: {
    width: 1,
    order: true,
    icon: {
      type: 'circle',
      imgUrl: '',
      size: 15,
    },
  },
  // marker: 'https://github.githubassets.com/favicons/favicon.png',
};

export const MigrationView: React.FC = memo(() => {
  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const migrationLayer = L.migrationLayer(data, options);
    // migrationLayer.addTo(map);
    map.addLayer(migrationLayer);
    // migrationLayer.show();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // console.log(L.migrationLayer);

    // console.log('bam');
    // migrationLayer.setStyle({ pulse: { radius: 20 } });
    // migrationLayer.setData([]);
    // map.remove(migrationLayer);

    // const bounds = new LatLngBounds(
    //   [55.755824, 37.531088] as LatLngTuple,
    //   [55.750535, 37.536535] as LatLngTuple,
    // );
    // map.fitBounds(bounds);
    // const antPolyline = new AntPath(
    //   [
    //     // [55.74938, 37.534092],
    //     // [55.754892, 37.530067],
    //     [55.750088, 37.533698],
    //     [55.753994, 37.531336],
    //   ],
    //   {
    //     use: polyline,
    //     color: 'orange',
    //     delay: 2000,
    //     dashArray: [5, 10],
    //     className: 'stroke-[8px]',
    //   },
    // );
    // antPolyline.addTo(map);
  }, [map]);

  //  // Using the constructor...
  //  let antPolyline = new L.Polyline.AntPath(latlngs, options);

  //  // ... or use the factory
  //  antPolyline = L.polyline.antPath(latlngs, options);

  //  antPolyline.addTo(map);

  return null;
});
