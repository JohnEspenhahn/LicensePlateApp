import { ThemeProvider } from '@rneui/themed';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import CameraComponent from './component/camera';
import HamburgerComponent from './component/hamburger';
import HistoryComponent from './component/history';

export default function App() {
  const [history, setHistory] = useState([]);
  const [captures, setCaptures] = useState({});
  const { height } = useWindowDimensions();

  function onDetect(base64Img, coords) {
    const id = uuid.v4();

    setCaptures(prev => {
      return {
        ...prev,
        [id]: {
          base64Img,
          coords,
          plate: undefined,
        },
      };
    });

    setHistory(prev => {
      return [
        id,
        ...prev,
      ];
    });

    return id;
  }

  function onDetected(id, plate) {
    console.log("onDetected: " + id + " " + plate);

    setCaptures(prev => {
      const capture = prev[id];
      if (capture) {
        prev = {
          ...prev,
          [id]: {
            ...capture,
            plate,
          },
        };
      }

      return prev;
    })
  }

  function onAccept(item) {
    setHistory((prev) => {
      return prev.filter(value => value !== item);
    });
  }

  console.log("Starting...");

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ height }}>
          <HamburgerComponent />
          <CameraComponent onDetect={onDetect} onDetected={onDetected} />
          <HistoryComponent history={history} captures={captures} onAccept={onAccept} />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
