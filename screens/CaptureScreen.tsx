import React, {useEffect, useState} from 'react';
import {useWindowDimensions, StyleSheet, Image, Button} from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
} from 'react-native-tesseract-ocr';
import { Text, View } from '../components/Themed';
import PickImage from '../components/PickImage';

type ImageUri = {uri: string} | null

export default function CaptureScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState<ImageUri>(null);
  const [imageWidth, setImageWidth] = useState<number>(-1);
  const [imageHeight, setImageHeight] = useState<number>(-1);
  const [text, setText] = useState<string>();
  const window = useWindowDimensions();

  useEventListener('onProgressChange', (p: {percent: number}) => {
    setProgress(p.percent / 100);
  });

  useEffect(() => {
    if (imgSrc) {
      Image.getSize(imgSrc.uri, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
      })
    } else {
      setImageWidth(-1);
        setImageHeight(-1);
    }
  }, [imgSrc])

  const recognizeTextFromImage = async (path: any) => {
    setIsLoading(true);

    try {
      const tesseractOptions = {};
      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      setText(recognizedText);
    } catch (err) {
      console.error(err);
      setText('');
    }

    setIsLoading(false);
    setProgress(0);
  };

  const maxImageDimensions = {
    maxWidth: window.width,
    maxHeight: window.height * 0.5,
    width: window.width,
    height: window.height * 0.5
  }

  const imageAspectRatio = imageHeight > 0 ? imageWidth / imageHeight : 1;
  const imageDimensions = {
    width: imageAspectRatio > 0.5 ? maxImageDimensions.maxWidth : maxImageDimensions.maxWidth * imageAspectRatio,
    height: imageAspectRatio > 0.5 ? maxImageDimensions.maxHeight / imageAspectRatio : maxImageDimensions.maxHeight,
  }
  maxImageDimensions.height = imageDimensions.height

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {(!isLoading && !text && !imgSrc) && (
        <>
          <Text style={styles.instructions}>Select an image source:</Text>
          <PickImage onChange={(uri: string) => {
            setImgSrc({uri})
          }} />
        </>
      )}
      {imgSrc && (
        <>
          <View style={{...styles.imageContainer, ...maxImageDimensions}}>
            <Image style={{...styles.image, ...imageDimensions}} source={imgSrc} />
          </View>
          <View style={styles.buttons}>
            <Button title="Capture Text" onPress={recognizeTextFromImage} />
            <Button title="Cancel" onPress={() => setImgSrc(null)} />
          </View>
        </>
      )}
      {(isLoading || text) && isLoading ? (
        <AnimatedProgressWheel progress={progress} />
      ) : (
        <Text>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
  button: {
    marginHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderStyle:'solid',
  },
  image: {
    display: 'flex',
    marginVertical: 15,
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
