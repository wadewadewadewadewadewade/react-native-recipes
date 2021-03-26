import React, { useEffect } from 'react';
import { Button, StyleSheet, Platform } from 'react-native';
import { View } from '../components/Themed';
import ImagePicker from 'react-native-image-crop-picker';

export type PickerPermissions = {
  library: boolean
  camera: boolean
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
  onChange: (uri: string) => void
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
      const image = ((await ImagePicker.openPicker(options)) as unknown) as {path: string};
      onChange(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const captureImage = async (options = defaultPickerOptions) => {
    try {
      const image = ((await ImagePicker.openCamera(options)) as unknown) as {path: string};
      onChange(image.path);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.options}>
      <Button title="Pick an image from camera roll" onPress={() => pickImage()} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Take a picture with the camera" onPress={() => captureImage()} />
    </View>
  );
}
const styles = StyleSheet.create({
  options: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
