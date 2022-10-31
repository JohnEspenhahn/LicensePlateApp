# Usage

A react-native application with license plate detection model hosted on SageMaker serverless

![](https://johnespe-open-lpr-plate-detection-site.s3.amazonaws.com/demo.gif)

| Platform | Link |
| --- | --- |
| Web | https://johnespe-open-lpr-plate-detection-site.s3.us-east-1.amazonaws.com/index.html |
| Android | https://johnespe-open-lpr-plate-detection-model.s3.amazonaws.com/app-release.apk |
| IOS | TODO |



# Service

The backend infrastructure for the model and map image generation is available at:

https://github.com/JohnEspenhahn/LicensePlateService

To target your own deployment, update `config/config.ts`

# Developer commands

## npm run postinstall

Used to fix the following:

### expo-camera peer dependencies

https://stackoverflow.com/questions/71190250/camera-not-working-with-react-native-expo-invalid-hook-call
