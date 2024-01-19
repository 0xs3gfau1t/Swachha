import '@/app/global.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapConsumer,
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
} from '@/components/MapComponents';
import L, { ControlOptions } from 'leaflet';
import { LeafletEventHandlerFnMap, Map } from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { CollectionRequest, Routes } from '@prisma/client';
import {
  addRequest,
  getAllRequest,
  getDispatchedRoutes,
} from '@/lib/serverActions/collectionRequest';
import { Awaitable } from 'next-auth';

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

export default function MyMap() {
  const [positions, setPositions] = useState<CollectionRequest[]>([]);
  const [routes, setRoutes] = useState<Awaited<ReturnType<typeof getDispatchedRoutes>>>([]);
  const mapRef = useRef<Map>(null);
  const routingRef = useRef<L.Routing.Control>(null);

  const mapHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({
      click(e) {
        mapRef.current?.setView([e.latlng.lat, e.latlng.lng]);
        addRequest(e.latlng.lat, e.latlng.lng);
      },
    }),
    []
  );

  useEffect(() => {
    routingRef.current?.hide();
    getAllRequest().then((data) => {
      setPositions(data);
    });
    getDispatchedRoutes().then((data) => {
      setRoutes(data);
    });
  }, []);

  useEffect(() => {
    routingRef.current?.setWaypoints(
      positions.map((position) => ({
        latLng: L.latLng(position.latitude, position.longitude),
      }))
    );
  }, [positions]);

  return (
    <div className='w-full h-full overflow-scroll'>
      <div className='w-full p-2 flex flex-col items-center'>
        <button className='bg-white ml-auto hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-b border-gray-400 rounded shadow'>
          Dispatch
        </button>
      </div>
      <MapContainer
        ref={mapRef}
        touchZoom={false}
        zoomControl={false}
        center={{ lat: 26.791905896045343, lng: 87.29230341862062 }}
        zoom={17}
        style={{ height: '75%', width: '100%', zIndex: '0!important' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; OpenStreetMap contributors'
          zIndex={0}
        />
        <ZoomControl position='topright' />
        <MapConsumer eventsHandler={mapHandlers} />
        <RoutingMachine ref={routingRef} />
      </MapContainer>
      <div className=''>
        <div className='relative overflow-x-auto shadow-md sm:rounded-t-sm'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Created At
                </th>
                <th scope='col' className='px-6 py-3'>
                  Points
                </th>
                <th scope='col' className='px-6 py-3'>
                  Status
                </th>
                <th scope='col' className='px-6 py-3'>
                  <span>View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.map((routes) => (
                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {routes.createdAt.toISOString()}
                  </th>
                  <td className='px-6 py-4'>{routes._count.requests}</td>
                  <td className='px-6 py-4'>{routes.status}</td>
                  <td className='px-6 py-4 text-right'>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
