import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import SageMakerRuntime from '../adapter/sagemaker_adapater';
import styles from '../styles';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const base64ImgPrefix = 'data:image/png;base64,';
const sageMaker = new SageMakerRuntime();
const resizeToPx = 800;

interface CameraComponentProps {
  onDetect: (base64Img: string, coords: Location.LocationObjectCoords) => string;
  onDetected: (id: string, plate: string) => void;
}

export function getCameraDimensions() {
  let { width, height } = useWindowDimensions();
  width = Math.round(Math.min(Math.floor(height/2), width));
  height = width; // Math.floor(width * (3/4));
  return { width, height };
}

export default function CameraComponent(props: CameraComponentProps) {
  const [ready, setReady] = useState(false);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [running, setRunning] = useState(false);
  const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions();

  const { width, height } = getCameraDimensions();

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

  let camera: Camera;
  async function captureImage() {
    if (!camera) {
      return;
    }

    const currentPositionPromise = Location.getCurrentPositionAsync();

    setRunning(true);    

    let data: string;
    let photo: CameraCapturedPicture;
    try {
      photo = await camera.takePictureAsync();
      if (photo.base64) {
        const index = photo.base64.indexOf(',');
        data = photo.base64.substring(index + 1);
      } else if (photo.uri) {
        data = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
    } catch (e) {
      throw e;
    } finally {
      setRunning(false);
    }

    // Actually crop to 1:1
    const size = Math.min(photo.width, photo.height);
    const x = (photo.width - size) / 2;
    const y = (photo.height - size) / 2;

    const resizeResult = await ImageManipulator.manipulateAsync(
      base64ImgPrefix + data,
      [ 
        { crop: { originX: x, originY: y, width: size, height: size } },
        { resize: { height: resizeToPx } },
      ],
      { 
        base64: true,
        format: ImageManipulator.SaveFormat.PNG,
      }
    );

    const location = await currentPositionPromise;
    const id = props.onDetect(base64ImgPrefix + resizeResult.base64, location.coords);

    let resp = "error";
    try {
      resp = await sageMaker.invokeApi(resizeResult.base64);
      if (!resp) {
        resp = "not found";
      }
    } finally {
      props.onDetected(id, resp);
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
      <Camera ratio="1:1" style={{ width, height }} type={CameraType.back} onCameraReady={() => setReady(true)} ref={r => camera = r}>
        {ready && <View style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>{buttonArea()}</View>}
      </Camera>
    </View>
  );
}
