import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, useWindowDimensions  } from 'react-native';
import SageMakerRuntime from '../adapter/sagemaker_adapater';
import styles from '../styles';

const sageMaker = new SageMakerRuntime();

interface CameraComponentProps {
  onDetected?: (base64Img: String, plate: string) => void;
}

export default function CameraComponent(props: CameraComponentProps) {
  const [ready, setReady] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [running, setRunning] = useState(false);

  let { width, height } = useWindowDimensions();
  width = Math.min(Math.floor(height*(2/3)), width);
  height = width;

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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
      const photo = await camera.takePictureAsync();

      const base64 = photo.base64;
      const index = photo.base64.indexOf(',');
      const data = photo.base64.substring(index + 1);

      const resp = "OK"; // await sageMaker.invoke(data);

      console.log(resp);

      if (props.onDetected) {
        props.onDetected(base64, resp);
      }
    } finally {
      setRunning(false);
    }
  }

  const buttonArea = () => {
    if (running) {
      return (
        <View style={styles.button}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.text}>Capture</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{ width: '100%', height, minHeight: height, alignItems: 'center', justifyContent: 'space-around' }}>
      <Camera ratio="1:1" style={{ width }} type={CameraType.back} onCameraReady={() => setReady(true)} ref={r => camera = r}>
        {ready && <View style={styles.buttonContainer}>{buttonArea()}</View>}
      </Camera>
    </View>
  );
}
