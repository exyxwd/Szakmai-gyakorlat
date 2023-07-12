import React from 'react';
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 47.49801,
  lng: 19.03991,
};

export default function GoogleMaps() {
  const { isLoaded, loadError } = useLoadScript({
    // Uncomment the line below and add your API key
    // googleMapsApiKey: 'AIzaSyDWKys81k3doAJdA7VhUFbSWxhSRxlKwfA',
  });

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
    >
      <Marker
        position={center}
        title="Budapest"
        label="B"
      />
    </GoogleMap>
  );
}
