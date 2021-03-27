import React, {useEffect, useState} from 'react';
import {ScrollView, Image as ImageUtility, Button} from 'react-native';
// @ts-ignore
import AnimatedProgressWheel from 'react-native-progress-wheel';
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
  // @ts-ignore
} from 'react-native-tesseract-ocr';
import { Text, Div, Image } from 'react-native-magnus';
import PickImage, { PickerType } from '../components/PickImage';
import layout from '../constants/Layout';

enum PickerPhase {
  Initial,
  Fetched,
  Loading,
  Processed
}

export default function CaptureScreen() {
  const [phase, setPhase] = useState<PickerPhase>(PickerPhase.Initial);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState<PickerType | undefined>(undefined);
  const [imageWidth, setImageWidth] = useState<number>(-1);
  const [imageHeight, setImageHeight] = useState<number>(-1);
  const [text, setText] = useState<string>();

  useEventListener('onProgressChange', (p: {percent: number}) => {
    setProgress(p.percent / 100);
  });

  useEffect(() => {
    if (image && image.path) {
      ImageUtility.getSize(image.path, (width: number, height: number) => {
        setImageWidth(width);
        setImageHeight(height);
      })
    } else {
      setImageWidth(-1);
      setImageHeight(-1);
    }
  }, [image])

  const recognizeTextFromImage = async (i: PickerType) => {
    setPhase(PickerPhase.Loading);

    try {
      const tesseractOptions = {};
      const recognizedText = await TesseractOcr.recognize(
        i.path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      setText(recognizedText);
    } catch (err) {
      console.error(err);
      setText('');
    }

    setPhase(PickerPhase.Processed);
    setProgress(0);
  };

  const maxImageDimensions = {
    maxWidth: layout.window.width,
    maxHeight: layout.window.height * 0.5,
    width: layout.window.width,
    height: layout.window.height * 0.5
  }

  const imageAspectRatio = imageHeight > 0 ? imageWidth / imageHeight : 1;
  const imageDimensions = {
    width: imageAspectRatio > 0.5 ? maxImageDimensions.maxWidth : maxImageDimensions.maxWidth * imageAspectRatio,
    height: imageAspectRatio > 0.5 ? maxImageDimensions.maxHeight / imageAspectRatio : maxImageDimensions.maxHeight,
  }
  maxImageDimensions.height = imageDimensions.height

  const getPageContents = () => {
    switch (phase) {
      case PickerPhase.Initial:
        return (
          <PickImage onChange={(i: PickerType) => {
            setImage(i)
            setPhase(PickerPhase.Fetched)
          }} />
        );
      case PickerPhase.Fetched:
        return (
          <>
            <Div mb="lg">
              {image && <Image h={imageDimensions.height} w={imageDimensions.width} source={{uri: image.path}} />}
            </Div>
            <Div row justifyContent={"center"} alignItems="center">
              <Button title="Capture Text" onPress={() => image && recognizeTextFromImage(image)}/>
              <Div mr="lg"></Div>
              <Button title="Cancel" onPress={() => {
                setImage(undefined)
                setPhase(PickerPhase.Initial)
              }}/>
            </Div>
          </>
        );
      case PickerPhase.Loading:
        return (
          <Div alignSelf="center" h={layout.window.height - layout.statusBarHeight} justifyContent="center">
            <AnimatedProgressWheel style={{display: 'flex'}} progress={progress} />
          </Div>
        );
      case PickerPhase.Processed:
        return (
          <Div p="md">
            <Text mb="lg">{text}</Text>
            <Div row justifyContent={"center"} alignItems="center">
              <Button title="Save Recipe" onPress={() => {}}/>
              <Div mr="lg"></Div>
              <Button title="Choose Different Image" onPress={() => {
                setImage(undefined)
                setPhase(PickerPhase.Initial)
              }}/>
            </Div>
          </Div>
        );
    }
  }

  return (
    <ScrollView>
      {getPageContents()}
    </ScrollView>
  );
}
