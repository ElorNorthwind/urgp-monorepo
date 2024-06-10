import { curve, CurveOptions } from 'leaflet';
import '@elfalem/leaflet-curve';
import { CurvePathDataElement } from '@elfalem/leaflet-curve';

export function createCurve(
  start: L.LatLngTuple,
  end: L.LatLngTuple,
  pathOptions?: CurveOptions,
) {
  const offsetX = end[1] - start[1];
  const offsetY = end[0] - start[0];
  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
  const theta = Math.atan2(offsetY, offsetX);

  const thetaOffset = 3.14 / Math.max(offsetX, offsetY);

  const r2 = r / 2 / Math.cos(thetaOffset);
  const theta2 = theta + thetaOffset;
  const midpointX = r2 * Math.cos(theta2) + start[1];
  const midpointY = r2 * Math.sin(theta2) + start[0];

  const midpointLatLng = [midpointY, midpointX];

  return curve(
    [
      'M',
      start as CurvePathDataElement,
      'Q',
      midpointLatLng as CurvePathDataElement,
      end as CurvePathDataElement,
    ],
    pathOptions as CurveOptions,
  );
}
