import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';
import { Map, Marker as LMarker, IconOptions } from 'leaflet';
import { MapContainerProps, MarkerProps } from 'react-leaflet';

export const LazyMapContainer = dynamic(
  () => import('./MapLazyComponents').then((m) => m.MapContainer),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  }
);

export const MapContainer = forwardRef<
  Map,
  MapContainerProps & { children: JSX.Element | JSX.Element[] }
>((props, ref) => <LazyMapContainer {...props} forwardedRef={ref} />);

export const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), {
  ssr: false,
});
export const ZoomControl = dynamic(() => import('react-leaflet').then((m) => m.ZoomControl), {
  ssr: false,
});

const LazyMarker = dynamic(() => import('./MapLazyComponents').then((m) => m.Marker), {
  ssr: false,
});
export const Marker = forwardRef<
  LMarker,
  {
    iconProps: IconOptions;
  } & MarkerProps
>((props) => <LazyMarker {...props} />);

export const MapConsumer = dynamic(() => import('./MapLazyComponents').then((m) => m.MapConsumer), {
  ssr: false,
});
