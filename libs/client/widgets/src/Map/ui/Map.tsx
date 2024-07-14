import { cn } from '@urgp/client/shared';
import React, { memo, useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
  GeoJSON,
} from 'react-leaflet';

import { GeoJsonObject } from 'geojson';

import 'leaflet/dist/leaflet.css';
import { Card } from '@urgp/client/shared';
import { BasemapSelector } from './BasemapSelector';
import { LatLngBounds, LatLngExpression, LatLngTuple } from 'leaflet';
import { FitBounds } from './FitBounds';
import { MigrationView } from './MigrationView';
import { useOldBuildingsGeoJson } from '@urgp/client/entities';
// import AntPath from 'react-leaflet-ant-path';

type MapProps = {
  className?: string;
};

const okoPolygon: LatLngExpression[] = [
  [55.74981559519313, 37.53351731750604],
  [55.74947738999859, 37.533667548125266],
  [55.74922698618661, 37.53389867215418],
  [55.74943836613352, 37.534470704124004],
  [55.749698524496125, 37.53419913339107],
  [55.75000746029821, 37.535181410513104],
  [55.75034891281206, 37.53482894636892],
  [55.75008875878669, 37.5339275626566],
  [55.74981559519313, 37.53351731750604],
];

const icityPolygon: LatLngExpression[] = [
  [55.75551245545475, 37.52913881118852],
  [55.755322328566734, 37.52871084613656],
  [55.75492939672853, 37.528845992995514],
  [55.75428295186464, 37.52954425176367],
  [55.75399141440121, 37.53071552453727],
  [55.754042116725174, 37.531166014065974],
  [55.754980097833226, 37.53163902807134],
  [55.75536035401856, 37.53136873435355],
  [55.755563155801525, 37.530580377678376],
  [55.75551245545475, 37.52913881118852],
];

export const basemapDict = {
  carto: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

export const Map: React.FC<MapProps> = memo(({ className }: MapProps) => {
  const [basemap, setBasemap] = useState<keyof typeof basemapDict>('carto');
  const { data: buildingsGeoJson } = useOldBuildingsGeoJson();

  return (
    <MapContainer
      center={[55.74938, 37.534092]}
      zoom={13}
      scrollWheelZoom={false}
      attributionControl={false}
      className={cn(className)}
    >
      <TileLayer url={basemapDict[basemap]} className="z-0" />
      {buildingsGeoJson && (
        <GeoJSON
          data={buildingsGeoJson as GeoJsonObject}
          style={{
            color: '#de984e',
            // className: 'bg-slate-200',
          }}
        ></GeoJSON>
      )}
      <MigrationView />
      <Polygon
        positions={okoPolygon}
        pathOptions={{ color: 'blue' }}
        // className="hover:opacity-75"
      >
        <Popup>
          <h2>Это ОКО</h2> <br /> ко ко ко
        </Popup>
      </Polygon>
      <Polygon
        positions={icityPolygon}
        pathOptions={{ color: 'red' }}
        className="z-10"
      >
        <Popup>
          <h2>Это iCity</h2> <br /> впереди только боль
        </Popup>
      </Polygon>
      {/* <AntPath></AntPath> */}
      <Card className="absolute right-2 bottom-2 z-[1000] select-none p-2">
        huh
      </Card>
      <BasemapSelector
        basemap={basemap}
        onBasemapChange={(e) => setBasemap(e)}
        className="absolute right-2 top-2 z-[1000] w-[120px]"
      />
      <FitBounds />
    </MapContainer>
  );
});
