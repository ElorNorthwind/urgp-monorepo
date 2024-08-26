import { MapComponent } from '@urgp/client/shared';
import React, { forwardRef } from 'react';
import { Polygon, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { OldBuildingRelocationMapElement } from '@urgp/shared/entities';
import { FitBounds } from './FitBounds';
import { Map } from 'leaflet';
import { MapCurve } from '@urgp/client/features';
import { useOldBuildingRelocationMap } from '@urgp/client/entities';

type OldBuildingRelocationMapProps = {
  buildingId: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const mapItemColors = {
  movement: 'blue',
  selected: 'red',
  construction: 'gray',
  other_on_plot: 'orange',
} as Record<OldBuildingRelocationMapElement['type'], string>;

export const OldBuildingRelocationMap = forwardRef<
  Map,
  OldBuildingRelocationMapProps
>(
  (
    { className, buildingId, children, style }: OldBuildingRelocationMapProps,
    ref,
  ) => {
    const {
      data: mapItems,
      isFetching,
      isLoading,
    } = useOldBuildingRelocationMap(buildingId);

    return (
      <MapComponent
        isLoading={isLoading || isFetching}
        className={className}
        scrollWheelZoom={true}
        style={style}
        ref={ref}
      >
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
                  <MapCurve
                    key={item.id + 'curve'}
                    start={item?.start.coordinates}
                    finish={item?.finish.coordinates}
                  />
                );
              })}
            {buildingId && (
              <FitBounds box={mapItems?.[0]?.bounds?.coordinates} />
            )}
          </>
        )}
        {children}
      </MapComponent>
    );
  },
);
