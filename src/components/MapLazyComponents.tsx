import {
  MapOptions,
  Map as LMap,
  Icon as LIcon,
  IconOptions,
  Marker as LMarker,
  LeafletEventHandlerFnMap,
} from 'leaflet';
import React from 'react';
import { MapContainer as LMapContainer, Marker as RLMarker, MarkerProps } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet/hooks';

export const MapContainer: React.FC<
  {
    forwardedRef: React.Ref<LMap>;
    children: JSX.Element | JSX.Element[];
  } & MapOptions
> = ({ forwardedRef, ...props }) => <LMapContainer {...props} ref={forwardedRef} />;

export const Marker: React.FC<
  {
    iconProps: IconOptions;
  } & MarkerProps
> = ({ iconProps, ...props }) => {
  const [icon, setIcon] = useState<LIcon>();

  useEffect(() => {
    const loadIcon = async () => {
      const L = await import('leaflet');
      setIcon(L.icon(iconProps));
    };
    loadIcon();
  }, [iconProps]);

  // waiting for icon to be loaded before rendering
  return !!iconProps && !icon ? null : <RLMarker {...props} icon={icon} />;
};

export const MapConsumer = ({ eventsHandler }: { eventsHandler: LeafletEventHandlerFnMap }) => {
  useMapEvents(eventsHandler);
  return null;
};
