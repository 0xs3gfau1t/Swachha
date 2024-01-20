import '@/app/global.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GrFormView } from 'react-icons/gr';
import L, { ControlOptions, LeafletEventHandlerFnMap, Map } from 'leaflet';
import { MapConsumer, MapContainer, TileLayer, ZoomControl } from '@/components/MapComponents';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { CollectionRequest } from '@prisma/client';
import {
  DispatchRoute,
  addRequest,
  getAllRequest,
  getDispatchedRoutes,
} from '@/lib/serverActions/collectionRequest';

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
      <MapContainer
        ref={mapRef}
        touchZoom={false}
        zoomControl={false}
        center={{ lat: 26.791905896045343, lng: 87.29230341862062 }}
        zoom={17}
        style={{ height: '75%', width: '100%', zIndex: '0!important' }}
        className='rounded-md'
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
      <div className='w-full p-2 flex flex-row-reverse items-center gap-2'>
        <button
          className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-b border-gray-400 rounded shadow'
          onClick={() => {
            DispatchRoute(positions.map((position) => position.id)).then((data) => {
              setPositions([]);
              setRoutes((o) => [
                ...o,
                {
                  createdAt: data.createdAt,
                  id: data.id,
                  status: data.status,
                  CollectionRequest: positions,
                },
              ]);
            });
          }}
        >
          Dispatch
        </button>
        <button
          className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-b border-gray-400 rounded shadow'
          onClick={() => {
            getAllRequest().then((data) => {
              setPositions(data);
            });
          }}
        >
          Reload
        </button>
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-t-sm'>
        <table className='w-full text-sm text-left rtl:text-right'>
          <thead className='text-xs text-gray-700 uppercase'>
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
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr className='bg-white border-b hover:bg-gray-50'>
                <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                  {route.createdAt.toISOString()}
                </th>
                <td className='px-6 py-4'>{route.CollectionRequest.length}</td>
                <td className='px-6 py-4'>{route.status}</td>
                <td
                  className='px-6 py-4 cursor-pointer'
                  onClick={() => setPositions(route.CollectionRequest)}
                >
                  <button className='w-full h-full flex flex-row'>
                    <GrFormView className='text-lg' />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
