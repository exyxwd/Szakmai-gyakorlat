import ReactDOM from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import './MapView.css'


interface TrashData {
   Id: number;
   DeletedFl: boolean;
   Latitude: number;
   Longitude: number;
   Country: string;
   Locality: string;
   SubLocality: string;
   UpdateTime: string;
   UpdateNeeded: boolean;
   Note: string;
   Url: string;
   Status: string;
   Size: string;
   Anonymous: boolean;
   Created: string;
   Image: string;
   Types: string[];
   Accessibility: any[];
   NearbyRiver: string[];
}

interface MapViewProps {
   garbages: TrashData[];
}

const MapView: React.FC<MapViewProps> = ({ garbages }) => {
   const map = useRef<L.Map>();
   const clusterLayer = useRef<L.MarkerClusterGroup>();

   const [mapData, setMapData] = useState<TrashData[]>([]);
   const [onlyTisza, setOnlyTisza] = useState<boolean>(true);
   const [currentZoom, setCurrentZoom] = useState<number>(5);

   const toggleTiszaGarbages = () => {
      setOnlyTisza((prevState) => !prevState);
   };

   useEffect(() => {
      setMapData(garbages);
   }, [garbages]);

   useEffect(() => {
      clusterLayer.current?.remove();

      if (!map.current) {
         return;
      }

      if (clusterLayer && clusterLayer.current) {
         map.current.removeLayer(clusterLayer.current);
      }

      clusterLayer.current = L.markerClusterGroup({
         disableClusteringAtZoom: 17
      });

      mapData.forEach((e) => {
         if (!onlyTisza || e.NearbyRiver.includes('river_Tisza')) {
            let markerIcon: L.Icon;
            if (e.Status === 'status_stillHere') {
               markerIcon = L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                });
            } else {
               markerIcon = L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                });
            }

            const marker = L.marker(L.latLng(e.Latitude, e.Longitude), { icon: markerIcon }).addTo(clusterLayer.current!);
            marker.on('mouseover', () => {
               marker.bindTooltip(
                  `Hely: ${e.Locality}<br/>
                  <i>${e.Status === 'status_stillHere' ? 'Nincs még feltakarítva' : 'Már fel lett takarítva'}</i><br/>
                  Megjegyzés: ${e.Note ? e.Note : 'Nincs megjegyzés'}
                  `, {
                  direction: 'bottom',
                  opacity: 0.9,
               }).openTooltip();
            });

            marker.bindPopup(`
              <div>
                <img src="${e.Image}" alt="Garbage Image" style="max-width: 150px; max-height: 150px;">
              </div>
            `);

            marker.on('click', (event) => {
               const popup = event.target.getPopup();
               if (popup) {
                  popup.openPopup();
               }
            });
         }
      });

      map.current.addLayer(clusterLayer.current);
   }, [mapData, onlyTisza]);

   useEffect(() => {
      const mapNode = ReactDOM.findDOMNode(document.getElementById('mapId')) as HTMLDivElement;
      if (!mapNode || map.current) {
         return;
      }
      map.current = L.map(mapNode, { doubleClickZoom: false }).setZoom(5).setView(L.latLng(47.1611615, 19.5057541));
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
      }).addTo(map.current);

      const divIcon = L.divIcon({
         className: 'zoom-level-icon',
         html: `Zoom: ${currentZoom}`,
         iconSize: [100, 20],
      });

      const newyorkMarker = L.marker(L.latLng(40.7128, -74.0060), {
         icon: divIcon,
      }).addTo(map.current!);
      newyorkMarker.bindTooltip('New York', { direction: 'top' });

      map.current.on('zoomend', () => {
         const updatedZoom = map.current!.getZoom();
         setCurrentZoom(updatedZoom);
         const updatedDivIcon = L.divIcon({
            className: 'zoom-level-icon',
            html: `Zoom: ${updatedZoom}`,
            iconSize: [100, 20],
         });
         newyorkMarker.setIcon(updatedDivIcon);
         newyorkMarker.setTooltipContent(`New York - Zoom level: ${updatedZoom}`);
      });
   }, [currentZoom]);

   return (
      <div style={{ width: '100%', height: '100%' }} id="mapId" >
         <button onClick={toggleTiszaGarbages}>
            <strong>{onlyTisza ? 'Mutass mindent!' : 'Mutasd a Tiszát!'}</strong>
         </button>
         <div className='zoom-level'>{currentZoom} 🔍</div>
      </div>
   );
};

export default MapView;