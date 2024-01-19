import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapConsumer,
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
} from '@/components/MapComponents';
import { LeafletEventHandlerFnMap, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { CollectionRequest } from '@prisma/client';
import { addRequest, getRequests } from '@/lib/serverActions/collectionRequest';

export default function MyMap() {
  const [positions, setPositions] = useState<CollectionRequest[]>([]);
  const [bounds, setBounds] = useState<{
    from: { lat: number; lng: number };
    to: { lat: number; lng: number };
  }>();

  const mapRef = useRef<Map>(null);

  const mapHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({
      click(e) {
        mapRef.current?.setView([e.latlng.lat, e.latlng.lng]);
        addRequest(e.latlng.lat, e.latlng.lng);
      },
      moveend() {
        const bounds = mapRef.current?.getBounds();
        const ne = bounds?.getNorthEast();
        const sw = bounds?.getSouthWest();

        if (!ne || !sw) return;

        const from = { lat: Math.max(ne?.lat, sw?.lat), lng: Math.max(ne.lng, sw.lng) };
        const to = { lat: Math.min(ne.lat, sw.lat), lng: Math.min(ne.lng, sw.lng) };
        setBounds({ from, to });
      },
    }),
    []
  );

  useEffect(() => {
    const bounds = mapRef.current?.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();

    if (!ne || !sw) return;

    const to = { lat: Math.max(ne?.lat, sw?.lat), lng: Math.max(ne.lng, sw.lng) };
    const from = { lat: Math.min(ne.lat, sw.lat), lng: Math.min(ne.lng, sw.lng) };
    setBounds({ from, to });
  }, []);

  useEffect(() => {
    if (!bounds) return;
    getRequests(bounds.from, bounds.to).then((data) => {
      setPositions(data);
    });
  }, [bounds]);

  return (
    <MapContainer
      ref={mapRef}
      touchZoom={false}
      zoomControl={false}
      center={{ lat: 26.791905896045343, lng: 87.29230341862062 }}
      zoom={17}
      style={{ height: '400px', width: '100%', zIndex: '0!important' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
        zIndex={0}
        style={{ zIndex: '0!important' }}
      />
      <ZoomControl position='topright' />
      <MapConsumer eventsHandler={mapHandlers} />
      <>
        {positions.map((position) => (
          <Marker
            position={{ lat: position.latitude, lng: position.longitude }}
            iconProps={{ iconUrl: '/assets/pin.png' }}
          ></Marker>
        ))}
      </>
    </MapContainer>
  );
}
