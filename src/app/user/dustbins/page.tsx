'use client';
import '@/app/global.css';
import { useEffect, useRef, useState } from 'react';
import L, { ControlOptions, Map } from 'leaflet';
import { MapContainer, TileLayer, Marker, ZoomControl } from '@/components/MapComponents';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import dustbins from '@/_mock/dustbins';

const createRoutineMachineLayer = (_props: ControlOptions) => {
  const instance = L.Routing.control({
    waypoints: [],
    lineOptions: {
      styles: [{ color: '#6FA1EC', weight: 4 }],
      missingRouteTolerance: 0,
      extendToWaypoints: true,
    },
    waypointMode: 'snap',
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    fitSelectedRoutes: false,
    showAlternatives: true,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default function DustBins() {
  const mapRef = useRef<Map>(null);
  const routingRef = useRef<L.Routing.Control>(null);

  const [currentLoc, setCurrentLoc] = useState({ fetched: false, lat: 0, lng: 0 });

  useEffect(() => {
    routingRef.current?.hide();
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      setCurrentLoc({ fetched: true, lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Public Dustbins
      </h1>
      <MapContainer
        ref={mapRef}
        touchZoom={false}
        zoomControl={false}
        center={{ lat: 26.791905896045343, lng: 87.29230341862062 }}
        zoom={17}
        style={{ zIndex: '0!important' }}
        className='rounded-md h-[calc(100%-2.5rem)] w-full'
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
          zIndex={0}
        />
        <ZoomControl position='topright' />
        <RoutingMachine ref={routingRef} />
        <>
          {dustbins.map((d, idx) => {
            return (
              <Marker
                key={idx}
                position={d}
                eventHandlers={{
                  click: (e) => {
                    if (currentLoc.fetched) {
                      routingRef.current?.setWaypoints([
                        L.latLng(currentLoc.lat, currentLoc.lng),
                        e.latlng,
                      ]);
                    }
                  },
                }}
                iconProps={{
                  iconUrl: '/assets/bin.png',
                  iconAnchor: [16, 32],
                  iconSize: [32, 32],
                }}
              />
            );
          })}
        </>
        <>
          {currentLoc.fetched && (
            <Marker
              iconProps={{ iconUrl: '/assets/pin.png', iconAnchor: [16, 32], iconSize: [32, 32] }}
              position={[currentLoc.lat, currentLoc.lng]}
            />
          )}
        </>
      </MapContainer>
    </div>
  );
}
