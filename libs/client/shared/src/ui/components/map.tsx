import React, { forwardRef } from 'react';
import { MapContainer, MapContainerProps, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'leaflet';
import { Skeleton } from './skeleton';
import { cn } from '../../lib/cn';

const basemapDict = {
  carto: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

type MapProps = MapContainerProps & {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  isLoading?: boolean;
};

export const OldBuildingRelocationMap = forwardRef<Map, MapProps>(
  (
    {
      className,
      children,
      style,
      isLoading = false,
      center = [55.755864, 37.617698],
      zoom = 11,
      scrollWheelZoom = false,
      ...mapProps
    }: MapProps,
    ref,
  ) => {
    return isLoading ? (
      <Skeleton className={cn(className)} style={style} />
    ) : (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        attributionControl={false}
        className={cn('isolate', className)}
        style={style}
        ref={ref}
        {...mapProps}
      >
        <TileLayer url={basemapDict['carto']} className="-z-50" />
        {children}
      </MapContainer>
    );
  },
);
