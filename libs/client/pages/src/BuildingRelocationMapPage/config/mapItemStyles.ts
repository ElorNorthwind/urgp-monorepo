import { StyleFunction } from 'leaflet';

export const mapItemStyles = {
  buildingUnselected: {
    color: '#a8a29e',
    fillColor: '#d6d3d1',
    opacity: 1,
    fillOpacity: 1,
    zIndex: 10,
    weight: 1,
  },
  buildingOnPlot: {
    color: '#fbbf24',
    fillColor: '#fed7aa',
    opacity: 1,
    fillOpacity: 1,
    zIndex: 10,
    weight: 1,
  },
  buildingSelected: {
    color: '#f87171',
    fillColor: '#fecaca',
    opacity: 1,
    fillOpacity: 1,
    zIndex: 10,
    weight: 1,
  },
  plotUnselected: {
    fillOpacity: 0.1,
    color: '#334155',
    opacity: 0.3,
    zIndex: -1,
    dashArray: '3',
    weight: 1,
  },
  plotMovement: {
    fillOpacity: 0.3,
    color: '#0284c7',
    dashArray: '3',
    weight: 1,
    opacity: 1,
    zIndex: -1,
  },
  plotConstruction: {
    fillOpacity: 0.2,
    color: '#fbbf24',
    dashArray: '3',
    weight: 1,
    opacity: 1,
    zIndex: -1,
  },
} as Record<string, ReturnType<StyleFunction>>;
