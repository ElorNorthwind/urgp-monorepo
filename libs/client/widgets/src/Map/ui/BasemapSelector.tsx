import { cn } from '@urgp/shared/util';
import React, { memo } from 'react';

import 'leaflet/dist/leaflet.css';
import {
  Combobox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@urgp/shared/ui';
import { basemapDict } from './Map';

type BasemapSelectorProps = {
  basemap?: keyof typeof basemapDict;
  onBasemapChange?: (value: keyof typeof basemapDict) => void;
  className?: string;
};

export const BasemapSelector: React.FC<BasemapSelectorProps> = memo(
  ({
    basemap = Object.keys(basemapDict)[0] as keyof typeof basemapDict,
    onBasemapChange = (e: string) => {
      console.log(e);
    },
    className,
  }: BasemapSelectorProps) => {
    return (
      <Select onValueChange={onBasemapChange} value={basemap}>
        <SelectTrigger className={cn(className)}>
          <SelectValue placeholder="Подложка" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(basemapDict).map((key) => {
            return <SelectItem value={key}>{key}</SelectItem>;
          })}
        </SelectContent>
      </Select>

      //   <Combobox
      //     className={cn(className)}
      //     value={basemap}
      //     onSelect={onBasemapChange as (value: string) => void}
      //     items={Object.keys(basemapDict).map((key) => ({
      //       value: key,
      //       label: key,
      //     }))}
      //   />
    );
  },
);
