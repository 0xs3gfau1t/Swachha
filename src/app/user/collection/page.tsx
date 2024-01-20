'use client';
import '@/app/global.css';
import { MAX_REQUEST } from '@/constants';
import { GrFormView } from 'react-icons/gr';
import { addRequest, getUserRequestSummary } from '@/lib/serverActions/collectionRequest';
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
import { MapConsumer, Marker } from '@/components/MapLazyComponents';

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
  const [currentLoc, setCurrentLoc] = useState({ fetched: false, lat: 0, lng: 0 });
  const [activeRoute, setActiveRoute] =
    useState<Awaited<ReturnType<typeof getUserRequestSummary>>['requests'][number]['Route']>(null);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }
    if (session.data) getUserRequestSummary(session.data.user.id).then(setSummary);
  }, [session]);

  useEffect(() => {
    routingRef.current?.hide();
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLoc({ fetched: true, lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    if (!activeRoute) return;
    routingRef.current?.hide();
    routingRef.current?.setWaypoints(
      activeRoute.CollectionRequest.map((c) => new L.LatLng(c.latitude, c.longitude))
    );
  }, [activeRoute]);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className='flex flex-col justify-between items-center gap-4 w-full h-full bg-gray-50 px-2'>
      <h1 className='w-full font-mono font-semibold text-2xl h-16 border-b py-2 flex justify-center items-center'>
        Collection Requests
      </h1>
      <div className='flex flex-row gap-2 justify-between w-full'>
        <div className='flex-grow w-full p-2 border border-gray-200 rounded-lg shadow flex flex-col justify-around gap-2 text-slate-800'>
          <h1 className='text-xl font-semibold'>Summary</h1>
          <div>
            <span className='block text-slate-800 py-2'>
              Used <span className='font-bold'>{summary.total}</span> out of{' '}
              <span className='font-bold'>{MAX_REQUEST}</span> requests
            </span>
            <div className='w-full h-1 relative bg-gray-200'>
              <div
                className='h-1/2 absolute left-0 bg-green-700'
                style={{ width: `${(summary.total / MAX_REQUEST) * 100}%` }}
              ></div>
            </div>
            <div>
              <span className='block text-slate-800 py-2'>
                Dispatched <span className='font-bold'>{summary.dispatched}</span> out of{' '}
                <span className='font-bold'>{summary.total}</span> requests
              </span>
              <div className='w-full h-1 relative bg-gray-200'>
                <div
                  className='h-1/2 absolute left-0 bg-green-700'
                  style={{ width: `${(summary.dispatched / summary.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className='w-full flex justify-end'>
              <button
                className='shadown-md border-2 rounded-lg px-2 py-1 my-1 cursor-pointer'
                onClick={() => {
                  if (currentLoc.fetched)
                    addRequest(currentLoc.lat, currentLoc.lng).then(() => {
                      getUserRequestSummary(session.data!.user.id).then(setSummary);
                    });
                  else alert('Current location not fetched');
                }}
              >
                Request
              </button>
            </div>
          </div>
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
            url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            attribution='&copy; OpenStreetMap contributors'
            zIndex={0}
          />
          <>
            {summary.requests.map((req) => {
              return (
                <Marker
                  key={req.id}
                  iconProps={{
                    iconUrl: '/assets/pin.png',
                    iconAnchor: [16, 32],
                    iconSize: [32, 32],
                  }}
                  position={{
                    lat: req.latitude,
                    lng: req.longitude,
                  }}
                />
              );
            })}
          </>
          {!!activeRoute?.busLatitude && !!activeRoute.busLongitude ? (
            <>
              <Marker
                position={{ lat: activeRoute.busLatitude, lng: activeRoute.busLongitude }}
                iconProps={{
                  iconUrl: '/assets/truck.png',
                  iconAnchor: [16, 32],
                  iconSize: [32, 32],
                }}
              />
            </>
          ) : (
            <></>
          )}
          <MapConsumer
            eventsHandler={{
              click: (e) => {
                setCurrentLoc({ fetched: true, lat: e.latlng.lat, lng: e.latlng.lng });
              },
            }}
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
                    setActiveRoute(req.Route);
                    if (req.Route?.busLatitude && req.Route.busLongitude)
                      mapRef.current?.flyTo({
                        lat: req.Route.busLatitude,
                        lng: req.Route.busLongitude,
                      });
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
