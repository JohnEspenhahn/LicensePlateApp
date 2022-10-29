import { Button, Divider } from "@rneui/themed";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles";
import { getCameraDimensions } from "./camera";
import ImageModalComponent from "./imagemodal";
import MapComponent from "./map";

export interface HistoryItem {
  base64Img: string;
  plate: string;
  coords: Location.LocationObjectCoords;
}

interface HistoryItemProps {
  id: string;
  item: HistoryItem;
  onAccept: (item: HistoryItem) => void;
}

function getItemDimensions() {
    const { width, height } = getCameraDimensions();

    return { 
        width: Math.round(width/2), 
        height: Math.round(height/2),
    };
}

export default function HistoryItemComponent(props: HistoryItemProps) {
  const { item } = props;
  const { height } = getItemDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  function openModal() {
    setModalVisible(true);
  }

  const padding = 20;

  const contentStyle: any = {
    flex: 1,
    alignItems: "center",
  };

  if (!item) {
    return null;
  }

  return (
    <View>
      <ImageModalComponent
        base64Img={item.base64Img}
        visible={modalVisible}
        close={() => setModalVisible(false)}
      />
      <Divider />
      <ScrollView
        horizontal={true}
        style={{
          flexDirection: "row",
        }}
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: "100%",
          padding: padding,
        }}
      >
        <TouchableOpacity
          style={{ ...contentStyle, height: "100%" }}
          onPress={openModal}
        >
          <Image
            style={{ height, resizeMode: "contain", aspectRatio: 1 }}
            source={{ uri: item.base64Img }}
          />
        </TouchableOpacity>
        <View style={{ ...contentStyle, marginHorizontal: padding }}>
          {item.plate === undefined ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text style={styles.text} numberOfLines={1}>
              {item.plate}
            </Text>
          )}
        </View>
        <MapComponent size={height} coords={item.coords} />
        <View style={{ ...contentStyle, marginHorizontal: padding }}>
          <Button
            title="Accept&nbsp;&raquo;"
            onPress={() => props.onAccept(item)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
