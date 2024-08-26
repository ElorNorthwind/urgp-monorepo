import {
  DeviationChart,
  OldBuildingTermsChart,
  useOldBuildingList,
  useOldBuildingRelocationMap,
  useOldBuildingsGeoJson,
  useOldBuldingById,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button, Combobox, MapComponent } from '@urgp/client/shared';
import {
  OldBuildingRelocationMap,
  OldBuildingsCard,
} from '@urgp/client/widgets';
import { useCallback, useEffect, useRef } from 'react';
import { Marker, Polygon, Popup, Tooltip, GeoJSON } from 'react-leaflet';
import { OldBuildingRelocationMapElement } from '@urgp/shared/entities';
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
  const { buildingId } = getRouteApi(
    '/renovation/building-relocation-map',
  ).useSearch();
  const mapRef = useRef<Map>(null);

  // const { data: oldBuildings, isLoading, isFetching } = useOldBuildingList();
  const navigate = useNavigate({ from: '/renovation/building-relocation-map' });

  const { data: oldBuildings } = useOldBuildingsGeoJson();

  const {
    data: selectedMapItems,
    isFetching,
    isLoading,
  } = useOldBuildingRelocationMap(buildingId || 0, { skip: buildingId === 0 });

  const {
    data: oldBuilding,
    isLoading: isBuildingLoading,
    isFetching: isBuildingFetching,
  } = useOldBuldingById(buildingId || 0, { skip: buildingId === 0 });

  const fitBounds = useCallback(() => {
    if (!mapRef.current || !buildingId) return;

    const bounds = new LatLngBounds(
      selectedMapItems?.[0]?.bounds?.coordinates?.[0] as LatLngTuple,
      selectedMapItems?.[0]?.bounds?.coordinates?.[3] as LatLngTuple,
    );

    mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
  }, [mapRef, selectedMapItems, buildingId]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      fitBounds();
    }, 200);

    return () => {
      clearTimeout(timer1);
    };
  }, [mapRef, selectedMapItems, buildingId, fitBounds]);

  const onEachFeature = useCallback(
    (feature: any, layer: any) => {
      layer.bindTooltip(() => {
        return feature.properties?.adress || '';
      });

      layer.on({
        click: (e: LeafletEvent) =>
          navigate({
            search: (prev: any) => ({
              ...prev,
              buildingId: e.sourceTarget.feature.properties.id,
            }),
          }),
      });
    },
    [navigate],
  );

  // useEffect(() => {
  //   if (!mapRef.current || !oldBuildings) return;
  //   geoJson(oldBuildings, {
  //     onEachFeature: onEachFeature,
  //   }).addTo(mapRef?.current);
  // }, [oldBuildings, mapRef, onEachFeature, buildingId]);

  return (
    <div className="isolate">
      <div className="absolute bottom-20 top-4 right-4 shadow-sm">
        {isBuildingLoading || isBuildingFetching || !buildingId ? null : (
          <OldBuildingsCard
            building={oldBuilding || null}
            route="/renovation/building-relocation-map"
            onClose={() => navigate({ search: { buildingId: undefined } })}
            className="h-full transition-all ease-in-out"
          />
        )}
      </div>
      <MapComponent
        // isLoading={isLoading || isFetching}
        className={'relative -z-10 h-[calc(100vh-1rem)] w-full rounded border'}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        {oldBuildings && (
          <GeoJSON
            data={oldBuildings}
            onEachFeature={onEachFeature}
            style={(feature) =>
              feature?.properties.id === buildingId
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
        {selectedMapItems && selectedMapItems.length > 0 && (
          <>
            {selectedMapItems
              .filter((item) =>
                ['construction', 'movement'].includes(item.type),
              )
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
            {selectedMapItems
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
          </>
        )}
        {buildingId && (
          <Button
            variant="outline"
            className="absolute right-2 bottom-2 z-[1000] h-10 w-10 p-0"
            onClick={() => fitBounds()}
          >
            <Focus className="h-6 w-6" />
          </Button>
        )}
      </MapComponent>
    </div>
  );
};

export { BuildingRelocationMapPage };
