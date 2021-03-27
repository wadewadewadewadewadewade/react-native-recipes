import React, { useEffect } from 'react';
import { Button, Platform } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import ImagePicker from 'react-native-image-crop-picker';

export type PickerPermissions = {
  library: boolean
  camera: boolean
}

export type PickerType = {
  "cropRect": {
    "height": number,
    "width": number,
    "y": number,
    "x": number
  },
  "modificationDate": string,
  "size":number,
  "mime":string,
  "height": number,
  "width":number,
  "path":string
}

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

export default function PickImage({
  onChange
}: {
  onChange: (image: PickerType) => void
}) {
  // const permissions = useRef<PickerPermissions>({library: false, camera: false})

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        /*const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (libraryStatus !== 'granted') {
          alert('Sorry, we need camera roll permissions at a minimum to make this work!');
        } else {
          permissions.current = {
            library: libraryStatus === 'granted',
            camera: cameraStatus === 'granted' // this permission is not required
          }
        }*/
      }
    })();
  }, []);

  const pickImage = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openPicker(options) as PickerType;
      onChange(image);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const captureImage = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openCamera(options) as PickerType;
      onChange(image);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <Div m="md">
      <Text mb="xl" fontWeight="bold" fontSize="xl">Select an image source:</Text>
      <Button title="Pick an image from camera roll" onPress={() => pickImage()} />
      <Div mb="xl"></Div>
      <Button title="Take a picture with the camera" onPress={() => captureImage()} />
    </Div>
  );
}
