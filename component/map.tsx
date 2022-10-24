import * as Location from 'expo-location';
import React from 'react';
import { Image } from "react-native";

const KEY = "AIzaSyD1QJBmygSIwZNApDiAHDGvnLrouEcLEyc";
const getEndpoint = (lat, lng, size) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&markers=color:blue%7C${lat},${lng}&size=${size}x${size}&key=${KEY}`;

interface MapComponentProps {
    size: number;
    coords: Location.LocationObjectCoords;
}

export default function MapComponent(props: MapComponentProps) {
    const endpoint = getEndpoint(props.coords.latitude, props.coords.longitude, props.size);

    return (
        <Image
            style={{ flex: 1, width: undefined, height: props.size, resizeMode: "contain" }}
            source={{ uri: endpoint }}
          />
    )
}