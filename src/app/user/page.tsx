'use client';
import '@/app/global.css';
import { MAX_REQUEST } from '@/constants';
import { GrFormView } from 'react-icons/gr';
import { getUserRequestSummary } from '@/lib/serverActions/collectionRequest';
import { useSession } from 'next-auth/react';
import L, { ControlOptions, Map } from 'leaflet';
import { MapContainer, TileLayer, ZoomControl } from '@/components/MapComponents';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

export default function Request() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getUserRequestSummary>> | null>(
    null
  );
  const router = useRouter();
  const session = useSession();

  const mapRef = useRef<Map>(null);
  const routingRef = useRef<L.Routing.Control>(null);
  const [positions, setPosition] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }
    if (session.data)
      getUserRequestSummary(session.data.user.id).then(async (s) => {
        setSummary(s);
      });
  }, [session]);

  useEffect(() => {
    routingRef.current?.hide();
    routingRef.current?.setWaypoints(positions);
    const p = positions.pop();
    if (p) mapRef.current?.setView(L.latLng({ lat: p.lat, lng: p.lng }), 15);
  }, [positions]);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Collection Requests
      </h1>
      <div className='flex flex-row gap-2 justify-between w-full'>
        <div className='flex-grow w-1/3 p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800 font-semibold'>
          <span className='block text-slate-800'>Arriving</span>
          <span className='block text-xl font-normal'>{summary.dispatched}</span>
        </div>
        <div className='flex-grow w-1/3 p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800 font-semibold'>
          <span className='block text-slate-800'>Remaining</span>
          <span className='block text-xl font-normal'>{MAX_REQUEST - summary.total}</span>
        </div>
        <div className='flex-grow w-1/3 p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800 font-semibold'>
          <span className='block text-slate-800'>Total</span>
          <span className='block text-xl font-normal'>{summary.total}</span>
        </div>
      </div>
      <div className='w-full h-1/2 overflow-scroll'>
        <MapContainer
          ref={mapRef}
          touchZoom={false}
          zoomControl={false}
          center={{ lat: 26.791905896045343, lng: 87.29230341862062 }}
          zoom={17}
          style={{
            height: '100%',
            width: '100%',
            zIndex: '0!important',
          }}
          className='rounded-md'
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
            zIndex={0}
          />
          <ZoomControl position='topright' />
          <RoutingMachine ref={routingRef} />
        </MapContainer>
      </div>
      <div className='relative flex-grow w-full overflow-x-hidden'>
        <h1 className='m-auto font-semibold text-md py-2 mb-2'>Request History</h1>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-gray-700 border uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3 border'>
                Requested At
              </th>
              <th scope='col' className='px-6 py-3 border'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 border'>
                Route
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.requests.map((req) => (
              <tr className='border hover:bg-gray-50' key={req.id}>
                <th
                  scope='row'
                  className='border px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
                >
                  {req.createdAt.toDateString()}
                </th>
                <td className='px-6 py-4 border'>{req.status}</td>
                <td
                  className='px-6 py-4 cursor-pointer'
                  onClick={() => {
                    setPosition(
                      req.Route?.CollectionRequest.map((pos) =>
                        L.latLng(pos.latitude, pos.longitude)
                      ) || []
                    );
                  }}
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
