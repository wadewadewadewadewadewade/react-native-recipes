import React, { useEffect, useRef } from 'react';
import { Button, StyleSheet, Platform } from 'react-native';
import { View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';

export type PickerPermissions = {
  library: boolean
  camera: boolean
}

export default function PickImage({
  onChange
}: {
  onChange: (uri: string) => void
}) {
  const permissions = useRef<PickerPermissions>({library: false, camera: false})

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (libraryStatus !== 'granted') {
          alert('Sorry, we need camera roll permissions at a minimum to make this work!');
        } else {
          permissions.current = {
            library: libraryStatus === 'granted',
            camera: cameraStatus === 'granted' // this permission is not required
          }
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      onChange(result.uri);
    }
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      onChange(result.uri);
    }
  };

  return (
    <View style={styles.options}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Take a picture with the camera" onPress={captureImage} />
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
