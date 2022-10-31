import * as Location from 'expo-location';
import React from 'react';
import { Image } from "react-native";
import { ENDPOINT } from '../config/config';


const getEndpoint = (latitude, longitude, size) => `${ENDPOINT}/map/${latitude}/${longitude}/${size}`;

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