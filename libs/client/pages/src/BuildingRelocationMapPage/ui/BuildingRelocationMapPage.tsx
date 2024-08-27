import {
  DeviationChart,
  OldBuildingTermsChart,
  useOldBuildingList,
  useOldBuildingRelocationMap,
  useOldBuildingsGeoJson,
  useOldBuldingById,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button, cn, Combobox, MapComponent } from '@urgp/client/shared';
import {
  OldBuildingRelocationMap,
  OldBuildingsCard,
} from '@urgp/client/widgets';
import { useCallback, useEffect, useRef } from 'react';
import { Marker, Polygon, Popup, Tooltip, GeoJSON } from 'react-leaflet';
import {
  OldBuildingRelocationMapElement,
  RelocationMapSerch,
} from '@urgp/shared/entities';
import { MapCurve } from '@urgp/client/features';
import {
  geoJson,
  LatLngBounds,
  LatLngExpression,
  LatLngTuple,
  LeafletEvent,
  Map,
} from 'leaflet';
import { Focus } from 'lucide-react';

const mapItemColors = {
  movement: 'blue',
  selected: 'red',
  construction: 'gray',
  other_on_plot: 'orange',
} as Record<OldBuildingRelocationMapElement['type'], string>;

const BuildingRelocationMapPage = (): JSX.Element => {
  const { selectedBuildingId, expanded } = getRouteApi(
    '/renovation/building-relocation-map',
  ).useSearch();
  const mapRef = useRef<Map>(null);

  // const { data: oldBuildings, isLoading, isFetching } = useOldBuildingList();
  const navigate = useNavigate({ from: '/renovation/building-relocation-map' });

  const {
    data: oldBuildings,
    isFetching,
    isLoading,
  } = useOldBuildingsGeoJson();

  const {
    data: selectedMapItems,
    isFetching: isSelectedMapItemsFetching,
    isLoading: isSelectedMapItemsLoading,
  } = useOldBuildingRelocationMap(selectedBuildingId || 0, {
    skip: selectedBuildingId === 0,
  });

  const {
    data: oldBuilding,
    isLoading: isBuildingLoading,
    isFetching: isBuildingFetching,
  } = useOldBuldingById(selectedBuildingId || 0, {
    skip: selectedBuildingId === 0,
  });

  const fitBounds = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = new LatLngBounds(
      selectedMapItems?.[0]?.bounds?.coordinates?.[0] as LatLngTuple,
      selectedMapItems?.[0]?.bounds?.coordinates?.[3] as LatLngTuple,
    );

    mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
  }, [selectedMapItems, mapRef]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      fitBounds();
    }, 200);
    return () => {
      clearTimeout(timer1);
    };
  }, [fitBounds, isFetching, selectedBuildingId]);

  const onEachFeature = useCallback(
    (feature: any, layer: any) => {
      layer.bindTooltip(() => {
        return feature.properties?.adress || '';
      });

      layer.on({
        click: (e: LeafletEvent) => {
          navigate({
            search: (prev: any) => ({
              ...prev,
              selectedBuildingId: e.sourceTarget.feature.properties.id,
            }),
          });
          // fitBounds();
          //   mapRef?.current &&
          //     mapRef.current.panTo([
          //       e.sourceTarget.feature.geometry.coordinates[0][0][0][1],
          //       e.sourceTarget.feature.geometry.coordinates[0][0][0][0],
          //     ]);
        },
      });
    },
    [navigate],
  );

  return (
    <div className="isolate">
      <div
        className={cn(
          'absolute top-4 right-4 shadow-sm transition-all ease-in-out',
          expanded ? 'h-[calc(100vh-2rem)]' : 'h-[4rem]',
        )}
      >
        {isBuildingLoading ||
        isBuildingFetching ||
        !selectedBuildingId ? null : (
          <OldBuildingsCard
            building={oldBuilding || null}
            mode="map"
            onClose={() =>
              navigate({ search: { selectedBuildingId: undefined } })
            }
            className={cn('h-full transition-all ease-in-out')}
            expanded={expanded}
            setExpanded={(value) =>
              navigate({
                search: (prev: RelocationMapSerch) => ({
                  ...prev,
                  expanded: value,
                }),
              })
            }
            onCenter={() => fitBounds()}
          />
        )}
      </div>
      <MapComponent
        // isLoading={isLoading || isFetching}
        className={'relative -z-10 h-[calc(100vh-1rem)] w-full rounded border'}
        scrollWheelZoom={true}
        ref={mapRef}
        whenReady={() => fitBounds()}
      >
        {oldBuildings && (
          <GeoJSON
            data={oldBuildings}
            onEachFeature={onEachFeature}
            style={(feature) =>
              feature?.properties.id === selectedBuildingId
                ? { color: 'red', opacity: 1 }
                : selectedMapItems &&
                    selectedMapItems
                      .filter((item) => item.type === 'other_on_plot')
                      .map((item) => item.id)
                      .includes(feature?.properties.id)
                  ? { color: 'orange', opacity: 1 }
                  : { color: 'grey', opacity: 0.3 }
            }
          />
        )}
        {selectedMapItems &&
          selectedMapItems.length > 0 &&
          selectedMapItems
            .filter((item) => ['construction', 'movement'].includes(item.type))
            .map((item) => {
              if (!item || !item?.geometry) return null;
              return (
                <Polygon
                  key={item?.id + item.type}
                  positions={item?.geometry?.coordinates}
                  pathOptions={{
                    color: mapItemColors[item?.type || 'construction'],
                  }}
                >
                  <Tooltip>{item?.adress || ''}</Tooltip>
                </Polygon>
              );
            })}

        {selectedMapItems &&
          selectedMapItems.length > 0 &&
          selectedMapItems
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
      </MapComponent>
    </div>
  );
};

export { BuildingRelocationMapPage };
