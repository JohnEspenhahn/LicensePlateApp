import { ThemeProvider } from '@rneui/themed';
import { useState } from 'react';
import { Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraComponent from './component/camera';
import HamburgerComponent from './component/hamburger';
import HistoryComponent from './component/history';
import styles from './styles';

export default function App() {
  const [history, setHistory] = useState([]);
  const { height } = useWindowDimensions();

  function onDetected(base64Img, plate, coords) {
    console.log("On detect: " + plate);

    setHistory((prev) => {
      return [
        {
          base64Img,
          plate,
          coords,
        },
        ...prev,
      ];
    });
  }

  function acceptItem(item, idx) {
    setHistory((prev) => {
      return prev.filter(value => value !== item);
    });
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ height }}>
          <HamburgerComponent />
          <CameraComponent onDetected={onDetected} />
          <HistoryComponent history={history} acceptItem={acceptItem} />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
