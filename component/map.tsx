import * as Location from 'expo-location';
import React from 'react';
import { Image } from "react-native";


const getEndpoint = (latitude, longitude, size) => `https://mosak1d405.execute-api.us-east-1.amazonaws.com/alpha/map/${latitude}/${longitude}/${size}`;

interface MapComponentProps {
    size: number;
    coords: Location.LocationObjectCoords;
}

export default function MapComponent(props: MapComponentProps) {
    const endpoint = getEndpoint(props.coords.latitude, props.coords.longitude, props.size);

    console.log("Map component size: " + props.size);

    return (
        <Image
            style={{ flex: 1, width: props.size, height: props.size, resizeMode: "contain" }}
            source={{ uri: endpoint }}
          />
    );
}