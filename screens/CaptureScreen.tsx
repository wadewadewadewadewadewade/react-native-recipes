import React, { useEffect, useState } from 'react';
import {ScrollView, Image as ImageUtility, Button} from 'react-native';
import ml from '@react-native-firebase/ml';
import { Text, Div, Image, Input } from 'react-native-magnus';
import PickSource, { DataType, ImageType, PickerTypes } from '../components/PickImage';
import layout from '../constants/Layout';
import cheerio from 'cheerio';
import { Keyboard } from 'react-native';
import { RecipeType } from './RecipesScreen'
import { StorageContext } from '../context/Storage'

enum PickerPhase {
  Initial,
  Fetched,
  Loading,
  Processed
}

export default function CaptureScreen() {
  const [source, setSource] = useState<string>('Image');
  const [title, setTitle] = useState<string>('Unknown');
  const [phase, setPhase] = useState<PickerPhase>(PickerPhase.Initial);
  const [image, setImage] = useState<ImageType | undefined>(undefined);
  const [imageWidth, setImageWidth] = useState<number>(-1);
  const [imageHeight, setImageHeight] = useState<number>(-1);
  const [text, setText] = useState<string>();
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false)

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

  const saveRecipe = async () => {
    if (text && text.length > 0) {
      const recipe: RecipeType = {
        title,
        source,
        recipe: text
      };
      
      setText(undefined);
      setImage(undefined);
      setPhase(PickerPhase.Initial);
      
    }
  }

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true)
  })
  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardOpen(false)
  })

  const textInputHeight = keyboardOpen 
    ? layout.window.height - layout.statusBarHeight - layout.tabsHeight - 210
    : layout.window.height - layout.statusBarHeight - layout.tabsHeight;

  const recognizeTextFromImage = async (i: ImageType) => {
    setPhase(PickerPhase.Loading);

    try {
      const recognized = await ml().cloudDocumentTextRecognizerProcessImage(i.path);
      console.log(JSON.stringify(recognized));
      setText(recognized.text);
    } catch (err) {
      console.error(err);
      setText('');
    }

    setPhase(PickerPhase.Processed);
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
          <PickSource onChange={async (t: PickerTypes, d: DataType) => {
            if (t === PickerTypes.Image) {
              setImage(d as ImageType)
              setSource('Image')
              setPhase(PickerPhase.Fetched)
            } else if (t === PickerTypes.Web) {
              try {
                const response = await fetch(d as string);
                const html = await response.text();
                const $ = cheerio.load(html);
                const rawText = $('body').text()
                setText(rawText.replace(/^(\s*\n){2,}/gm,'\n'));
                setSource(d as string)
                setTitle($('head title').text())
                setPhase(PickerPhase.Processed)
              } catch (ex) {
                setPhase(PickerPhase.Initial)
                console.error(JSON.stringify(ex))
              }
            }
          }} />
        );
      case PickerPhase.Fetched:
        return (
          <Div row m="lg" justifyContent={"center"} alignItems="center">
            <Button title="Capture Text" onPress={() => image && recognizeTextFromImage(image)}/>
            <Div mr="lg"></Div>
            <Button title="Cancel" onPress={() => {
              setImage(undefined)
              setPhase(PickerPhase.Initial)
            }}/>
          </Div>
        );
      case PickerPhase.Loading:
        return (
          <Div alignSelf="center" h={layout.window.height - layout.statusBarHeight} justifyContent="center">
            <Text>Loading...</Text>
          </Div>
        );
      case PickerPhase.Processed:
        return (
          <Div p="md">
            <Div row justifyContent={"center"} alignItems="center">
              <Button title="Save Recipe" onPress={() => saveRecipe()}/>
              <Div mr="lg"></Div>
              <Button title="Choose Different Source" onPress={() => {
                setImage(undefined)
                setPhase(PickerPhase.Initial)
              }}/>
            </Div>
            <Input
              h={textInputHeight}
              editable
              multiline
              mt="lg"
              value={text}
              onChange={(e) => setText(e.nativeEvent.text)}
            />
          </Div>
        );
    }
  }

  return (
    <ScrollView>
      <StorageContext.Consumer>
        {(value) => {
          if (value && value.get) {
            return (
              <>
                {getPageContents()}
                {image && (
                  <Div mb="lg">
                    <Image h={imageDimensions.height} w={imageDimensions.width} source={{uri: image.path}} />
                  </Div>
                )}
              </>
            )
          } else {
            return (<Text>Please select a data source.</Text>)
          }
        }}
      </StorageContext.Consumer>
    </ScrollView>
  );
}
