import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { IconOptions } from "leaflet";
import markerIcon from "../images/marker_icon.jpg"

// Budapest coords for centering the map
const budapestLatLng: L.LatLngExpression = [47.4979, 19.0402];

// Marker coords
const markerCoords: L.LatLngExpression[] = [
   [47.4979, 19.0402],
   [47.4979, 19.0403],
   [47.498, 19.0402],
];

const Map: React.FC = () => {
   const [zoom, setZoom] = useState<number>(7);
   const [markersVisible, setMarkersVisible] = useState<boolean>(true);

   useEffect(() => {
      const onZoomChange = (event: L.LeafletEvent) => {
         const newZoom = event.target.getZoom();
         // Prevent zooming in too much
         if (newZoom <= 18) setZoom(newZoom);
         setMarkersVisible(newZoom >= 7);
      };

      const map = L.map("map").setView(budapestLatLng, 7);
      map.on("zoomend", onZoomChange);

      return () => {
         map.off("zoomend", onZoomChange);
         map.remove();
      };
   }, []);

   // Marker icon parameters
   const iconSettings: IconOptions = {
      iconUrl: markerIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
   };
   const customIcon = new L.Icon(iconSettings);

   // Zoom in/out on button click 
   const ChangeMapView = () => {
      const map = useMap();

      // Transition on zoom change
      useEffect(() => {
         map.flyTo(budapestLatLng, zoom, {
            duration: 1,
            easeLinearity: 0.5,
         });
      }, [map, zoom]);

      return null;
   };

   return (
      <div id="map" style={{ height: "500px", width: "100%" }}>
         <MapContainer center={budapestLatLng} zoom={7} style={{ height: "100%", width: "100%" }}>
            <ChangeMapView />
            <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markersVisible &&
               markerCoords.map((markerLatLng, index) => (
                  <Marker key={index} position={markerLatLng} icon={customIcon}>
                     <Popup>Marker {index + 1}</Popup>
                  </Marker>
               ))}
         </MapContainer>
      </div>
   );
};

export default Map;