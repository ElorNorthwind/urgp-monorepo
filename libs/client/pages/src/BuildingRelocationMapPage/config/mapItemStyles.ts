import { StyleFunction } from 'leaflet';

export const mapItemStyles = {
  buildingUnselected: {
    color: '#854d0e',
    opacity: 0.3,
    zIndex: 10,
    weight: 1,
    fillOpacity: 0.3,
  },
  buildingOnPlot: {
    color: '#f59e0b',
    opacity: 1,
    zIndex: 10,
    weight: 1,
    fillOpacity: 0.4,
  },
  buildingSelected: {
    color: '#dc2626',
    opacity: 1,
    zIndex: 10,
    weight: 1,
    fillOpacity: 0.4,
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
    fillOpacity: 0.3,
    color: '#f59e0b',
    dashArray: '3',
    weight: 1,
    opacity: 1,
    zIndex: -1,
  },
} as Record<string, ReturnType<StyleFunction>>;
