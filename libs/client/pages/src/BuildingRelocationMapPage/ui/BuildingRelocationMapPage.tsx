import {
  useNewBuildingRelocationMap,
  useNewBuildingsGeoJson,
  useNewBuldingById,
  useOldBuildingRelocationMap,
  useOldBuildingsGeoJson,
  useOldBuldingById,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, MapComponent } from '@urgp/client/shared';
import { NewBuildingsCard, OldBuildingsCard } from '@urgp/client/widgets';
import { useCallback, useEffect, useState } from 'react';
import { GeoJSON, Pane } from 'react-leaflet';
import {
  BuildingsGeoJSON,
  RelocationMapPageSerch,
} from '@urgp/shared/entities';
import { MapCurve } from '@urgp/client/features';
import { LatLngBounds, LatLngTuple, Layer, LeafletEvent, Map } from 'leaflet';
import { mapItemStyles } from '../config/mapItemStyles';

const BuildingRelocationMapPage = (): JSX.Element => {
  const { selectedBuildingId, expanded, selectedPlotId } = getRouteApi(
    '/renovation/building-relocation-map',
  ).useSearch();
  // const mapRef = useRef<Map>(null);
  const [map, setMap] = useState<Map | null>(null);

  const navigate = useNavigate({ from: '/renovation/building-relocation-map' });

  const { data: oldBuildings, isFetching } = useOldBuildingsGeoJson();
  const { data: newBuildings } = useNewBuildingsGeoJson();
  const { data: selectedOldBuilding } = useOldBuildingRelocationMap(
    selectedBuildingId || 0,
    {
      skip: selectedBuildingId === 0,
    },
  );

  const { data: selectedNewBuilding } = useNewBuildingRelocationMap(
    selectedPlotId || 0,
    {
      skip: selectedPlotId === 0,
    },
  );

  const {
    data: oldBuilding,
    isLoading: isBuildingLoading,
    isFetching: isBuildingFetching,
  } = useOldBuldingById(selectedBuildingId || 0, {
    skip: selectedBuildingId === 0,
  });

  const {
    data: newBuilding,
    isLoading: isNewBuildingLoading,
    isFetching: isNewBuildingFetching,
  } = useNewBuldingById(selectedPlotId || 0, {
    skip: selectedPlotId === 0,
  });

  const fitBounds = useCallback(() => {
    if (!map) return;

    if (selectedPlotId) {
      const bounds = new LatLngBounds(
        selectedNewBuilding?.[0]?.bounds?.coordinates?.[0] as LatLngTuple,
        selectedNewBuilding?.[0]?.bounds?.coordinates?.[3] as LatLngTuple,
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (selectedBuildingId) {
      const bounds = new LatLngBounds(
        selectedOldBuilding?.[0]?.bounds?.coordinates?.[0] as LatLngTuple,
        selectedOldBuilding?.[0]?.bounds?.coordinates?.[3] as LatLngTuple,
      );

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [
    map,
    selectedPlotId,
    selectedBuildingId,
    selectedNewBuilding,
    selectedOldBuilding,
  ]);

  useEffect(() => {
    const boundsTimer = setTimeout(() => {
      fitBounds();
    }, 200);
    return () => {
      clearTimeout(boundsTimer);
    };
  }, [fitBounds, isFetching, selectedOldBuilding, selectedNewBuilding]);

  const onEachNewFeature = useCallback(
    (feature: BuildingsGeoJSON['features'][0], layer: Layer) => {
      layer.bindTooltip(() => {
        return `<b>Площадка:</b></br>` + feature.properties?.adress || '';
      });

      layer.on({
        click: (e: LeafletEvent) => {
          navigate({
            search: (prev: RelocationMapPageSerch) => ({
              ...prev,
              selectedBuildingId: undefined,
              selectedPlotId: e.sourceTarget.feature.properties.id,
            }),
          });
        },
      });
    },
    [navigate],
  );

  const onEachOldFeature = useCallback(
    (feature: BuildingsGeoJSON['features'][0], layer: Layer) => {
      layer.bindTooltip(() => {
        return feature.properties?.adress || '';
      });

      layer.on({
        click: (e: LeafletEvent) => {
          navigate({
            search: (prev: RelocationMapPageSerch) => ({
              ...prev,
              selectedBuildingId: e.sourceTarget.feature.properties.id,
              selectedPlotId: undefined,
            }),
          });
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
            className={cn(
              'w-renovationsidebar h-full transition-all ease-in-out',
            )}
            expanded={expanded}
            setExpanded={(value) =>
              navigate({
                search: (prev: RelocationMapPageSerch) => ({
                  ...prev,
                  expanded: value,
                }),
              })
            }
            onCenter={() => fitBounds()}
          />
        )}
        {isNewBuildingLoading ||
        isNewBuildingFetching ||
        !selectedPlotId ? null : (
          <NewBuildingsCard
            building={newBuilding || null}
            mode="map"
            onClose={() =>
              navigate({ search: { selectedBuildingId: undefined } })
            }
            className={cn('h-full transition-all ease-in-out')}
            expanded={expanded}
            setExpanded={(value) =>
              navigate({
                search: (prev: RelocationMapPageSerch) => ({
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
        ref={setMap}
        whenReady={() => fitBounds()}
      >
        <Pane name="newBuildings" style={{ zIndex: 401 }}>
          {newBuildings && (
            <GeoJSON
              key="newBuildings"
              pane="newBuildings"
              data={newBuildings}
              onEachFeature={onEachNewFeature}
              style={(feature) =>
                feature?.properties.id === selectedPlotId
                  ? mapItemStyles['plotMovement']
                  : selectedOldBuilding &&
                      selectedOldBuilding
                        .filter((item) => item.type === 'movement')
                        .map((item) => item.id)
                        .includes(feature?.properties.id)
                    ? mapItemStyles['plotMovement']
                    : selectedOldBuilding &&
                        selectedOldBuilding
                          .filter((item) => item.type === 'construction')
                          .map((item) => item.id)
                          .includes(feature?.properties.id)
                      ? mapItemStyles['plotConstruction']
                      : mapItemStyles['plotUnselected']
              }
            />
          )}
        </Pane>
        <Pane name="oldBuildings" style={{ zIndex: 402 }}>
          {oldBuildings && (
            <GeoJSON
              key="oldBuildings"
              pane="oldBuildings"
              data={oldBuildings}
              onEachFeature={onEachOldFeature}
              style={(feature) =>
                feature?.properties.id === selectedBuildingId
                  ? mapItemStyles['buildingSelected']
                  : selectedOldBuilding &&
                      selectedOldBuilding
                        .filter((item) => item.type === 'other_on_plot')
                        .map((item) => item.id)
                        .includes(feature?.properties.id)
                    ? mapItemStyles['buildingOnPlot']
                    : selectedNewBuilding &&
                        selectedNewBuilding
                          .filter((item) => item.type === 'movement')
                          .map((item) => item.id)
                          .includes(feature?.properties.id)
                      ? mapItemStyles['buildingMoves']
                      : selectedNewBuilding &&
                          selectedNewBuilding
                            .filter((item) => item.type === 'construction')
                            .map((item) => item.id)
                            .includes(feature?.properties.id)
                        ? mapItemStyles['buildingToDemolish']
                        : mapItemStyles['buildingUnselected']
              }
            />
          )}
        </Pane>
        <Pane name="connections" style={{ zIndex: 403 }}>
          {selectedOldBuilding &&
            selectedOldBuilding.length > 0 &&
            selectedOldBuilding
              .filter((item) => item.start && item.finish)
              .map((item) => {
                return (
                  <MapCurve
                    pane="connections"
                    key={item.id + 'curve'}
                    start={item?.start.coordinates}
                    finish={item?.finish.coordinates}
                  />
                );
              })}
          {selectedNewBuilding &&
            selectedNewBuilding.length > 0 &&
            selectedNewBuilding
              .filter((item) => item.start && item.finish)
              .map((item) => {
                return (
                  <MapCurve
                    pane="connections"
                    variant="green"
                    key={item.id + 'curve'}
                    start={item?.start.coordinates}
                    finish={item?.finish.coordinates}
                  />
                );
              })}
        </Pane>
      </MapComponent>
    </div>
  );
};

export { BuildingRelocationMapPage };
