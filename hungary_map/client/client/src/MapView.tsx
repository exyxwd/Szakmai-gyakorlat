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
         clusterLayer.current?.remove(); // Felesleges?
      }

      clusterLayer.current = L.markerClusterGroup();

      if (onlyTisza) {
         mapData.forEach((e) => {
            //L.circleMarker(L.latLng(v.Latitude, v.Longitude), { radius: 5, color: 'green' })
            if (e.NearbyRiver.includes('river_Tisza'))
               L.circleMarker(L.latLng(e.Latitude, e.Longitude), { radius: 10 })
                  .bindTooltip(`${e.Locality}`)
                  .addTo(clusterLayer.current!)
         });
      } else {
         mapData.forEach((e) => {
            L.circleMarker(L.latLng(e.Latitude, e.Longitude), { radius: 10 })
               .bindTooltip(`${e.Locality}`)
               .addTo(clusterLayer.current!)
         });
      }

      map.current.addLayer(clusterLayer.current);
   }, [mapData, onlyTisza]);

   useEffect(() => {
      const mapNode = ReactDOM.findDOMNode(document.getElementById('mapId')) as HTMLDivElement;
      if (!mapNode || map.current) {
         return;
      }
      map.current = L.map(mapNode, {doubleClickZoom: false}).setZoom(5).setView(L.latLng(47.1611615, 19.5057541));
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 18,
      }).addTo(map.current);
   }, []);

   return (
      <div style={{ width: '100%', height: '100%' }} id="mapId" >
         <button onClick={toggleTiszaGarbages}>
            <strong>{onlyTisza ? 'Mutass mindent!' : 'Csak a Tiszát!'}</strong>
         </button>
      </div>
   );
};

export default MapView;