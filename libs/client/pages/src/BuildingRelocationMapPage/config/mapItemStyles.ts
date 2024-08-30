import { StyleFunction } from 'leaflet';

export const mapItemStyles = {
  buildingUnselected: {
    color: '#a8a29e',
    fillColor: '#d6d3d1',
    opacity: 1,
    fillOpacity: 1,
    weight: 1,
  },
  buildingOnPlot: {
    color: '#fbbf24',
    fillColor: '#fed7aa',
    opacity: 1,
    fillOpacity: 1,
    weight: 1,
  },
  buildingSelected: {
    color: '#f87171',
    fillColor: '#fecaca',
    opacity: 1,
    fillOpacity: 1,
    weight: 1,
  },
  plotUnselected: {
    fillOpacity: 0.1,
    color: '#334155',
    opacity: 0.3,
    dashArray: '3',
    weight: 1,
  },
  plotMovement: {
    fillOpacity: 0.3,
    color: '#0284c7',
    dashArray: '3',
    weight: 1,
    opacity: 1,
  },
  plotConstruction: {
    fillOpacity: 0.2,
    color: '#334155',
    dashArray: '3',
    weight: 1,
    opacity: 1,
  },
} as Record<string, ReturnType<StyleFunction>>;
