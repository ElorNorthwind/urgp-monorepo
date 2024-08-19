import { cn, Skeleton } from '@urgp/client/shared';
import React, { forwardRef, memo, useState } from 'react';
import { MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useOldBuildingRelocationMap } from '@urgp/client/entities';
import { OldBuildingRelocationMapElement } from '@urgp/shared/entities';
import { FitBounds } from './FitBounds';
import { AddCurve } from './AddCurve';
// import AntPath from 'react-leaflet-ant-path';

type OldBuildingRelocationMapProps = {
  buildingId: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const basemapDict = {
  carto: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

const mapItemColors = {
  movement: 'blue',
  selected: 'red',
  construction: 'gray',
  other_on_plot: 'orange',
} as Record<OldBuildingRelocationMapElement['type'], string>;

export const OldBuildingRelocationMap: React.FC<OldBuildingRelocationMapProps> =
  memo(
    ({
      className,
      buildingId,
      children,
      style,
    }: OldBuildingRelocationMapProps) => {
      const [map, setMap] = useState(null);

      // const [basemap, setBasemap] = useState<keyof typeof basemapDict>('carto');
      const {
        data: mapItems,
        isFetching,
        isLoading,
      } = useOldBuildingRelocationMap(buildingId);

      return isFetching || isLoading ? (
        <Skeleton className={cn(className)} style={style} />
      ) : (
        <MapContainer
          center={[55.74938, 37.534092]}
          zoom={13}
          scrollWheelZoom={false}
          attributionControl={false}
          className={cn(className)}
          style={style}
          whenReady={() => setMap(map)}
        >
          <TileLayer url={basemapDict['carto']} className="z-0" />
          {mapItems && mapItems.length > 0 && (
            <>
              {mapItems.map((item) => {
                if (!item || !item?.geometry) return null;
                return (
                  <Polygon
                    key={item?.id + item.type}
                    positions={item?.geometry?.coordinates}
                    pathOptions={{
                      color: mapItemColors[item?.type || 'construction'],
                    }}
                  >
                    <Popup>
                      <h3 className="text-xs">{item?.adress || ''}</h3>
                    </Popup>
                  </Polygon>
                );
              })}
              {mapItems
                .filter((item) => item.start && item.finish)
                .map((item) => {
                  return (
                    <AddCurve
                      key={item.id + 'curve'}
                      start={item?.start.coordinates}
                      finish={item?.finish.coordinates}
                    />
                  );
                })}
              <FitBounds box={mapItems?.[0]?.bounds?.coordinates} />
            </>
          )}
          {children}
        </MapContainer>
      );
    },
  );
