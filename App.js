import { View, Text, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import CameraComponent from './component/camera';
import styles from './styles';

export default function App() {
  const [history, setHistory] = useState([]);
  const { height } = useWindowDimensions();

  function onDetected(base64Img, plate) {
    console.log("On detect: " + plate);

    setHistory((prev) => {
      return [
        {
          base64Img,
          plate,
        },
        ...prev,
      ];
    })
  }

  function historyItem(item, idx) {
    return (
      <View key={idx} style={{ height: 200 }}>
        <Image style={{flex: 1, width: undefined, height: undefined, resizeMode: 'contain' }} source={item.base64Img} />
      </View>
    );
  }

  return (
    <View style={{
      alignItems: 'stretch',
      height,
    }}>
      <CameraComponent onDetected={onDetected} />
      <ScrollView>
        {history.map(historyItem)}
      </ScrollView>
    </View>
  );
}
