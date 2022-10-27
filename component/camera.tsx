import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import SageMakerRuntime from '../adapter/sagemaker_adapater';
import styles from '../styles';


const sageMaker = new SageMakerRuntime();

interface CameraComponentProps {
  onDetected?: (base64Img: String, plate: string, coords: Location.LocationObjectCoords) => void;
}

export default function CameraComponent(props: CameraComponentProps) {
  const [ready, setReady] = useState(false);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [running, setRunning] = useState(false);
  const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions();

  let { width, height } = useWindowDimensions();
  width = Math.min(Math.floor(height*(3/4)), width);
  height = Math.floor(width * (3/4));

  async function requestAllPermissions() {
    await requestCameraPermission();
    await requestLocationPermission();
  }

  if (!cameraPermission) {
    // still loading
    return <View />;
  }

  if (!cameraPermission.granted || !locationStatus?.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to camera and location</Text>
        <Button onPress={requestAllPermissions} title="grant permission" />
      </View>
    );
  }

  let camera;
  async function captureImage() {
    if (!camera) {
      return;
    }

    setRunning(true);

    try {
      const currentPositionPromise = Location.getCurrentPositionAsync();
      const photo = await camera.takePictureAsync();

      const base64 = photo.base64;
      const index = photo.base64.indexOf(',');
      const data = photo.base64.substring(index + 1);

      const resp = await sageMaker.invokeApi(data);

      console.log(resp);

      const location = await currentPositionPromise;

      if (props.onDetected) {
        props.onDetected(base64, resp, location.coords);
      }
    } finally {
      setRunning(false);
    }
  }

  const buttonArea = () => {
    const buttonAreaStyle: any = {
      flex: 1, 
      flexDirection: 'column-reverse', 
      paddingBottom: 64, 
      alignItems: 'center',
    };

    if (running) {
      return (
        <View style={buttonAreaStyle}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={{ ...buttonAreaStyle, width: '100%', height: '100%' }} onPress={captureImage}>
          <Text style={{ ...styles.text, color: 'white' }}>Capture</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{ width: '100%', height, minHeight: height, alignItems: 'center', justifyContent: 'space-around' }}>
      <Camera ratio="4:3" style={{ width }} type={CameraType.back} onCameraReady={() => setReady(true)} ref={r => camera = r}>
        {ready && <View style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>{buttonArea()}</View>}
      </Camera>
    </View>
  );
}
