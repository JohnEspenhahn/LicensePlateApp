import { Button, Divider } from "@rneui/themed";
import * as Location from 'expo-location';
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import styles from "../styles";
import MapComponent from "./map";

interface HistoryItem {
  base64Img: string;
  plate: string;
  coords: Location.LocationObjectCoords;
}

interface HistoryComponentProps {
  history: HistoryItem[];
  acceptItem: (item: HistoryItem, idx: number) => void;
}

export default function HistoryComponent(props: HistoryComponentProps) {
  function historyItem(item: HistoryItem, idx: number) {
    const height = 200;
    const contentStyle: any = {
        flex: 1,
        alignItems: "center",
    };

    return (
      <View key={idx}>
        <Divider />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{ flex: 1, width: undefined, height, resizeMode: "contain", transform: [{ rotateY: "180deg" }] }}
            source={{ uri: item.base64Img }}
          />
          <View style={contentStyle}>
            <Text style={styles.text}>{item.plate}</Text>
          </View>
          <MapComponent size={height} coords={item.coords} />
          <View style={contentStyle}>
            <Button title="Accept &raquo;" onPress={() => props.acceptItem(item, idx)} />
          </View>
        </View>
      </View>
    );
  }

  return <ScrollView>{props.history.map(historyItem)}</ScrollView>;
}
