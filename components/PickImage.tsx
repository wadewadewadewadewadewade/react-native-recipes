import React, { useState } from 'react';
import { Keyboard, Button } from 'react-native';
import { Div, Text, Input } from 'react-native-magnus';
import ImagePicker from 'react-native-image-crop-picker';

export enum PickerTypes {
  Image,
  Web
}

export type ImageType = {
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

export type DataType = ImageType | string

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: false,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

export default function PickSource({
  onChange
}: {
  onChange: (type: PickerTypes, data: DataType) => void
}) {
  const [url, setUrl] = useState<string | undefined>(undefined);

  const pickImage = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openPicker(options) as ImageType;
      onChange(PickerTypes.Image, image);
    } catch (err) {
      if (err.message !== 'User cancelled image selection') {
        console.error(err);
      }
    }
  };

  const captureImage = async (options = defaultPickerOptions) => {
    try {
      const image = await ImagePicker.openCamera(options) as ImageType;
      onChange(PickerTypes.Image, image);
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
      <Div mb="xl"></Div>
      <Text fontWeight="bold" mt="xl" mb="lg">Scrape recipe from web</Text>
      <Input
        fontSize="md"
        onChange={(e) => setUrl(e.nativeEvent.text)}
        onSubmitEditing={() => {
          url && onChange(PickerTypes.Web, url);
          setUrl(undefined);
          Keyboard.dismiss();
        }}
        placeholder="https://example.com/path"
      />
    </Div>
  );
}
